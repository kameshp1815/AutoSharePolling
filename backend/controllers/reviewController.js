const Review = require('../models/Review');
const Ride = require('../models/Ride');
const User = require('../models/User');

exports.addReview = async (req, res) => {
  const { rideId, rating, comment } = req.body;

  if (!rideId || !rating) return res.status(400).json({ message: 'Ride and rating are required' });

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your ride' });
    }
    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Ride not completed yet' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ ride: rideId, customer: req.user._id });
    if (existingReview) return res.status(400).json({ message: 'Review already submitted' });

    const review = new Review({
      ride: rideId,
      customer: req.user._id,
      driver: ride.driver,
      rating,
      comment
    });
    await review.save();

    // Update driver's rating
    const driver = await User.findById(ride.driver);
    driver.ratingsAverage = ((driver.ratingsAverage * driver.ratingsCount) + rating) / (driver.ratingsCount + 1);
    driver.ratingsCount += 1;
    await driver.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
};

exports.getDriverReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ driver: req.user._id }).populate('customer', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get reviews', error: err.message });
  }
};
