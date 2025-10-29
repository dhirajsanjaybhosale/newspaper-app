const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subscription',
      required: [true, 'Payment must belong to a subscription'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Payment must belong to a user'],
    },
    paymentId: {
      type: String,
      required: [true, 'Payment ID is required'],
    },
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
    },
    signature: {
      type: String,
      required: [true, 'Payment signature is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'captured', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'netbanking', 'upi', 'wallet'],
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    refund: {
      id: String,
      amount: Number,
      currency: String,
      status: String,
      speed: String,
      receipt: String,
      processedAt: Date,
      reason: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ subscription: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
