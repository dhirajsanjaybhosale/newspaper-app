const crypto = require('crypto');
const Razorpay = require('razorpay');
const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const twilio = require('../utils/twilio');

// Lazy initialization of Razorpay instance
let razorpay = null;

const getRazorpayInstance = () => {
  if (!razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    // Only initialize if credentials are provided
    if (keyId && keySecret) {
      razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
  }
  return razorpay;
};

// Create a Razorpay order for subscription payment
exports.createOrder = catchAsync(async (req, res, next) => {
  const { subscriptionId } = req.body;

  // 1) Get the subscription
  const subscription = await Subscription.findById(subscriptionId).populate(
    'newspaper user'
  );

  if (!subscription) {
    return next(new AppError('No subscription found with that ID', 404));
  }

  // 2) Verify user has permission to pay for this subscription
  if (
    req.user.role === 'customer' &&
    subscription.user._id.toString() !== req.user.id
  ) {
    return next(
      new AppError('You do not have permission to pay for this subscription', 403)
    );
  }

  // 3) Calculate amount based on subscription type (assuming monthly for now)
  const amount = subscription.newspaper.price.monthly * 100; // Convert to paise

  // 4) Create Razorpay order
  const options = {
    amount,
    currency: 'INR',
    receipt: `sub_${subscription._id}_${Date.now()}`,
    payment_capture: 1, // Auto capture payment
    notes: {
      subscriptionId: subscription._id.toString(),
      userId: req.user.id,
    },
  };

  try {
    const razorpayInstance = getRazorpayInstance();
    
    if (!razorpayInstance) {
      // In development, simulate order creation
      const mockOrder = {
        id: `order_test_${Date.now()}`,
        amount,
        currency: 'INR',
        receipt: options.receipt,
      };
      
      console.log('💳 Mock Razorpay order created (Razorpay not configured)');
      
      subscription.paymentOrderId = mockOrder.id;
      await subscription.save();
      
      return res.status(200).json({
        status: 'success',
        data: {
          order: mockOrder,
          key: 'test_key',
        },
      });
    }
    
    const order = await razorpayInstance.orders.create(options);

    // 5) Update subscription with order ID
    subscription.paymentOrderId = order.id;
    await subscription.save();

    res.status(200).json({
      status: 'success',
      data: {
        order,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    console.error('❌ Razorpay order creation error:', err);
    return next(new AppError('Error creating payment order', 500));
  }
});

// Verify Razorpay payment and update subscription
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // 1) Get the subscription based on the order ID
  const subscription = await Subscription.findOne({
    paymentOrderId: razorpay_order_id,
  }).populate('user newspaper distributor');

  if (!subscription) {
    return next(new AppError('No subscription found for this payment', 404));
  }

  // 2) Verify payment signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return next(new AppError('Invalid payment signature', 400));
  }

  // 3) Update subscription status
  subscription.status = 'active';
  subscription.payment = {
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    signature: razorpay_signature,
    amount: subscription.newspaper.price.monthly,
    currency: 'INR',
    status: 'captured',
    paidAt: Date.now(),
  };
  await subscription.save();

  // 4) Send confirmation email and SMS
  try {
    // Send email (implement email service)
    // await new Email(subscription.user).sendPaymentConfirmation(subscription);

    // Send SMS notification
    await twilio.sendSMS(
      subscription.user.phone,
      `Your payment of ₹${subscription.payment.amount} for ${subscription.newspaper.name} subscription has been received. Thank you!`
    );

    // Notify distributor
    if (subscription.distributor) {
      await twilio.sendSMS(
        subscription.distributor.phone,
        `New subscription for ${subscription.newspaper.name} at ${subscription.deliveryAddress.address}. Customer: ${subscription.user.name}, Phone: ${subscription.user.phone}`
      );
    }
  } catch (err) {
    console.error('Error sending notifications:', err);
    // Don't fail the request if notifications fail
  }

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

// Get payment details for a subscription
exports.getPaymentDetails = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id).select(
    '+payment'
  );

  if (!subscription) {
    return next(new AppError('No subscription found with that ID', 404));
  }

  // Check permissions
  if (
    req.user.role === 'customer' &&
    subscription.user.toString() !== req.user.id
  ) {
    return next(
      new AppError(
        'You do not have permission to view these payment details',
        403
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment: subscription.payment,
    },
  });
});

// Refund a payment
exports.refundPayment = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to process refunds', 403)
    );
  }

  const { paymentId, amount, reason } = req.body;

  try {
    // First check if we have this payment in our database
    const subscription = await Subscription.findOne({
      'payment.paymentId': paymentId,
    }).populate('user');

    if (!subscription) {
      return next(new AppError('No payment found with that ID', 404));
    }

    const razorpayInstance = getRazorpayInstance();
    
    if (!razorpayInstance) {
      return next(new AppError('Razorpay is not configured', 500));
    }

    // Process refund through Razorpay
    const refund = await razorpayInstance.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
      speed: 'normal',
      notes: {
        reason: reason || 'Customer request',
        initiatedBy: req.user.id,
      },
    });

    // Update subscription status
    subscription.status = 'refunded';
    subscription.payment.refund = {
      id: refund.id,
      amount: refund.amount / 100, // Convert back to rupees
      currency: refund.currency,
      status: refund.status,
      speed: refund.speed_processed,
      receipt: refund.receipt,
      processedAt: new Date(),
      reason: reason,
    };
    await subscription.save();

    // Notify user
    if (subscription.user.phone) {
      await twilio.sendSMS(
        subscription.user.phone,
        `A refund of ₹${refund.amount / 100} for your ${subscription.newspaper} subscription has been processed. Refund ID: ${refund.id}`
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        refund,
      },
    });
  } catch (err) {
    console.error('Refund error:', err);
    return next(
      new AppError(
        err.error?.description || 'Error processing refund',
        err.statusCode || 500
      )
    );
  }
});

// Get all payments (admin only)
exports.getAllPayments = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to view all payments', 403)
    );
  }

  const subscriptions = await Subscription.find({ 'payment.paymentId': { $exists: true } })
    .select('+payment')
    .populate('user', 'name email')
    .populate('newspaper', 'name');

  const payments = subscriptions.map((sub) => ({
    id: sub.payment.paymentId,
    amount: sub.payment.amount,
    currency: sub.payment.currency,
    status: sub.payment.status,
    subscription: sub._id,
    user: sub.user,
    newspaper: sub.newspaper,
    paidAt: sub.payment.paidAt,
  }));

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments,
    },
  });
});
