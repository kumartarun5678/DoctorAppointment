import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Validate each input field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Invalid email format";
        break;
      case "password":
        if (!value.trim()) error = "Password is required";
        else if (value.length < 5)
          error = "Password must be at least 5 characters long";
        break;
      case "role":
        if (!value.trim()) error = "Please select a role";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(formDetails).forEach(([key, value]) => {
      validateField(key, value);
      if (!value.trim()) newErrors[key] = `${key} is required`;
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((e) => e === "");
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      setLoading(true);
      const { email, password, role } = formDetails;

      const { data } = await toast.promise(
        axios.post("/user/login", { email, password, role }),
        {
          loading: "Logging in...",
          success: "Login successful!",
          error: "Unable to login user",
        }
      );

      localStorage.setItem("token", data.token);
      const decoded = jwt_decode(data.token);
      dispatch(setUserInfo(decoded.userId));
      getUser(decoded.userId, role);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id, role) => {
    try {
      const temp = await fetchData(`/user/getuser/${id}`);
      dispatch(setUserInfo(temp));
      if (role === "Admin") return navigate("/dashboard/home");
      if (role === "Doctor") return navigate("/");
      return navigate("/");
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center">
        <div className="register-container flex-center">
          <h2 className="form-heading">Sign In</h2>
          <form onSubmit={formSubmit} className="register-form">
            {/* Email */}
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? "error-input" : ""}`}
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={inputChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            {/* Password */}
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? "error-input" : ""}`}
              placeholder="Enter your password"
              value={formDetails.password}
              onChange={inputChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}

            {/* Role */}
            <select
              name="role"
              className={`form-input ${errors.role ? "error-input" : ""}`}
              value={formDetails.role}
              onChange={inputChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Patient">Patient</option>
            </select>
            {errors.role && <p className="error-text">{errors.role}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn form-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <NavLink className="login-link" to={"/forgotpassword"}>
            Forgot Password
          </NavLink>

          <p>
            Not a user?{" "}
            <NavLink className="login-link" to={"/register"}>
              Register
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;
