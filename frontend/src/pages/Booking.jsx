import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const Booking = () => {
  const { user } = useContext(AuthContext);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [message, setMessage] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!pickup || !dropoff || !date || !time) {
      setMessage("Please fill all required fields.");
      return;
    }
    try {
      const bookingData = {
        userId: user.userId,
        pickup,
        dropoff,
        date,
        time,
        passengers,
      };
      await axios.post("http://localhost:5000/api/bookings", bookingData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage("Booking successful!");
      setPickup("");
      setDropoff("");
      setDate("");
      setTime("");
      setPassengers(1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 glassmorphism rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">Book a Ride</h2>
      {message && (
        <div className={`mb-4 p-2 rounded ${message.includes("successful") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleBooking} className="space-y-4">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="text"
          placeholder="Dropoff Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="number"
          min="1"
          max="10"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Number of passengers"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Booking;
