// Simplified fare calculation function based on distance and pooling
function calculateFare(distanceKm, isPool) {
  const baseFare = 5;       // base fare in $
  const perKmRate = 2;      // per km rate
  let fare = baseFare + (distanceKm * perKmRate);
  if (isPool) {
    fare *= 0.75; // 25% discount for pooling
  }
  return parseFloat(fare.toFixed(2));
}

module.exports = calculateFare;
