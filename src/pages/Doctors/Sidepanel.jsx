
import convertTime from "../../utils/convertTime";
import axios from "axios";
import { BASE_URL, token } from "../../config.js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../context/authContext.jsx";
import { useContext } from "react";

const Sidepanel = ({ doctorId, ticketPrice, timeSlots }) => {

  const { role } = useContext(authContext)

  const navigate = useNavigate();
  const navigateBooking = (doctorId) => {
    if (role === 'patient') {
      navigate(`/doctors/${doctorId}/book`)
    }
    else {
      toast.error("not authorized for booking");
    }
  }
  return (
    <div className="shadow-panelShadow p-5 pb-8 lg:p-5 rounded-md">
      <div className="flex items-center justify-between mb-8">
        <p className="text__para mt-0 font-semibold ">Ticket price</p>
        <span className="text-[16px] leading-7 lg:leading-8 text-headingColor font-bold">
          {ticketPrice} USD
        </span>
      </div>

      {/* <div className="mt-[30px] mb-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">
          Available Time Solts :
        </p>

        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
              </p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {convertTime(item.startingTime)} - {convertTime(item.endingTime)}

              </p>
            </li>
          ))}
        </ul>
      </div> */}

      {/* <button
        onClick={navigateBooking(doctorId)}
        className="btn m-10 px-2 w-full rounded-md"
      >
        Book Appointment
      </button> */}
      {
        role === "patient" ? (<Link
          to={`/doctors/${doctorId}/book`}
          className="btn m-10 px-2 w-full rounded-md"
        >
          Book Appointment
        </Link>) : ""}
    </div>


  );
};

export default Sidepanel;
