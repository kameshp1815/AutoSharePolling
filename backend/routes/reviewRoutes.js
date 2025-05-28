const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { addReview, getDriverReviews } = require('../controllers/reviewController');

// Customer adds review
router.post('/', auth, role('customer'), addReview);

// Driver views their reviews
router.get('/', auth, role('driver'), getDriverReviews);

module.exports = router;
