import { useState } from "react";
import "./styles/app.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";
import { Protected, Public, Admin } from "./middleware/route";
import React, { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import Dashboard from "./pages/Dashboard";

const Aprofile = lazy(()=>import("./components/Aprofile"))
const Home = lazy(() => import("./pages/Home"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Doctors = lazy(() => import("./pages/Doctors"));
const Profile = lazy(() => import("./pages/Profile"));
const Change = lazy(() => import("./pages/ChangePassword"));
const DasHome = lazy(() => import("./components/Home"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ApplyDoctor = lazy(() => import("./pages/ApplyDoctor"));
const Error = lazy(() => import("./pages/Error"));

function App() {
  const [userRole, setUserRole] = useState("");
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<Loading />}>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
          <Route
            path="/register"
            element={
              <Public>
                <Register />
              </Public>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route
            path="/appointments"
            element={
              <Protected>
                <Appointments />
              </Protected>
            }
          />
          <Route
            path="/notifications"
            element={
              <Protected>
                <Notifications />
              </Protected>
            }
          />
          <Route
            path="/applyfordoctor"
            element={
              <Protected>
                <ApplyDoctor />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/ChangePassword"
            element={
              <Protected>
                <Change />
              </Protected>
            }
          />
          <Route
            path="/dashboard/home"
            element={
              <Admin>
                <Dashboard type ={"home"} />
              </Admin>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <Admin>
                <Dashboard type={"users"} />
              </Admin>
            }
          />
          <Route
            path="/dashboard/doctors"
            element={
              <Admin>
                <Dashboard type={"doctors"} />
              </Admin>
            }
          />
          <Route
            path="/dashboard/appointments"
            element={
              <Admin>
                <Dashboard type={"appointments"} />
              </Admin>
            }
          />
          <Route
            path="/dashboard/applications"
            element={
              <Admin>
                <Dashboard type={"applications"} />
              </Admin>
            }
          />
          <Route
            path="/dashboard/aprofile"
            element={
              <Admin>
                <Dashboard type={"aprofile"} />
              </Admin>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
