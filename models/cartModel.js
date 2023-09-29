import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you're using ObjectIDs as user IDs
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you're using ObjectIDs as product IDs
    required: true,
  },
  quantity: {
    type: Number,
    default: 1, // You can set a default quantity if needed
  },
  // Other fields related to cart items
});

export default mongoose.model("CartItem", cartItemSchema);
