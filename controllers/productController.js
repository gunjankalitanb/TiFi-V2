import slugify from "slugify";
import productModel from "../models/productModel.js";
import categorymodel from "../models/categoryModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();
const instance = new Razorpay({
  key_id: "rzp_test_ZLwOhCELADQ6s0",
  key_secret: "qSjmGjtoN1p34vqJrKvTL6sx",
});

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });
//payment
// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });

export const createItemController = async (req, res) => {
  try {
    const { name, slug, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        res.status(500).send({ error: "Name is Required" });
        break;
      case !price:
        res.status(500).send({ error: "Price is Required" });
        break;
      case !category:
        res.status(500).send({ error: "Category is Required" });
        break;
      case !quantity:
        res.status(500).send({ error: "Quantity is Required" });
        break;
      case !photo && photo.size > 1000000:
        res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1mb" });
    }
    const items = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      items.photo.data = fs.readFileSync(photo.path);
      items.photo.contentType = photo.type;
    }
    await items.save();
    res.status(201).send({
      success: true,
      message: "Itmes Created Successfully",
      items,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while creating item",
    });
  }
};

export const getItemController = async (req, res) => {
  try {
    const items = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: items.length,
      message: "All Items ",
      items,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting items",
      error: error.message,
    });
  }
};

// get single product
export const getSingleItemController = async (req, res) => {
  try {
    const items = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single items Fetched",
      items,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single item",
      error,
    });
  }
};

// get photo
export const itemPhotoController = async (req, res) => {
  try {
    const item = await productModel.findById(req.params.iid).select("photo");
    if (item.photo.data) {
      res.set("Content-type", item.photo.contentType);
      return res.status(200).send(item.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng Photo",
      error,
    });
  }
};

//delete controller
export const deleteItemController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.iid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Item Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting item",
      error,
    });
  }
};

//   //upate producta
export const updateItemController = async (req, res) => {
  try {
    const { name, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        res.status(500).send({ error: "Name is Required" });
        break;
      case !price:
        res.status(500).send({ error: "Price is Required" });
        break;
      case !category:
        res.status(500).send({ error: "Category is Required" });
        break;
      case !quantity:
        res.status(500).send({ error: "Quantity is Required" });
        break;
      case photo && photo.size > 1000000:
        res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1mb" });
    }
    const items = await productModel.findByIdAndUpdate(
      req.params.iid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      items.photo.data = fs.readFileSync(photo.path);
      items.photo.contentType = photo.type;
    }
    await items.save();
    res.status(201).send({
      success: true,
      message: "Itmes Updated Successfully",
      items,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating item",
    });
  }
};

//search
export const searchItemcontroller = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [{ name: { $regex: keyword, $options: "i" } }],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

export const itemCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const items = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      items,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting items",
    });
  }
};

// export const razorpayOrderController = async (req, res) => {
//   try {
//     const { cart } = req.body;
//     let total = 0;
//     cart.forEach((item) => {
//       total += item.price;
//     });

//     // Calculate the total amount in paise (smallest currency unit)
//     let totalAmountInPaise = total * 100; // Convert to paise

//     // Ensure the total amount is at least 1.00 INR
//     if (totalAmountInPaise < 100) {
//       totalAmountInPaise = 100; // Set minimum amount as 1.00 INR
//     }

//     const options = {
//       amount: totalAmountInPaise, // Pass the correct amount
//       currency: "INR",
//       receipt: "order_receipt",
//       payment_capture: 1,
//     };

//     razorpay.orders.create(options, async function (err, order) {
//       if (err) {
//         console.error(err);
//         return res.status(500).send(err);
//       }

//       res.status(200).json({ order });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// };

// export const razorpayPaymentController = async (req, res) => {
//   try {
//     console.log("Razorpay Payment Controller accessed");
//     const { cart, order_id } = req.body;
//     let total = 0;
//     cart.forEach((item) => {
//       total += item.price;
//     });
//     const payment_capture = 1; // Capture the payment immediately
//     const response = await razorpay.orders.payments.create({
//       amount: total * 100,
//       currency: "INR",
//       order_id: order_id,
//       payment_capture,
//     });

//     const orderDocument = new orderModel({
//       products: cart,
//       razorpayOrderID: order_id,
//       payment: response,
//       buyer: req.user._id,
//       status: "success",
//     });

//     await orderDocument.save();

//     res.redirect("/dashboard/user/orders");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// };

//payment gateway api
//token
// export const braintreeTokenController = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(response);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

//payment
// export const brainTreePaymentController = async (req, res) => {
//   try {
//     const { cart, nonce } = req.body;
//     let total = 0;
//     cart.map((i) => {
//       total += i.price;
//     });
//     let newTransaction = gateway.transaction.sale(
//       {
//         amount: total.toFixed(2),

//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       function (error, result) {
//         if (result) {
//           const order = new orderModel({
//             products: cart,
//             payment: result,
//             buyer: req.user._id,
//           }).save();
//           res.json({ ok: true });
//         } else {
//           res.status(500).send(error);
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

//------------------------------razorpay------------------------------------------

// export const orderPaymentController = (req, res) => {
//   let instance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });
//   var options = {
//     amount: req.body.amount * 100,
//     currency: "INR",
//   };
//   instance.orders.create(options, function (err, order) {
//     if (err) {
//       return res.status(500).json({ message: "Server error" });
//     }
//     return res.status(200).json({ order_id: order.id });
//   });
// };

// export const verifyPaymentController = () => {};

//-------------------------------------------
// export const orderController = async (req, res) => {
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
// // };

// export const orderVerifyController = async (req, res) => {
//   try {
//     const {
//       razorpay_signature,
//       razorpay_order_id,
//       transactionid,
//       transactionamount,
//     } = req.body;

//     // Verify the Razorpay payment signature
//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//     hmac.update(razorpay_order_id + "|" + transactionid);
//     const generatedSignature = hmac.digest("hex");

//     if (generatedSignature === razorpay_signature) {
//       // Payment is verified, you can save the transaction details to your database
//       // and perform any necessary actions here
//       // Example: Save the transaction details to your database

//       // Replace this with your actual database logic
//       // const transaction = new Transaction({
//       //   transactionid,
//       //   transactionamount,
//       // });
//       // await transaction.save();

//       return res.status(200).json({ message: "Payment success" });
//     } else {
//       return res.status(400).json({ message: "Payment verification failed" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }

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
// };

//-------------------------------------------
export const orderController = async (req, res) => {
  try {
    const { order_id, amount, payment_capture, currency, cart } = req.body;
    console.log("Cart Data:", cart);

    // Create an instance of the Transaction model
    const newOrder = new Order({
      buyer: req.user._id, // Associate the order with the buyer
      products: cart,
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

    let paymentStatus = "Failed"; // Default to "Failed" status

    // Check if the Razorpay order status is "captured" for a successful payment
    if (razorpayOrder.status === "captured") {
      paymentStatus = "Success";
    }

    // Update the payment status in the newOrder object
    newOrder.payment.status = paymentStatus;

    // Save the updated order to the database
    await newOrder.save();

    // Return the order response along with the payment status
    return res.status(200).json({
      success: true,
      data: {
        order: razorpayOrder,
        paymentStatus: paymentStatus,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
