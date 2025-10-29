const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Create Razorpay order
router.post('/create-order', paymentController.createOrder);

// Verify payment and update subscription
router.post('/verify', paymentController.verifyPayment);

// Get payment details for a subscription
router.get('/:id', paymentController.getPaymentDetails);

// Process refund (admin only)
router.post(
  '/refund',
  authController.restrictTo('admin'),
  paymentController.refundPayment
);

// Get all payments (admin only)
router.get(
  '/',
  authController.restrictTo('admin'),
  paymentController.getAllPayments
);

module.exports = router;
