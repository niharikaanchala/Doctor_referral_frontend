import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";
import axios from "axios";
import { toast } from "react-toastify";
import { authContext } from "../context/authContext.jsx";
import HashLoader from "react-spinners/HashLoader.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useContext(authContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Axios automatically throws an error for non-2xx status codes,
      // so we don't need to check res.ok
      const result = res.data;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: result.data,
          token: result.token,
          role: result.role,
        },
      });

      console.log(result, " login data");

      setLoading(true);
      toast.success(res.data.message);

      // if(result.role == "receptionist"){
        
      //   window.location.href = "/doctors/profile/me";
      // }
      // else if(result.role == "receptionist"){
        
      //   // window.location.href = "/receptionists/profile/me";
      //   navigate("/receptionists/profile/me")
      // }
      // else{
        
      //   window.location.href = "/home";
      // }
      window.location.href = "/home";

      // navigate('/home')
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
        console.log(err);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className=" text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello ! <span className="text-primaryColor">Welcome</span> Back
        </h3>

        <form className="py-4 md:py-0" onSubmit={submitHandler}>
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
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
              required
            />
          </div>

          <div className="mt-7">
            <button type="submit" className="btn w-full rounded-md">
              {loading ? <HashLoader size={35} color="#fff" /> : "login"}
            </button>
          </div>

          <p className="mt-5 text-textColor text-center">
            {"Don't"} Have an Account?
            <Link to="/signup" className=" text-primaryColor">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
