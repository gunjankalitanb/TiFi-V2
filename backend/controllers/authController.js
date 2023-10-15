import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import nodemailer from "nodemailer";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }

    //check user

    const existinguser = await userModel.findOne({ email });

    //checking existing user
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered. Please Login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User registered sucessfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//POST LOGIN

export const loginContoller = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    //decrypt db password and comare with user input
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};
export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID and remove it from the database
    const deletedUser = await userModel.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting user", error });
  }
};
//test
export const testController = (req, res) => {
  res.send("Protected Routes");
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({
        error: "Passsword is required and must be 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

export const profilePhotoController = async (req, res) => {
  try {
    const prof = await userModel.findById(req.params.prid).select("photo");
    if (prof.photo.data) {
      res.set("Content-type", prof.photo.contentType);
      return res.status(200).send(prof.photo.data);
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

export const getOrdersContoller = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate({
        path: "buyer",
        select: "name homeAddress phoneNumber", // Include the desired fields
      });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

export const getAllOrdersContoller = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate({
        path: "buyer",
        select: "name homeAddress phoneNumber", // Include the desired fields
      })
      .sort({ createdAt: "-1" });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "g6409324@gmail.com",
    pass: "vilm otnz qyaa dykv",
  },
});

export const forgotPasswordContoller = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a random OTP (e.g., 6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send the OTP to the user's email address
    const mailOptions = {
      from: "g6409324@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    // Store the OTP and timestamp in the database
    await userModel.updateOne({ email }, { otp, otpTimestamp: new Date() });

    res.json({ success: true, message: "OTP sent to your email address" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resetPasswordContoller = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if OTP matches and is not expired (e.g., within 15 minutes)
    const user = await userModel.findOne({ email });
    if (
      !user ||
      user.otp !== otp ||
      user.otpTimestamp < new Date() - 15 * 60 * 1000
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or expired" });
    }

    // Reset the user's password
    const hashedPassword = await hashPassword(newPassword);
    await userModel.updateOne({ email }, { password: hashedPassword });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
