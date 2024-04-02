import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ChangePassword() {
  const { userId } = jwt_decode(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    password: "",
    newpassword: "",
    confnewpassword: "",
  });

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getuser/${userId}`);
      setFormDetails({
        ...temp,
        password: "",
        newpassword: temp.newpassword === null ? "" : temp.newpassword,
      });
      setFile(temp.pic);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const { password, newpassword, confnewpassword } = formDetails;
    // console.log(formDetails);
    if (newpassword !== confnewpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const response = await axios.put(
        "/user/changepassword",
        {
          userId: userId,
          currentPassword: password,
          newPassword: newpassword,
          confirmNewPassword: confnewpassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response.data);

      if (response.data === "Password changed successfully") {
        toast.success("Password updated successfully");
        setFormDetails({
          ...formDetails,
          password: "",
          newpassword: "",
          confnewpassword: "",
        });
      } else {
        toast.error("Unable to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="register-section flex-center">
          <div className="profile-container flex-center">
            <h2 className="form-heading">Profile</h2>
            <img src={file} alt="profile" className="profile-pic" />
            <form onSubmit={formSubmit} className="register-form">
              <div className="form-same-row">
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your current password"
                  value={formDetails.password}
                  onChange={inputChange}
                />
              </div>
              <div className="form-same-row">
                <input
                  type="password"
                  name="newpassword"
                  className="form-input"
                  placeholder="Enter your new password"
                  value={formDetails.newpassword}
                  onChange={inputChange}
                />
                <input
                  type="password"
                  name="confnewpassword"
                  className="form-input"
                  placeholder="Confirm your new password"
                  value={formDetails.confnewpassword}
                  onChange={inputChange}
                />
              </div>
              <button type="submit" className="btn form-btn">
                Update
              </button>
            </form>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}

export default ChangePassword;
