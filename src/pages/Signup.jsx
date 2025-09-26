import React, { useState } from "react";
import signupImg from "../assets/images/signup.gif";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../utils/uploadCloudinary.js";
import { BASE_URL } from "../config.js";

import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader.js";

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    photo: "",
    gender: "",
    role: "patient",
    age: "",
  });


  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    const data = await uploadImageToCloudinary(file);

    console.log(data);

    setPreviewURL(data.url);
    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });
    // cloudinary to upload files
    // console.log(file);
  };

  // const submitHandler = async (event) => {
  //   // console.log(formData);
  //   event.preventDefault();
  //   setLoading(true);

  //   try {
  //     const res = await axios.post(`${BASE_URL}/auth/register`, formData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const { message } = await res.json();
  //     if (!res.ok) {
  //       throw new Error(message);
  //     }

  //     setLoading(false);
  //     toast.success(message);
  //     navigate("/login");
  //   } catch (err) {
  //     toast.error(err.message);
  //     setLoading(false);
  //   }
  // };
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Axios automatically throws an error for non-2xx status codes,
      // so we don't need to check res.ok

      setLoading(false);
      toast.success(res.data.message);

      navigate("/login");
    } catch (err) {
      setLoading(false);
      // Error handling for Axios
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(err.response.data.message || "An error occurred");
      } else if (err.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="px-5 xl:px-0 ">
      <div className="max-w-[1050px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Img box */}

          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>

          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10 ">
              Create an <span className=" text-primaryColor">Account</span>
            </h3>

            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  name="name"
                  id=""
                  placeholder="FullName"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  name="email"
                  id=""
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  name="password"
                  id=""
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  name="confirmPassword"
                  id=""
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="number"
                  name="phone"
                  id=""
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>


              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlFor=""
                  className="text-headingColor font-bold text-[16px] leading-7"
                >
                  Are you a :
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    id=""
                    className=" text-textColor font-semibold text-[15px] leading-7 px-4 py- focus:outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>
                <label className="text-headingColor font-bold text-[16px] leading-7">
                  Gender :
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    id=""
                    className=" text-textColor font-semibold text-[15px] leading-7 px-4 py- focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <div className="mb-2 flex items-center gap-3">
                {selectedFile && (
                  <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                    <img
                      src={previewURL}
                      alt=""
                      className="w-full rounded-full"
                    />
                  </figure>
                )}

                <div className="relative w-[130px] h-[50px]">
                  <input
                    type="file"
                    name="photo"
                    id="customfile"
                    onChange={handleFileInputChange}
                    accept="image/*"
                    className=" absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <label
                    htmlFor="customfile"
                    className=" absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer "
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className=" mt-2">
                <button
                  disabled={loading && true}
                  type="submit"
                  className="btn mt-3 w-full rounded-md"
                >
                  {loading ? (
                    <HashLoader size={35} color="#ffffff" />
                  ) : (
                    "Register"
                  )}
                </button>
                {/* <Toaster /> */}
                {/* <ToastContainer position="top-center" autoClose={3000} /> */}
              </div>

              <p className="mt-5 text-textColor text-center">
                {"Already"} Have an Account?
                <Link to="/login" className=" text-primaryColor">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
