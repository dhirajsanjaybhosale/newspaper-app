const mongoose = require('mongoose');

const newspaperSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A newspaper must have a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    publisher: {
      type: String,
      required: [true, 'Please provide publisher name'],
    },
    languages: [{
      type: String,
      required: [true, 'Please provide at least one language'],
    }],
    categories: [{
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'business', 'sports', 'entertainment', 'technology', 'politics'],
      required: [true, 'Please provide at least one category'],
    }],
    price: {
      monthly: {
        type: Number,
        required: [true, 'Please provide monthly subscription price'],
      },
      quarterly: {
        type: Number,
        required: [true, 'Please provide quarterly subscription price'],
      },
      yearly: {
        type: Number,
        required: [true, 'Please provide yearly subscription price'],
      },
    },
    coverImage: {
      type: String,
      required: [true, 'A newspaper must have a cover image'],
    },
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10, // 4.6666 -> 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate reviews
newspaperSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'newspaper',
  localField: '_id',
});

// Index for better performance
newspaperSchema.index({ price: 1, ratingsAverage: -1 });
newspaperSchema.index({ name: 'text', description: 'text' });

const Newspaper = mongoose.model('Newspaper', newspaperSchema);

module.exports = Newspaper;
