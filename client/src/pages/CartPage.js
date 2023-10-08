import React, { useState } from "react";
// import dotenv from "dotenv";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

import axios from "axios";

// import RazorpayCheckout from "react-native-razorpay";

const CartPage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total = total + item.price * item.quantity;
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

  //delete cart items
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };
  const incrementQuantity = (pid) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item._id === pid);
    if (itemIndex !== -1) {
      updatedCart[itemIndex].quantity += 1; // Increment the quantity by 1
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const decrementQuantity = (pid) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item._id === pid);
    if (itemIndex !== -1 && updatedCart[itemIndex].quantity > 1) {
      updatedCart[itemIndex].quantity -= 1; // Decrement the quantity by 1 if it's greater than 1
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // const loadScript = (src) => {
  //   return new Promise((resolve) => {
  //     const script = document.createElement("script");
  //     script.src = src;
  //     script.onload = () => {
  //       resolve(true);
  //     };
  //     script.oneerror = () => {
  //       resolve(false);
  //     };
  //     document.body.appendChild(script);
  //   });
  // };
  const handlePayment = async () => {
    navigate("/pform", { state: { totalAmount: totalPrice() } });
    // let orderId =
    //   "OD" + Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
    // const res = await loadScript(
    //   "https://checkout.razorpay.com/v1/checkout.js"
    // );
    // if (!res) {
    //   alert("Razorpay SDK faled to load. Are you online?");
    //   return;
    // }
    // // Calculate the total amount in paisa (1 INR = 100 paisa)
    // const totalAmountPaisa = Math.round(parseFloat(totalPrice()) * 100);

    // // Check if the total amount is at least 1 INR
    // if (totalAmountPaisa < 100) {
    //   alert("The total amount must be at least 1 INR.");
    //   return;
    // }

    // let paymentRes = {
    //   order_id: orderId,
    //   amount: totalAmountPaisa,
    //   currency: "INR",
    //   payment_capture: 1,
    //   cart: cart,
    // };
    // console.log(paymentRes);

    // let result = await axios.post(
    //   `${process.env.REACT_APP_API}/api/v1/Items/razorpay/order`,
    //   paymentRes
    // );
    // if (!result.data.data) {
    //   alert("Server error.Are you online?");
    //   return;
    // } else {
    //   let options = {
    //     key: "rzp_test_ZLwOhCELADQ6s0",
    //     amount: totalAmountPaisa, // 2000 paise = INR 20, amount in paisa
    //     currency: result.data.data.currency,
    //     products: cart.map((item) => item._id), // Send product IDs
    //     name: " Ti :ফাই",
    //     description: "Thank you for purchasing",
    //     order_id: result.data.id,

    //     handler: async function (response) {
    //       console.log(response);
    //       // var values = {
    //       //   razorpay_signature: response.razorpay_signature,
    //       //   razorpay_order_id: response.razorpay_order_id,
    //       //   transactionid: response.razorpay_payment_id,
    //       //   transactionamount: amount,
    //       // };
    //       // await axios
    //       //   .post(
    //       //     `${process.env.REACT_APP_API}/api/v1/Items/razorpay/verify`,
    //       //     values
    //       //   )
    //       //   .then((res) => {
    //       //     alert("Success");
    //       //   })
    //       //   .catch((e) => console.log(e));
    //       clearCartItemsFromLocalStorage();
    //       navigate("/dashboard/user/orders");
    //     },
    //     prefill: {
    //       name: "",
    //       email: "",
    //       contact: "",
    //     },
    //     notes: {
    //       address: "",
    //     },
    //     theme: {
    //       color: "#528ff0",
    //       image:
    //         "https://i.postimg.cc/15SVpDx8/Screenshot-2023-09-16-112057.png",
    //     },
    //   };
    //   let paymentObject = new window.Razorpay(options);
    //   paymentObject.open();
    // }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center bg-light p-2 mb-1">
            {`Hello ${auth?.token && auth?.user?.name}`}
          </h1>
          <h4 className="text-center">
            {cart?.length
              ? `You Have ${cart.length} items in you cart ${
                  auth?.token ? "" : "Please login to checkout"
                }`
              : "Your Cart Is Empty"}
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          {cart?.map((p) => (
            <div className="row mb-2 p-3 card flex-row">
              <div className="col-md-4">
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/items/item-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  width={"50px"}
                  height={"200px"}
                />
              </div>
              <div className="col-md-8">
                <p>{p.name}</p>
                <p>price : ₹{p.price}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => incrementQuantity(p._id)}
                  >
                    +
                  </button>
                  <span className="quantity">{p.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => decrementQuantity(p._id)}
                  >
                    -
                  </button>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => removeCartItem(p._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4 text-center">
          <h2>Cart Summary</h2>
          <p>Total | Checkout | Payment</p>
          <hr />
          <h4>Total : ₹{totalPrice()} </h4>
          {auth?.token ? (
            <button
              type="button"
              className="btn btn-primary mb-2"
              onClick={handlePayment}
            >
              Proceed to Payment
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
        </div>
        {/* Render the CheckoutModal */}
      </div>
    </div>
  );
};

export default CartPage;
