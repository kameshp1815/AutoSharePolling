import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Payment = () => {
  const { user } = useContext(AuthContext);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    // Simple validation
    if (cardNumber.length !== 16 || !expiry || cvv.length !== 3) {
      setMessage("Please enter valid payment details.");
      return;
    }
    // Here you would integrate with a payment gateway
    setMessage("Payment successful! Thank you.");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 glassmorphism rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">Make Payment</h2>
      {message && <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">{message}</div>}
      <form onSubmit={handlePayment} className="space-y-4">
        <input
          type="text"
          placeholder="Card Number"
          maxLength={16}
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="text"
          placeholder="Expiry MM/YY"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="password"
          placeholder="CVV"
          maxLength={3}
          value={cvv}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Payment;
