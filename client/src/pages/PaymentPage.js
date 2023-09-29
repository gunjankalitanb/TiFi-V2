import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");

  const handlePayment = async () => {
    // Check if required fields are empty before proceeding
    if (!street || !locality) {
      alert("Street and Locality are required fields.");
      return;
    }

    // Construct the full address by combining street, locality, and landmark
    const fullAddress = `${street}, ${locality}, ${landmark}`;

    // Now you can use the fullAddress in your payment logic or send it to the server
    // For example:
    // await axios.post(`${process.env.REACT_APP_API}/api/v1/payment`, { address: fullAddress });

    // Redirect to a success page or perform payment processing logic here
    navigate("/payment-success");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1 className="text-center">Enter Your Address</h1>
          <div className="card p-4 shadow">
            <form>
              <div className="mb-3">
                <label htmlFor="street" className="form-label">
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="street"
                  placeholder=" Flat / House no / Floor / Building"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="locality" className="form-label">
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="locality"
                  placeholder=" Area / Sector / Locality"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="landmark" className="form-label"></label>
                <input
                  type="text"
                  className="form-control"
                  id="landmark"
                  placeholder="Nearby Landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <button className="btn btn-primary" onClick={handlePayment}>
                  Make Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
