const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Subscription must belong to a user'],
    },
    newspaper: {
      type: mongoose.Schema.ObjectId,
      ref: 'Newspaper',
      required: [true, 'Subscription must be for a newspaper'],
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date for the subscription'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'pending_payment'],
      default: 'pending_payment',
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      location: {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
      },
    },
    deliveryTime: {
      type: String,
      required: [true, 'Please provide preferred delivery time'],
    },
    distributor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    payment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for geospatial queries
subscriptionSchema.index({ 'deliveryAddress.location': '2dsphere' });

// Populate user and newspaper when querying subscriptions
subscriptionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email phone',
  }).populate({
    path: 'newspaper',
    select: 'name price description',
  });
  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
