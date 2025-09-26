import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (bookingId) {
          await axios.get(`${BASE_URL}/bookings/payment-success?bookingId=${bookingId}`);
          // toast.success("Payment confirmed successfully!");
          setLoading(false); // hide loader only after successful processing
        }
      } catch (err) {
        toast.error("Error confirming payment");
        console.error(err);
        setLoading(false); // stop loading even on failure
      }
    };

    confirmPayment();
  }, [bookingId]);
  // if (loading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-gray-100">
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
  //         <p className="text-gray-700 font-semibold text-lg">
  //           Analyzing your health records...
  //         </p>
  //         <p className="text-sm text-gray-500">This may take a few seconds.</p>
  //       </div>
  //     </div>
  //   );
  // }


  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-6 md:mx-auto rounded-lg shadow-md max-w-md w-full">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.829a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for completing your secure online payment.
          </p>
          <p className="text-gray-600">Your appointment has been confirmed.</p>
          <div className="py-10 text-center">
            <Link
              to="/home"
              className="px-12 bg-buttonBgColor text-primaryColor font-semibold py-3 rounded-md hover:bg-opacity-90 transition duration-300"
            >
              Go Back To Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;