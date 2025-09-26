import { useEffect, useState, useContext } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../../utils/uploadCloudinary.js";
import { BASE_URL, token } from "../../config.js";
import { authContext } from "../../context/authContext.jsx";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader.js";

const ProfileSettings = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { updateUser } = useContext(authContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    photo: "",
    age: "",
    gender: "",
    bloodType: "",
    bp: { value: "", known: true },
    diabetic: { value: "", known: true },
    hyperthyroidism: { value: "", known: true },
  });


  const navigate = useNavigate();
  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      photo: user.photo || "",
      phone: user.phone || "",
      gender: user.gender || "",
      age: user.age || "",
      bloodType: user.bloodType || "",
      bp: user.bp || { value: "", known: true },
      diabetic: user.diabetic || { value: "", known: true },
      hyperthyroidism: user.hyperthyroidism || { value: "", known: true },
    });
  }, [user]);


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    const data = await uploadImageToCloudinary(file);
    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });

    console.log(data);

    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });
    // cloudinary to upload files
    console.log(file);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(`${BASE_URL}/users/${user._id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Axios automatically throws an error for non-2xx status codes,
      // so we don't need to check res.ok

      setLoading(false);
      updateUser(res.data.data);
      toast.success(res.data.message);

      navigate("/users/profile/me", { replace: true });
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
    <div className="mt-10">
      <form onSubmit={submitHandler}>
        <div className="mb-5">
          <input
            type="text"
            name="name"
            id=""
            placeholder="FullName"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            aria-readonly
            readOnly
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
            aria-readonly
            readOnly
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
          />
        </div>
        <div className="mb-5">
          <input
            type="number"
            name="phone"
            id=""
            placeholder="Enter your mobile no"
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
            className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            name="bloodType"
            id=""
            placeholder="Blood Type"
            value={formData.bloodType}
            onChange={handleInputChange}
            className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
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
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img
                src={formData.photo}
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
              {selectedFile ? selectedFile.name : "Upload Photo"}
            </label>
          </div>
        </div>
        <div className="mb-5">

          <input
            type="text"
            name="bpValue"
            placeholder="BP eg 120/80"
            value={formData.bp.value}
            className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor txet-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"

            onChange={(e) =>
              setFormData({
                ...formData,
                bp: { ...formData.bp, value: e.target.value },
              })
            }

          />
          <label className="text-sm ml-2">
            <input
              type="checkbox"
              checked={!formData.bp.known}
              onChange={() =>
                setFormData({
                  ...formData,
                  bp: { ...formData.bp, known: !formData.bp.known },
                })

              }

            />
            &nbsp; I don't know
          </label>
        </div>

        <div className="mb-5">
          <label>Diabetic:</label>
          <select
            name="diabetic"
            value={formData.diabetic.value}
            onChange={(e) =>
              setFormData({
                ...formData,
                diabetic: { ...formData.diabetic, value: e.target.value },
              })
            }
            className="w-full py-3 border-b border-[#0066ff61]"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <label className="text-sm ml-2">
            <input
              type="checkbox"
              checked={!formData.diabetic.known}
              onChange={() =>
                setFormData({
                  ...formData,
                  diabetic: {
                    ...formData.diabetic,
                    known: !formData.diabetic.known,
                  },
                })
              }
            />
            &nbsp; I don't know
          </label>
        </div>

        <div className="mb-5">
          <label>Hyperthyroidism:</label>
          <select
            name="hyperthyroidism"
            value={formData.hyperthyroidism.value}
            onChange={(e) =>
              setFormData({
                ...formData,
                hyperthyroidism: {
                  ...formData.hyperthyroidism,
                  value: e.target.value,
                },
              })
            }
            className="w-full py-3 border-b border-[#0066ff61]"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <label className="text-sm ml-2">
            <input
              type="checkbox"
              checked={!formData.hyperthyroidism.known}
              onChange={() =>
                setFormData({
                  ...formData,
                  hyperthyroidism: {
                    ...formData.hyperthyroidism,
                    known: !formData.hyperthyroidism.known,
                  },
                })
              }
            />
            &nbsp; I don't know
          </label>
        </div>


        <div className=" mt-2">
          <button
            disabled={loading && true}
            type="submit"
            className="btn mt-3 w-full rounded-md"
          >
            {loading ? <HashLoader size={25} color="#ffffff" /> : "Update "}
          </button>
          {/* <Toaster /> */}
          {/* <ToastContainer position="top-center" autoClose={3000} /> */}
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
