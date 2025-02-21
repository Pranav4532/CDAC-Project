import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [netBankingDetails, setNetBankingDetails] = useState({ bank: "", account: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = location.state || { cart: [] };

  // Handle Payment Simulation
  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (paymentMethod === "Card" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      alert("Please fill all card details.");
      return;
    }

    if (paymentMethod === "Net Banking" && (!netBankingDetails.bank || !netBankingDetails.account)) {
      alert("Please fill all net banking details.");
      return;
    }

    alert(`Payment Successful via ${paymentMethod}!`);
    navigate("/success", { state: { cart, paymentMethod } });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Choose Payment Method</h2>

      <div className="card p-4 mt-4">
        <div className="form-check">
          <input type="radio" className="form-check-input" name="payment" value="UPI" onChange={() => setPaymentMethod("UPI")} />
          <label className="form-check-label">UPI</label>
        </div>
        {paymentMethod === "UPI" && (
          <div className="text-center mt-3">
            <QRCodeCanvas value="upi://pay?pa=your-upi-id@upi&pn=YourName&am=100&cu=INR" size={150} />
            <p>Scan to Pay</p>
          </div>
        )}

        <div className="form-check">
          <input type="radio" className="form-check-input" name="payment" value="Card" onChange={() => setPaymentMethod("Card")} />
          <label className="form-check-label">Credit/Debit Card</label>
        </div>
        {paymentMethod === "Card" && (
          <div className="mt-3">
            <input type="text" className="form-control mb-2" placeholder="Card Number" onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} />
            <input type="text" className="form-control mb-2" placeholder="Expiry Date" onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
            <input type="password" className="form-control mb-2" placeholder="CVV" onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
          </div>
        )}

        <div className="form-check">
          <input type="radio" className="form-check-input" name="payment" value="Net Banking" onChange={() => setPaymentMethod("Net Banking")} />
          <label className="form-check-label">Net Banking</label>
        </div>
        {paymentMethod === "Net Banking" && (
          <div className="mt-3">
            <input type="text" className="form-control mb-2" placeholder="Bank Name" onChange={(e) => setNetBankingDetails({ ...netBankingDetails, bank: e.target.value })} />
            <input type="text" className="form-control mb-2" placeholder="Account Number" onChange={(e) => setNetBankingDetails({ ...netBankingDetails, account: e.target.value })} />
          </div>
        )}

        <button className="btn btn-success w-100 mt-3" onClick={handlePayment}>Proceed to Pay</button>
      </div>
    </div>
  );
}

export default PaymentPage;