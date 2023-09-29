import express from "express";
import {
  registerController,
  loginContoller,
  testController,
  updateProfileController,
  profilePhotoController,
  getOrdersContoller,
  getAllOrdersContoller,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", registerController);

//login || post
router.post("/login", loginContoller);

//test
router.get("/test", requireSignIn, isAdmin, testController); //middleware added

//protected route auth for user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected route auth for admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//get photo
router.get("/profile-photo/:iid", profilePhotoController);

//order
router.get("/orders", requireSignIn, getOrdersContoller);

//All order
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersContoller);

//oreder status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router;
