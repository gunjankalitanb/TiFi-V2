import crypto from "crypto";
import Transaction from "../models/paymentModel.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import Order from "../models/orderModel.js";

dotenv.config();
const instance = new Razorpay({
  key_id: "rzp_test_ZLwOhCELADQ6s0",
  key_secret: "qSjmGjtoN1p34vqJrKvTL6sx",
});

//-------------------------------------------
export const orderController = async (req, res) => {
  try {
    const { order_id, amount, payment_capture, currency } = req.body;

    // Create an instance of the Transaction model
    const newOrder = new Order({
      products: [],
      payment: {
        order_id,
        amount,
        currency,
        payment_capture,
      },
    });
    // Save the transaction information to the database
    await newOrder.save();
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: order_id,
      payment_capture: payment_capture,
    };
    const razorpayOrder = await instance.orders.create(options);
    if (!razorpayOrder) {
      return res.status(500).send("Something Went Wrong");
    }
    // Return the order response along with any additional data
    return res.status(200).json({ success: true, data: razorpayOrder });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }

  //   try {
  //     const { amount } = req.body;

  //     // Ensure the amount is in paisa (smallest currency unit)
  //     const amountInPaisa = amount * 100;

  //     // Create an order
  //     const options = {
  //       amount: amountInPaisa,
  //       currency: "INR",
  //       receipt: "order_receipt",
  //       payment_capture: 1,
  //     };
  //     razorpay.orders.create(options, function (err, order) {
  //       if (err) {
  //         console.error(err);
  //         return res.status(500).json({ message: "Server error" });
  //       }

  //       // Send the order ID back to the client
  //       return res.status(200).json({ order_id: order.id });
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Internal server error" });
  //   }

  //-----------------------------------------------------------
  // try {
  //   var options = {
  //     amount: req.body, // amount in the smallest currency unit
  //     currency: "INR",
  //     receipt: "order_rcptid_11",
  //     payment_capture: 1,
  //   };
  //   razorpay.orders.create(options, function (err, order) {
  //     if (err) {
  //       return res.status(500).json({ message: "Server error" });
  //     }
  //     return res.status(200).json({ order_id: order.id });
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send(error);
  // }
};

export const cardDetailController = async (req, res) => {
  try {
    const { razor_payment_id } = req.body;
    const order = await instance.payments.fetch(razor_payment_id);
    if (!order) return res.status(500).send("Something Occured");
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.log(error);
  }
};

export const orderVerifyController = async (req, res) => {
  try {
    const {
      razorpay_signature,
      razorpay_order_id,
      transactionid,
      transactionamount,
    } = req.body;

    // Verify the Razorpay payment signature
    const hmac = crypto.createHmac("sha256", qSjmGjtoN1p34vqJrKvTL6sx);
    hmac.update(razorpay_order_id + "|" + transactionid);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Payment is verified, you can save the transaction details to your database
      // and perform any necessary actions here
      // Example: Save the transaction details to your database

      // Replace this with your actual database logic
      // const transaction = new Transaction({
      //   transactionid,
      //   transactionamount,
      // });
      // await transaction.save();

      return res.status(200).json({ message: "Payment success" });
    } else {
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

  //----------------------------------------------------------
  // const generated_signature = crypto.createHmac("sha256", keysecret);
  // generated_signature.update(
  //   req.body.razorpay_order_id + "|" + req.body.transactionid
  // );
  // if (generated_signature.digest("hex") === req.body.razorpay_signature) {
  //   const transaction = new Transaction({
  //     transactionid: req.body.transactionid,
  //     transactionamount: req.body.transactionamount,
  //   });
  //   transaction.save(function (err, savedtransac) {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send("Some Problem Occured");
  //     }
  //     res.send({ transaction: savedtransac });
  //   });
  // } else {
  //   return res.send("failed");
  // }
};
