import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ForgotPassword() {
  const [formDetails, setFormDetails] = useState({
    email: "",
  });
  const navigate = useNavigate(); 

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const { email } = formDetails;

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      const response = await axios.post("/user/forgotpassword", { email });
      if (response.status === 200) {
        toast.success("Password reset email sent successfully!!!!!");
        navigate('/login'); 
      } else {
        toast.error("Failed to send password reset email");
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center">
        <div className="register-container flex-center">
          <h2 className="form-heading">Forgot Password</h2>
          <form onSubmit={formSubmit} className="register-form">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={inputChange}
            />
            <button type="submit" className="btn form-btn">
              Send Reset Email
            </button>
          </form>
          <NavLink className="login-link" to={"/login"}>
            Back to Login
          </NavLink>
        </div>
      </section>
    </>
  );
}

export default ForgotPassword;
