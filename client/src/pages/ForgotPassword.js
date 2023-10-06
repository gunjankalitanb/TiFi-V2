import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot`,
        { email }
      );
      if (res.data.success) {
        toast.success("OTP sent to your email address");
        setResetMode(true);
        setError(""); // Clear any previous errors
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/reset`,
        {
          email,
          otp,
          newPassword,
        }
      );
      if (res.data.success) {
        toast.success("Password reset successfully");
        setResetMode(false);
        setError(""); // Clear any previous errors
        navigate("/login");
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={resetMode ? handleResetPassword : handleSendOTP}>
        <h4 className="title">Forgot Password</h4>
        {resetMode ? (
          <>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength="6" // Minimum password length
              required
            />
            <button type="submit">Reset Password</button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
          </>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Link to="/login" className="register-link">
          Back to Login
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
