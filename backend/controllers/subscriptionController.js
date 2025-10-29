const Subscription = require('../models/subscriptionModel');
const Newspaper = require('../models/newspaperModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Helper function to calculate end date based on subscription type
const calculateEndDate = (startDate, subscriptionType) => {
  const date = new Date(startDate);
  switch (subscriptionType) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  return date;
};

// Helper function to find the nearest distributor
const findNearestDistributor = async (deliveryLocation) => {
  const distributors = await User.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [deliveryLocation.coordinates[0], deliveryLocation.coordinates[1]],
        },
        distanceField: 'distance',
        spherical: true,
        maxDistance: 10000, // 10km radius
        query: { role: 'distributor', active: true },
      },
    },
    { $limit: 1 },
  ]);

  return distributors.length > 0 ? distributors[0]._id : null;
};

exports.createSubscription = catchAsync(async (req, res, next) => {
  const { newspaperId, subscriptionType, deliveryAddress, deliveryTime } = req.body;
  const userId = req.user.id;

  // 1) Get the newspaper and check if it exists
  const newspaper = await Newspaper.findById(newspaperId);
  if (!newspaper) {
    return next(new AppError('No newspaper found with that ID', 404));
  }

  // 2) Calculate start and end dates
  const startDate = new Date();
  const endDate = calculateEndDate(startDate, subscriptionType);

  // 3) Find nearest distributor
  const distributorId = await findNearestDistributor(deliveryAddress.location);
  if (!distributorId) {
    return next(new AppError('No distributor available in your area', 400));
  }

  // 4) Create subscription
  const subscription = await Subscription.create({
    user: userId,
    newspaper: newspaperId,
    startDate,
    endDate,
    status: 'pending_payment',
    deliveryAddress,
    deliveryTime,
    distributor: distributorId,
  });

  // 5) Populate the subscription with newspaper and user details
  await subscription.populate('newspaper user distributor');

  res.status(201).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

exports.getAllSubscriptions = catchAsync(async (req, res, next) => {
  const filter = {};
  
  // If user is not admin, only return their subscriptions
  if (req.user.role === 'customer') {
    filter.user = req.user.id;
  } else if (req.user.role === 'distributor') {
    filter.distributor = req.user.id;
  }

  const subscriptions = await Subscription.find(filter)
    .populate('user', 'name email phone')
    .populate('newspaper', 'name price')
    .populate('distributor', 'name phone');

  res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    data: {
      subscriptions,
    },
  });
});

exports.getSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('newspaper', 'name price')
    .populate('distributor', 'name phone');

  if (!subscription) {
    return next(new AppError('No subscription found with that ID', 404));
  }

  // Check if user has permission to view this subscription
  if (
    req.user.role === 'customer' &&
    subscription.user._id.toString() !== req.user.id
  ) {
    return next(
      new AppError('You do not have permission to view this subscription', 403)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

exports.updateSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new AppError('No subscription found with that ID', 404));
  }

  // Check if user has permission to update this subscription
  if (
    req.user.role === 'customer' &&
    subscription.user.toString() !== req.user.id
  ) {
    return next(
      new AppError('You do not have permission to update this subscription', 403)
    );
  }

  // Only allow certain fields to be updated
  const allowedFields = ['deliveryAddress', 'deliveryTime', 'status'];
  const filteredBody = Object.keys(req.body)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  // If updating delivery address, find the nearest distributor
  if (filteredBody.deliveryAddress && filteredBody.deliveryAddress.location) {
    const distributorId = await findNearestDistributor(
      filteredBody.deliveryAddress.location
    );
    if (distributorId) {
      filteredBody.distributor = distributorId;
    }
  }

  const updatedSubscription = await Subscription.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('user', 'name email phone')
    .populate('newspaper', 'name price')
    .populate('distributor', 'name phone');

  res.status(200).json({
    status: 'success',
    data: {
      subscription: updatedSubscription,
    },
  });
});

exports.cancelSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new AppError('No subscription found with that ID', 404));
  }

  // Check if user has permission to cancel this subscription
  if (
    req.user.role === 'customer' &&
    subscription.user.toString() !== req.user.id
  ) {
    return next(
      new AppError('You do not have permission to cancel this subscription', 403)
    );
  }

  // Update subscription status to cancelled
  subscription.status = 'cancelled';
  await subscription.save();

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

exports.getSubscriptionStats = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to view subscription stats', 403)
    );
  }

  const stats = await Subscription.aggregate([
    {
      $match: { status: { $ne: 'cancelled' } },
    },
    {
      $group: {
        _id: '$newspaper',
        nSubscriptions: { $sum: 1 },
        avgDuration: { $avg: { $subtract: ['$endDate', '$startDate'] } },
        minDuration: { $min: { $subtract: ['$endDate', '$startDate'] } },
        maxDuration: { $max: { $subtract: ['$endDate', '$startDate'] } },
      },
    },
    {
      $lookup: {
        from: 'newspapers',
        localField: '_id',
        foreignField: '_id',
        as: 'newspaper',
      },
    },
    {
      $unwind: '$newspaper',
    },
    {
      $project: {
        _id: 0,
        newspaper: '$newspaper.name',
        nSubscriptions: 1,
        avgDuration: 1,
        minDuration: 1,
        maxDuration: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
