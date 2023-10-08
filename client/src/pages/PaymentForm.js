import React, { useState } from "react";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

const PaymentForm = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [name, setName] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total = total + item.price;
      });
      const formattedTotal = total.toFixed(2);
      return formattedTotal.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
      return "₹0.00"; // Handle errors by returning a default value
    }
  };

  const clearCartItemsFromLocalStorage = () => {
    localStorage.removeItem("cart");
    setCart([]); // Clear the cart state in your context
  };
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
  const handleCodPayment = async (req, res) => {
    try {
      // Prepare COD order details
      const codOrderDetails = {
        name: name + "(COD)",
        homeAddress,
        phoneNumber,
        cart,
      };

      // Send a POST request to create the COD order
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/Items/payment/cod-order`,
        codOrderDetails
      );

      if (response.data.success) {
        toast.success(res.data.message);
        clearCartItemsFromLocalStorage();
        navigate("/dashboard/user/orders");
      } else {
        alert("Failed to place COD order.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while placing the COD order.");
    }
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
    const totalAmountPaisa = Math.round(parseFloat(totalPrice()) * 100);

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
      name: name, // Add Name to the request
      homeAddress: homeAddress, // Add Home Address to the request
      phoneNumber: phoneNumber, // Add Phone Number to the request
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Delivery Address</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Home Address</label>
          <textarea
            className="form-control"
            rows="3"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
          ></textarea>
        </div>
        <h4>Total : ₹{totalPrice()} </h4>
        {auth?.token ? (
          <div>
            <button
              type="button"
              className="btn btn-success mb-2 ms-2"
              onClick={handlePayment}
            >
              UPI/CARD
            </button>
            <button
              type="button"
              className="btn btn-success mb-2 ms-2"
              onClick={handleCodPayment}
            >
              Cash On Delivery (COD)
            </button>
          </div>
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
    </div>
  );
};

export default PaymentForm;
