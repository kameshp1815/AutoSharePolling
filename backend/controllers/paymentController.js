const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Ride = require('../models/Ride');

exports.createPaymentIntent = async (req, res) => {
  const { rideId } = req.body;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.customer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your ride' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(ride.fare * 100), // amount in cents
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment', rideId }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: 'Payment intent creation failed', error: err.message });
  }
};

exports.confirmPayment = async (req, res) => {
  const { paymentId, rideId, status } = req.body;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    // Save payment info
    const payment = new Payment({ ride: rideId, amount: ride.fare, status, paymentId });
    await payment.save();

    res.json({ message: 'Payment confirmed', payment });
  } catch (err) {
    res.status(500).json({ message: 'Payment confirmation failed', error: err.message });
  }
};
