import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaHome,
  FaList,
  FaUser,
  FaUserMd,
  FaUsers,
  FaEnvelope,
} from "react-icons/fa";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "../helper/apiCall";
import axios from "axios";
import "../styles/Home.css";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Home = () => {
  const [userCount, setUserCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchDataCounts = async () => {
    try {
      dispatch(setLoading(true));
      const userData = await fetchData("/user/getallusers");
      const appointmentData = await fetchData(
        "/appointment/getallappointments"
      );
      const doctorData = await fetchData("/doctor/getalldoctors");
      setUserCount(userData.length);
      setAppointmentCount(appointmentData.length);
      setDoctorCount(doctorData.length);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching data counts:", error);
    }
  };

  useEffect(() => {
    fetchDataCounts();
  }, []);

  const data = [
    { name: "User Count", count: userCount },
    { name: "Appointment Count", count: appointmentCount },
    { name: "Doctor Count", count: doctorCount },
  ];

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <div>
            <h1>Welcome To Dashboard!!!</h1>
            <div className="main-cards">
              <div className="card">
                <div className="card-inner">
                  <h3 style={{ color: "white" }}>USERS</h3>
                  <FaUsers />
                </div>
                <h2 style={{ color: "white" }}>{userCount}</h2>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3 style={{ color: "white" }}>APPOINTMENTS</h3>
                  <BsFillGrid3X3GapFill className="card_icon" />
                </div>
                <h2 style={{ color: "white" }}>{appointmentCount}</h2>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3 style={{ color: "white" }}>DOCTORS</h3>
                  <FaUserMd />
                </div>
                <h2 style={{ color: "white" }}>{doctorCount}</h2>
              </div>
            </div>
            <div className="charts">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
