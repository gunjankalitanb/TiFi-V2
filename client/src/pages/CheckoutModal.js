import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart.js";
import toast from "react-hot-toast";

import axios from "axios";
import { useAuth } from "../context/auth.js";

const CheckoutModal = ({ isOpen, onRequestClose, totalAmount }) => {
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.oneerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const handlePayment = async () => {
    let orderId =
      "OD" + Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK faled to load. Are you online?");
      return;
    }
    // Calculate the total amount in paisa (1 INR = 100 paisa)
    const totalAmountPaisa = Math.round(parseFloat(totalAmount()) * 100);

    // Check if the total amount is at least 1 INR
    if (totalAmountPaisa < 100) {
      alert("The total amount must be at least 1 INR.");
      return;
    }

    let paymentRes = {
      order_id: orderId,
      amount: totalAmountPaisa,
      currency: "INR",
      payment_capture: 1,
      cart: cart,
    };
    console.log(paymentRes);

    let result = await axios.post(
      `${process.env.REACT_APP_API}/api/v1/Items/razorpay/order`,
      paymentRes
    );
    if (!result.data.data) {
      alert("Server error.Are you online?");
      return;
    } else {
      let options = {
        key: "rzp_test_ZLwOhCELADQ6s0",
        amount: totalAmountPaisa, // 2000 paise = INR 20, amount in paisa
        currency: result.data.data.currency,
        products: cart.map((item) => item._id), // Send product IDs
        name: " Ti :ফাই",
        description: "Thank you for purchasing",
        order_id: result.data.id,

        handler: async function (response) {
          console.log(response);
          // var values = {
          //   razorpay_signature: response.razorpay_signature,
          //   razorpay_order_id: response.razorpay_order_id,
          //   transactionid: response.razorpay_payment_id,
          //   transactionamount: amount,
          // };
          // await axios
          //   .post(
          //     `${process.env.REACT_APP_API}/api/v1/Items/razorpay/verify`,
          //     values
          //   )
          //   .then((res) => {
          //     alert("Success");
          //   })
          //   .catch((e) => console.log(e));
          clearCartItemsFromLocalStorage();
          navigate("/dashboard/user/orders");
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          address: "",
        },
        theme: {
          color: "#528ff0",
          image:
            "https://i.postimg.cc/15SVpDx8/Screenshot-2023-09-16-112057.png",
        },
      };
      let paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
  };

  const clearCartItemsFromLocalStorage = () => {
    localStorage.removeItem("cart");
    setCart([]); // Clear the cart state in your context
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
        <h4>Total : ₹{totalAmount} </h4>
        {auth?.token ? (
          <button className="btn btn-primary" onClick={handlePayment}>
            Make Payment
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-warning mb-2"
            onClick={() =>
              navigate("/login", {
                state: "/cartpage",
              })
            }
          >
            Login to Checkout
          </button>
        )}
      </form>
    </Modal>
  );
};

export default CheckoutModal;
