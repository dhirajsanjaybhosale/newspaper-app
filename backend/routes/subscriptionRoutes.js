const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for customers to manage their subscriptions
router
  .route('/')
  .get(subscriptionController.getAllSubscriptions)
  .post(
    authController.restrictTo('customer'),
    subscriptionController.createSubscription
  );

// Routes for a specific subscription
router
  .route('/:id')
  .get(subscriptionController.getSubscription)
  .patch(
    authController.restrictTo('customer', 'admin'),
    subscriptionController.updateSubscription
  )
  .delete(
    authController.restrictTo('customer', 'admin'),
    subscriptionController.cancelSubscription
  );

// Route to get subscription statistics (admin only)
router.get(
  '/stats/subscription-stats',
  authController.restrictTo('admin'),
  subscriptionController.getSubscriptionStats
);

module.exports = router;
