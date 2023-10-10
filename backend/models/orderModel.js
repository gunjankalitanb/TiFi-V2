import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Items",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Out for delivery",
        "Delivered",
        "Cancel",
      ],
    },

    razorpayOrderID: {
      type: String,
    },
    name: {
      // Add the Name field
      type: String,
      required: true,
    },
    homeAddress: {
      // Add the Home Address field
      type: String,
      required: true,
    },
    phoneNumber: {
      // Add the Phone Number field
      type: String,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["COD", "UPI/CARD"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
