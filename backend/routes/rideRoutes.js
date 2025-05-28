const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  bookRide,
  getCustomerRides,
  getDriverRides,
  getAvailableRides,
  acceptRide,
  startRide,
  updateLocation,
  completeRide
} = require('../controllers/rideController');

// Customer books a ride
router.post('/book', auth, role('customer'), bookRide);
router.get('/customer', auth, role('customer'), getCustomerRides);

// Driver views rides assigned
router.get('/driver', auth, role('driver'), getDriverRides);

// Driver views available rides to accept
router.get('/available', auth, role('driver'), getAvailableRides);
router.post('/accept', auth, role('driver'), acceptRide);

// Driver updates ride status
router.post('/start/:rideId', auth, role('driver'), startRide);
router.post('/location/:rideId', auth, role('driver'), updateLocation);
router.post('/complete/:rideId', auth, role('driver'), completeRide);

module.exports = router;
