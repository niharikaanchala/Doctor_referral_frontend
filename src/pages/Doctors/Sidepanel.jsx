
import convertTime from "../../utils/convertTime";
import axios from "axios";
import { BASE_URL, token } from "../../config.js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../context/authContext.jsx";
import { useContext } from "react";

const Sidepanel = ({ doctorId, ticketPrice, timeSlots }) => {

  const { role ,user} = useContext(authContext)

  const navigate = useNavigate();
const handleBookingClick = () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (role === "doctor") {
      toast.error("Doctors can’t book appointments");
      return;
    }
    if (role === "patient") {
      navigate(`/doctors/${doctorId}/book`);
    }
  };
  return (
  <div className="shadow-panelShadow p-6 lg:p-6 rounded-xl bg-white">
    {/* Ticket Price Section */}
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <p className="text-lg font-semibold text-gray-700">Ticket Price</p>
      <span className="text-xl font-bold text-primaryColor">{ticketPrice} USD</span>
    </div>

    {/* Available Time Slots (optional, uncomment if needed) */}
    {/* <div className="mb-6">
      <p className="text-base font-semibold text-gray-700">Available Time Slots:</p>
      <ul className="mt-3 space-y-2">
        {timeSlots?.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md shadow-sm"
          >
            <p className="font-medium">
              {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
            </p>
            <p className="font-medium">
              {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
            </p>
          </li>
        ))}
      </ul>
    </div> */}

    {/* Book Appointment Button */}
    {role !== "doctor" && (
      <button
        onClick={handleBookingClick}
        className="w-full py-3 rounded-lg bg-primaryColor text-white font-semibold text-lg shadow-md hover:bg-primaryColor/90 transition-all duration-200"
      >
        Book Appointment
      </button>
    )}
  </div>
);
return (
  <div className="shadow-panelShadow p-6 lg:p-6 rounded-xl bg-white">
    {/* Ticket Price Section */}
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <p className="text-lg font-semibold text-gray-700">Ticket Price</p>
      <span className="text-xl font-bold text-primaryColor">{ticketPrice} USD</span>
    </div>

    {/* Available Time Slots (optional, uncomment if needed) */}
    {/* <div className="mb-6">
      <p className="text-base font-semibold text-gray-700">Available Time Slots:</p>
      <ul className="mt-3 space-y-2">
        {timeSlots?.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md shadow-sm"
          >
            <p className="font-medium">
              {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
            </p>
            <p className="font-medium">
              {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
            </p>
          </li>
        ))}
      </ul>
    </div> */}

    {/* Book Appointment Button */}
    {role !== "doctor" && (
      <button
        onClick={handleBookingClick}
        className="w-full py-3 rounded-lg bg-primaryColor text-white font-semibold text-lg shadow-md hover:bg-primaryColor/90 transition-all duration-200"
      >
        Book Appointment
      </button>
    )}
  </div>
);

};

export default Sidepanel;
