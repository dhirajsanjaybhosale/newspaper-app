const Newspaper = require('../models/newspaperModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllNewspapers = catchAsync(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Newspaper.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const newspapers = await query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: newspapers.length,
    data: {
      newspapers,
    },
  });
});

exports.getNewspaper = catchAsync(async (req, res, next) => {
  const newspaper = await Newspaper.findById(req.params.id);

  if (!newspaper) {
    return next(new AppError('No newspaper found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      newspaper,
    },
  });
});

exports.createNewspaper = catchAsync(async (req, res, next) => {
  const newNewspaper = await Newspaper.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newspaper: newNewspaper,
    },
  });
});

exports.updateNewspaper = catchAsync(async (req, res, next) => {
  const newspaper = await Newspaper.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newspaper) {
    return next(new AppError('No newspaper found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      newspaper,
    },
  });
});

exports.deleteNewspaper = catchAsync(async (req, res, next) => {
  const newspaper = await Newspaper.findByIdAndDelete(req.params.id);

  if (!newspaper) {
    return next(new AppError('No newspaper found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getNewspaperStats = catchAsync(async (req, res, next) => {
  const stats = await Newspaper.aggregate([
    {
      $match: { isActive: { $ne: false } },
    },
    {
      $group: {
        _id: null,
        numNewspapers: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgMonthlyPrice: { $avg: '$price.monthly' },
        minMonthlyPrice: { $min: '$price.monthly' },
        maxMonthlyPrice: { $max: '$price.monthly' },
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

exports.searchNewspapers = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new AppError('Please provide a search query', 400));
  }

  const newspapers = await Newspaper.find({
    $text: { $search: search },
  }).select('name publisher price coverImage ratingsAverage');

  res.status(200).json({
    status: 'success',
    results: newspapers.length,
    data: {
      newspapers,
    },
  });
});
