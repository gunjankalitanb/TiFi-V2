import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart.js";
import toast from "react-hot-toast";

import axios from "axios";
import loadScript from "../utils/loadScript.js";

const CheckoutModal = ({ isOpen, onRequestClose, totalAmount }) => {
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  // Define openPayModal as a separate function
  const openPayModal = async (totalPrice) => {
    //--------------------------------------
    // var amount = amt * 100;
    // var options = {
    //   key: process.env.RAZORPAY_KEY_ID,
    //   amount: 0, // 2000 paise = INR 20, amount in paisa
    //   name: "",
    //   description: "",
    //   order_id: "",
    //   handler: async function (response) {
    //     console.log(response);
    //     var values = {
    //       razorpay_signature: response.razorpay_signature,
    //       razorpay_order_id: response.razorpay_order_id,
    //       transactionid: response.razorpay_payment_id,
    //       transactionamount: amount,
    //     };
    //     await axios
    //       .post(
    //         `${process.env.REACT_APP_API}/api/v1/Items/razorpay/verify`,
    //         values
    //       )
    //       .then((res) => {
    //         alert("Success");
    //       })
    //       .catch((e) => console.log(e));
    //   },
    //   prefill: {
    //     name: "Sanjana Kumari",
    //     email: "sanjana@gmail.com",
    //     contact: "1234567890",
    //   },
    //   notes: {
    //     address: "Hello World",
    //   },
    //   theme: {
    //     color: "#528ff0",
    //   },
    // };
    // axios
    //   .post(`${process.env.REACT_APP_API}/api/v1/Items/razorpay/order`, {
    //     amount: amount,
    //   })
    //   .then((res) => {
    //     options.order_id = res.data.id;
    //     options.amount = res.data.amount;
    //     console.log(options);
    //     var rzp1 = new window.Razorpay(options);
    //     rzp1.open();
    //   })
    //   .catch((e) => console.log(e));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Checkout Modal"
    >
      <h2>Checkout</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="street" className="form-label">
            Street
          </label>
          <input
            type="text"
            className="form-control"
            id="street"
            placeholder="Flat / House no / Floor / Building"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="locality" className="form-label">
            Locality
          </label>
          <input
            type="text"
            className="form-control"
            id="locality"
            placeholder="Area / Sector / Locality"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="landmark" className="form-label">
            Landmark
          </label>
          <input
            type="text"
            className="form-control"
            id="landmark"
            placeholder="Nearby Landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
        </div>
        <p>Total Amount: {totalAmount}</p>
        <button className="btn btn-primary">Make Payment</button>
      </form>
    </Modal>
  );
};

export default CheckoutModal;
