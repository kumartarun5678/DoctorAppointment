import React, { useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ResetPassword() {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      return toast.error("Password is required");
    }

    try {
      const response = await axios.post(`/user/resetpassword/${id}/${token}`, { password });

      if (response.status === 200) {
        toast.success("Password reset successfully");
        navigate('/login');
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center">
      <div className="register-container flex-center">
          <h2 className="form-heading">Reset Password</h2>
          <form onSubmit={handleFormSubmit} className="register-form">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your new password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button type="submit" className="btn form-btn">
              Reset Password
            </button>
          </form>
          <NavLink className="login-link" to="/login">
            Back to Login
          </NavLink>
        </div>
      </section>
    </>
  );
}

export default ResetPassword;
