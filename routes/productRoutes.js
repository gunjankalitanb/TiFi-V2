import express from "express";

import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  createItemController,
  deleteItemController,
  getItemController,
  getSingleItemController,
  itemCategoryController,
  itemPhotoController,
  orderController,
  searchItemcontroller,
  updateItemController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();

//routes
router.post(
  "/create-items",
  requireSignIn,
  isAdmin,
  formidable(),
  createItemController
);

// get items
router.get("/get-items", getItemController);

//get single item
router.get("/get-items/:slug", getSingleItemController);

//get photo
router.get("/item-photo/:iid", itemPhotoController);

//delete product
router.delete("/delete-item/:iid", deleteItemController);

//search
router.get("/search/:keyword", searchItemcontroller);

//category wise item
router.get("/item-category/:slug", itemCategoryController);

//update item
router.put(
  "/update-items/:iid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateItemController
);

//payment routes
// router.post("/payment/order", requireSignIn, orderPaymentController);
// router.post("/payment/verify", requireSignIn, verifyPaymentController);
// router.post("/razorpay/payment", requireSignIn, razorpayPaymentController);
// router.post("/razorpay/order", requireSignIn, razorpayOrderController);
router.post("/razorpay/order", requireSignIn, orderController);

//token
// router.get("/braintree/token", braintreeTokenController);

//payment
// router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
