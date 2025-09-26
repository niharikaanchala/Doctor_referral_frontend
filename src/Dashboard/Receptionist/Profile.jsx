import { useEffect, useState, useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageToCloudinary from "../../utils/uploadCloudinary.js";
import { BASE_URL, token } from "../../config.js";
import { toast } from "react-toastify";
import axios from "axios";
import { authContext } from "../../context/authContext.jsx";

const Profile = ({ receptionistData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    name: "",
    email: receptionistData.email,
    password: receptionistData.password,
    phone: "",
    
    gender: "",
    about: receptionistData.about,
    photo: null,
  });
  const { updateUser } = useContext(authContext);

  useEffect(() => {
    setFormData({
      name: receptionistData?.name,
      email: receptionistData?.email,
      password: receptionistData?.password,
      phone: receptionistData?.phone,
  
      gender: receptionistData?.gender,
      about: receptionistData?.about,
      photo: receptionistData?.photo,
    });
  }, [receptionistData]);

  console.log(formData)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);
    setFormData({ ...formData, photo: data?.url });
  };

   const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/auth/receptionists`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateUser(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Time slot related functions
  const handleTimeSlotDayChange = (e) => {
    const { value } = e.target;
    setTimeSlotState({
      ...timeSlotState,
      selectedDay: value,
      daysToApply: timeSlotState.daysToApply.includes(value)
        ? timeSlotState.daysToApply
        : [...timeSlotState.daysToApply, value]
    });
  };

  const handleTimeSlotTimeChange = (e) => {
    const { name, value } = e.target;
    setTimeSlotState({ ...timeSlotState, [name]: value });
  };

  const toggleDaySelection = (day) => {
    setTimeSlotState(prev => ({
      ...prev,
      daysToApply: prev.daysToApply.includes(day)
        ? prev.daysToApply.filter(d => d !== day)
        : [...prev.daysToApply, day]
    }));
  };

  const addTimeSlot = (e) => {
    e.preventDefault();

    if (!timeSlotState.startingTime || !timeSlotState.endingTime) {
      toast.error("Please select both starting and ending times");
      return;
    }

    if (timeSlotState.daysToApply.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    const newSlots = timeSlotState.daysToApply.map(day => ({
      day: day,
      startingTime: timeSlotState.startingTime,
      endingTime: timeSlotState.endingTime,
      isAvailable: true
    }));

    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, ...newSlots]
    }));

    // Reset time inputs but keep selected days
    setTimeSlotState(prev => ({
      ...prev,
      startingTime: "",
      endingTime: ""
    }));
  };

  const deleteTimeSlot = (e, index) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  // Reusable functions for qualifications and experiences
  const addItem = (key, item) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: [...prevFormData[key], item],
    }));
  };

  const deleteItem = (key, index) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: prevFormData[key].filter((_, i) => i !== index),
    }));
  };

  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => {
      const updateItems = [...prevFormData[key]];
      updateItems[index][name] = value;
      return {
        ...prevFormData,
        [key]: updateItems,
      };
    });
  };

  const addQualification = (e) => {
    e.preventDefault();
    addItem("qualifications", {
      startingDate: "",
      endingDate: "",
      degree: "PHD",
      university: "Usmonia medical college",
    });
  };

  const handleQualificationChange = (event, index) => {
    handleReusableInputChangeFunc("qualifications", index, event);
  };

  const deleteQualification = (e, index) => {
    e.preventDefault();
    deleteItem("qualifications", index);
  };

  const addExperience = (e) => {
    e.preventDefault();
    addItem("experiences", {
      startingDate: "",
      endingDate: "",
      position: "Senior Surgeon",
      hospital: "Usomonia Medical",
    });
  };

  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc("experiences", index, event);
  };

  const deleteExperience = (e, index) => {
    e.preventDefault();
    deleteItem("experiences", index);
  };

  // Overview Component
  const OverviewTab = () => (
    <div className="space-y-6">
      <h2 className="text-headingColor font-bold text-[24px] leading-9">
        Profile Overview
      </h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Personal Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-gray-900">{formData.name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{formData.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium text-gray-900">{formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Specialization</p>
              <p className="font-medium text-gray-900">{formData.specialization ? formData.specialization.charAt(0).toUpperCase() + formData.specialization.slice(1) : "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ticket Price</p>
              <p className="font-medium text-gray-900">${formData.ticketPrice || "0"}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {formData.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
            <p className="text-gray-700">{formData.bio}</p>
          </div>
        )}

        {/* About */}
        {formData.about && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{formData.about}</p>
          </div>
        )}

        {/* Qualifications */}
        {formData.qualifications?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
            <div className="space-y-4">
              {formData.qualifications.map((qual, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Degree</p>
                      <p className="font-medium text-gray-900">{qual.degree}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">University</p>
                      <p className="font-medium text-gray-900">{qual.university}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium text-gray-900">{qual.startingDate || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium text-gray-900">{qual.endingDate || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences */}
        {formData.experiences?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiences</h3>
            <div className="space-y-4">
              {formData.experiences.map((exp, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="font-medium text-gray-900">{exp.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hospital</p>
                      <p className="font-medium text-gray-900">{exp.hospital}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium text-gray-900">{exp.startingDate || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium text-gray-900">{exp.endingDate || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Slots */}
        {formData.timeSlots?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.timeSlots
                ?.slice()
                .sort((a, b) => {
                  const dayOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                  return dayOrder.indexOf(a.day.toLowerCase()) - dayOrder.indexOf(b.day.toLowerCase());
                })
                .map((slot, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="font-medium text-green-800 capitalize">{slot.day}</p>
                    <p className="text-green-600">{slot.startingTime} - {slot.endingTime}</p>
                   </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Settings Component (your existing form)
  const SettingsTab = () => (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
      </h2>

      <form onSubmit={updateProfileHandler}>
        <div className="mb-5">
          <p className="form__label">Name*</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full name"
            className="form__input"
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Email*</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="form__input"
            readOnly
            disabled
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Phone*</p>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone No"
            className="form__input"
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Gender*</p>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="form__input py-3.5"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Others</option>
          </select>
        </div>

      

        <div className="mb-5">
          <p className="form__label">About*</p>
          <textarea
            name="about"
            rows={5}
            value={formData.about}
            placeholder="Write about you"
            className="form__input"
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img src={formData.photo} alt="" className="w-full rounded-full" />
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
              className=" absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>

        <div className="mt-7">
          <button
            type="submit"
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );


  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-primaryColor text-primaryColor"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "settings"
              ? "border-primaryColor text-primaryColor"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? <OverviewTab /> : <SettingsTab />}
    </div>
  );
};

export default Profile;