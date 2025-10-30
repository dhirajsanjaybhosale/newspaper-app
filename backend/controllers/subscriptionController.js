const Subscription = require('../models/subscriptionModel');
const Newspaper = require('../models/newspaperModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 🧩 Helper: calculate end date
const calculateEndDate = (startDate, plan) => {
  const date = new Date(startDate);
  if (plan === 'quarterly') date.setMonth(date.getMonth() + 3);
  else if (plan === 'yearly') date.setFullYear(date.getFullYear() + 1);
  else date.setMonth(date.getMonth() + 1); // default monthly
  return date;
};

// 🆕 Create a new subscription
exports.createSubscription = catchAsync(async (req, res, next) => {
  const { newspaperId, plan, deliveryAddress, deliveryTime } = req.body;

  const newspaper = await Newspaper.findById(newspaperId);
  if (!newspaper) return next(new AppError('No newspaper found with that ID', 404));

  const startDate = new Date();
  const endDate = calculateEndDate(startDate, plan);

  const subscription = await Subscription.create({
    user: req.user.id,
    newspaper: newspaperId,
    plan,
    startDate,
    endDate,
    deliveryAddress,
    deliveryTime,
    status: 'active'
  });

  res.status(201).json({
    status: 'success',
    data: { subscription }
  });
});

// 📄 Get all subscriptions
exports.getAllSubscriptions = catchAsync(async (req, res, next) => {
  const filter = req.user.role === 'customer' ? { user: req.user.id } : {};
  const subscriptions = await Subscription.find(filter)
    .populate('user', 'name email')
    .populate('newspaper', 'name price');

  res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    data: { subscriptions }
  });
});

// 🔍 Get a single subscription
exports.getSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id)
    .populate('user', 'name email')
    .populate('newspaper', 'name price');

  if (!subscription) return next(new AppError('No subscription found', 404));
  if (req.user.role === 'customer' && subscription.user._id.toString() !== req.user.id)
    return next(new AppError('You are not allowed to view this subscription', 403));

  res.status(200).json({
    status: 'success',
    data: { subscription }
  });
});

// ✏️ Update subscription (address, time, status)
exports.updateSubscription = catchAsync(async (req, res, next) => {
  const allowedFields = ['deliveryAddress', 'deliveryTime', 'status'];
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) updates[key] = req.body[key];
  });

  const subscription = await Subscription.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  })
    .populate('user', 'name email')
    .populate('newspaper', 'name price');

  if (!subscription) return next(new AppError('No subscription found', 404));

  res.status(200).json({
    status: 'success',
    data: { subscription }
  });
});

// ❌ Cancel subscription
exports.cancelSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) return next(new AppError('No subscription found', 404));

  if (req.user.role === 'customer' && subscription.user.toString() !== req.user.id)
    return next(new AppError('You are not allowed to cancel this subscription', 403));

  subscription.status = 'cancelled';
  await subscription.save();

  res.status(200).json({
    status: 'success',
    message: 'Subscription cancelled successfully'
  });
});
