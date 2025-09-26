import React from "react";
import Home from "../pages/Home.jsx";
import Services from "../pages/Services.jsx";
import Contact from "../pages/Contact.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Doctors from "../pages/Doctors/Doctors.jsx";
import DocDetails from "../pages/Doctors/DocDetails.jsx";
import { Routes, Route } from "react-router-dom";
import MyAccount from "../Dashboard/user-account/MyAccount.jsx";
import Dashboard from "../Dashboard/doctor-account/Dashboard.jsx";
import ProtectRoute from "./ProtectRoute.jsx";
import CheckoutSuccess from "../pages/CheckoutSuccess.jsx";
import BookingForm from "../pages/BookingForm.jsx";
import { DoctorProvider } from "../context/DoctorContext.jsx";
import GetInTouch from "../Dashboard/GetInTouch.jsx";
import ReceptionistDashboard from "../Dashboard/Receptionist/Dashboard.jsx"
const Router = () => {
  return (
    <>
      <DoctorProvider>

        <Routes>
          <Route path="/doctors/:id/book" element={<BookingForm />} />

          <Route path="/bookings/:id" element={<GetInTouch />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DocDetails />} />
          <Route
            path="/users/profile/me"
            element={
              <ProtectRoute allowedRoles={["patient"]}>
                <MyAccount />
              </ProtectRoute>
            }
          />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route
            path="/doctors/profile/me"
            element={
              <ProtectRoute allowedRoles={["doctor"]}>
                <Dashboard />
              </ProtectRoute>
            }
          />
          <Route
            path="/receptionists/profile/me"
            element={
              <ProtectRoute allowedRoles={["receptionist"]}>
                <ReceptionistDashboard />
              </ProtectRoute>
            }
          />
        </Routes>
      </DoctorProvider>
    </>
  );
};

export default Router;
