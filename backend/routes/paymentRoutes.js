import express from "express";

import {} from "../controllers/productController.js";
import {
  cardDetailController,
  orderController,
  orderVerifyController,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/razorpay/order", orderController);
router.post("/razorpay/card-detail", cardDetailController);

router.post("/razorpay/verify", orderVerifyController);

//token
// router.get("/braintree/token", braintreeTokenController);

//payment
// router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
