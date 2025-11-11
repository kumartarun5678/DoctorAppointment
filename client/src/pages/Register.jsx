import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [file, setFile] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });

  // 🔹 Validate individual fields
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstname":
        if (!value.trim()) error = "First name is required";
        else if (value.length < 3)
          error = "First name must be at least 3 characters";
        break;

      case "lastname":
        if (!value.trim()) error = "Last name is required";
        else if (value.length < 3)
          error = "Last name must be at least 3 characters";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Invalid email format";
        break;

      case "password":
        if (!value.trim()) error = "Password is required";
        else if (value.length < 5)
          error = "Password must be at least 5 characters";
        break;

      case "confpassword":
        if (!value.trim()) error = "Confirm password is required";
        else if (value !== formDetails.password)
          error = "Passwords do not match";
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

  const onUpload = async (element) => {
    setLoading(true);
    if (
      element.type === "image/jpeg" ||
      element.type === "image/png" ||
      element.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
        const uploadData = await res.json();
        setFile(uploadData.url.toString());
        toast.success("Profile picture uploaded successfully");
      } catch (err) {
        toast.error("Failed to upload image");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error("Please select an image in jpeg or png format");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formDetails).forEach(([key, value]) =>
      validateField(key, value)
    );

    if (!selectedRole) newErrors.role = "Please select a role";
    if (!file) newErrors.file = "Please upload a profile picture";

    setErrors((prev) => ({ ...prev, ...newErrors }));

    return Object.values(newErrors).every((error) => error === "");
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix form errors before submitting");
      return;
    }

    const { firstname, lastname, email, password } = formDetails;

    try {
      await toast.promise(
        axios.post("/user/register", {
          firstname,
          lastname,
          email,
          password,
          pic: file,
          role: selectedRole,
        }),
        {
          loading: "Registering user...",
          success: "User registered successfully!",
          error: "Unable to register user",
        }
      );
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center">
        <div className="register-container flex-center">
          <h2 className="form-heading">Sign Up</h2>
          <form onSubmit={formSubmit} className="register-form">
            {/* First Name */}
            <input
              type="text"
              name="firstname"
              className={`form-input ${errors.firstname ? "error-input" : ""}`}
              placeholder="Enter your first name"
              value={formDetails.firstname}
              onChange={inputChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
            />
            {errors.firstname && <p className="error-text">{errors.firstname}</p>}

            {/* Last Name */}
            <input
              type="text"
              name="lastname"
              className={`form-input ${errors.lastname ? "error-input" : ""}`}
              placeholder="Enter your last name"
              value={formDetails.lastname}
              onChange={inputChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
            />
            {errors.lastname && <p className="error-text">{errors.lastname}</p>}

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

            {/* Profile Picture */}
            <input
              type="file"
              onChange={(e) => onUpload(e.target.files[0])}
              name="profile-pic"
              id="profile-pic"
              className={`form-input ${errors.file ? "error-input" : ""}`}
            />
            {errors.file && <p className="error-text">{errors.file}</p>}

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

            {/* Confirm Password */}
            <input
              type="password"
              name="confpassword"
              className={`form-input ${errors.confpassword ? "error-input" : ""}`}
              placeholder="Confirm your password"
              value={formDetails.confpassword}
              onChange={inputChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
            />
            {errors.confpassword && (
              <p className="error-text">{errors.confpassword}</p>
            )}

            {/* Role */}
            <select
              name="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={`form-input ${errors.role ? "error-input" : ""}`}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Patient">Patient</option>
            </select>
            {errors.role && <p className="error-text">{errors.role}</p>}

            {/* Submit */}
            <button
              type="submit"
              className="btn form-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Sign Up"}
            </button>
          </form>

          <p>
            Already a user?{" "}
            <NavLink className="login-link" to={"/login"}>
              Log in
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;
