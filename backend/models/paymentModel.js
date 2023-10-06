import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", paymentSchema);
