const express = require('express');
const newspaperController = require('../controllers/newspaperController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/search', newspaperController.searchNewspapers);
router.get('/stats', newspaperController.getNewspaperStats);

router
  .route('/')
  .get(newspaperController.getAllNewspapers)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    newspaperController.createNewspaper
  );

router
  .route('/:id')
  .get(newspaperController.getNewspaper)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    newspaperController.updateNewspaper
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    newspaperController.deleteNewspaper
  );

module.exports = router;
