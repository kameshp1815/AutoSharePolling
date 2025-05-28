const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // assigned driver
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  pickupCoords: { type: [Number], index: '2dsphere', required: true },  // [lng, lat]
  dropoffCoords: { type: [Number], index: '2dsphere', required: true }, // [lng, lat]
  currentCoords: { type: [Number], index: '2dsphere' }, // updated during ride by driver
  isPool: { type: Boolean, default: false },
  fare: { type: Number, required: true },
  status: { type: String, enum: ['requested', 'accepted', 'started', 'completed', 'cancelled'], default: 'requested' },
  route: {
    distance: Number,
    duration: Number,
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', RideSchema);
