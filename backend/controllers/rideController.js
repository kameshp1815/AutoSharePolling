const Ride = require('../models/Ride');
const calculateFare = require('../utils/calculateFare');

exports.bookRide = async (req, res) => {
  const { pickup, dropoff, pickupCoords, dropoffCoords, isPool } = req.body;
  if (!pickup || !dropoff || !pickupCoords || !dropoffCoords) {
    return res.status(400).json({ message: 'Please provide pickup and dropoff info and coordinates' });
  }

  try {
    // For simplicity, assume fixed distance - in real app, calculate with map API
    const distanceKm = getDistanceFromCoords(pickupCoords, dropoffCoords);

    const fare = calculateFare(distanceKm, isPool);

    const newRide = new Ride({
      customer: req.user._id,
      pickup,
      dropoff,
      pickupCoords,
      dropoffCoords,
      isPool: !!isPool,
      fare,
      route: { distance: distanceKm }
    });

    await newRide.save();
    res.status(201).json(newRide);
  } catch (err) {
    res.status(500).json({ message: 'Failed to book ride', error: err.message });
  }
};

exports.getCustomerRides = async (req, res) => {
  try {
    const rides = await Ride.find({ customer: req.user._id }).populate('driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get rides', error: err.message });
  }
};

exports.getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).populate('customer', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get rides', error: err.message });
  }
};

exports.getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get available rides', error: err.message });
  }
};

exports.acceptRide = async (req, res) => {
  const { rideId } = req.body;
  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.status !== 'requested') return res.status(400).json({ message: 'Ride already accepted or closed' });

    ride.driver = req.user._id;
    ride.status = 'accepted';
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: 'Failed to accept ride', error: err.message });
  }
};

exports.startRide = async (req, res) => {
  const { rideId } = req.params;
  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.driver.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your ride' });
    if (ride.status !== 'accepted') return res.status(400).json({ message: 'Ride not accepted yet' });

    ride.status = 'started';
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: 'Failed to start ride', error: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  const { rideId } = req.params;
  const { currentCoords } = req.body;
  if (!currentCoords) return res.status(400).json({ message: 'Current coordinates required' });

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.driver.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your ride' });
    if (ride.status !== 'started') return res.status(400).json({ message: 'Ride not started yet' });

    ride.currentCoords = currentCoords;
    await ride.save();
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location', error: err.message });
  }
};

exports.completeRide = async (req, res) => {
  const { rideId } = req.params;
  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.driver.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your ride' });
    if (ride.status !== 'started') return res.status(400).json({ message: 'Ride not started or already completed' });

    ride.status = 'completed';
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete ride', error: err.message });
  }
};

// Helper: Calculate distance between two coordinates (Haversine formula)
function getDistanceFromCoords(coord1, coord2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
