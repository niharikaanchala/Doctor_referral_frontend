import React from "react";
import heroImg from "../assets/images/hero-img01.png";
import heroImg02 from "../assets/images/hero-img02.png";
import heroImg03 from "../assets/images/hero-img03.png";
import faqImg from "../assets/images/faq-img.png";
import icon01 from "../assets/images/icon01.png";
import icon02 from "../assets/images/icon02.png";
import icon03 from "../assets/images/icon03.png";
import featureImg from "../assets/images/feature-img.png";
import videoIcon from "../assets/images/video-icon.png";
import avatarIcon from "../assets/images/avatar-icon.png";
import { useContext } from "react";
import { authContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../components/About/About";
import ServicesList from "../components/services/ServicesList.jsx";
import DoctorsList from "../components/Doctors/DoctorsList.jsx";
import FaqList from "../components/faq/FaqList.jsx";
import Testimonial from "../components/Testimonial/Testimonial.jsx";
import { Search, Upload, Brain, ArrowRight } from "lucide-react";
import Security from "./Security.jsx";

const Home = () => {
  const { user } = useContext(authContext);
  const navigate = useNavigate();

  const handleAppointmentRequest = () => {
    if (user) {
      navigate("/doctors");
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <>
      <section className="hero__section py-20 bg-gray-50">
  <div className="container text-center">
    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
      Find the right doctor.
    </h1>
    <h3 className="mt-4 text-[25px]"> Book in minutes. Get smarter care.</h3>
    <p className="mt-4 text-lg text-gray-600">
      AI-assisted booking & referrals for faster, transparent healthcare.
    </p>

    {/* Search Bar */}
    <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4 bg-white shadow-lg rounded-xl p-4 max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search by symptom / specialty"
        className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryColor"
      />
      <input
        type="text"
        placeholder="City / locality"
        className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryColor"
      />
      <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-teal-700 transition">
        Search Doctors
      </button>
    </div>
  </div>
</section>


        {/* Hero section end */}

        <section>
          <div className="container">
            <div className="lg:w-[550px] mx-auto ">
              <h2 className="heading text-center">
                Providing the best medical services
              </h2>
            <p className="text__para text-center">
  Compassionate, expert care for every patient. Our network provides advanced treatments and personalized support to help you stay healthy.
</p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px] ">
              <div className="py-[30px] px-5">
                <div className="flex items-center justify-center ">
                  <img src={icon01} alt="" />
                </div>

                <div className="mt-[30px]">
                  <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center ">
                    Find a Doctor
                  </h2>
                  <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center ">
                    World-class care for everyone . Our health System offers
                    unmatched, expert health care.
                  </p>

                  <Link
                    to="/doctors"
                    className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none "
                  >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                  </Link>
                </div>
              </div>
              <div className="py-[30px] px-5">
                <div className="flex items-center justify-center ">
                  <img src={icon02} alt="" />
                </div>

                <div className="mt-[30px]">
                  <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center ">
                    Find a Location
                  </h2>
                  <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center ">
                    World-class care for everyone . Our health System offers
                    unmatched, expert health care.
                  </p>

                  <Link
                    to="/doctors"
                    className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none "
                  >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                  </Link>
                </div>
              </div>
              <div className="py-[30px] px-5">
                <div className="flex items-center justify-center ">
                  <img src={icon03} alt="" />
                </div>

                <div className="mt-[30px]">
                  <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center ">
                    Book an Appointment
                  </h2>
                  <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center ">
                    World-class care for everyone . Our health System offers
                    unmatched, expert health care.
                  </p>

                  <Link
                    to="/doctors"
                    className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none "
                  >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* about section */}

        <About />

        {/* Services Section */}

        <section>
          <div className="container">
            <div className="xl:w-[470px] mx-auto ">
              <h2 className="heading text-center">Our Medical Services</h2>
              <p className="text__para text-center">
                World-class care for everyone . Our health System offers
                unmatched, expert health care.
              </p>
            </div>
            <ServicesList />
          </div>
        </section>

        {/* Features Section */}
      <section className="py-20 bg-gray-50">
  <div className="container text-center">
    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
      How It Works
    </h2>
    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
      Simple steps to better healthcare with AI-powered insights
    </p>

    {/* Steps Grid */}
    <div className="mt-12 justify-center items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Step 1 */}
      <div className="bg-white shadow rounded-2xl p-6 relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
          1
        </div>
        <div className="flex justify-center mb-4">
          <span className="p-3 bg-teal-50 rounded-xl">
            <Search className="w-8 h-8 text-blue-700" />
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Search & Choose</h3>
        <p className="mt-2 text-gray-600">
          Find the right doctor and pick a convenient time slot
        </p>
        <div className="absolute right-[-15px] top-1/2 transform -translate-y-1/2 hidden lg:block">
          <span className="w-8 h-8 flex items-center justify-center bg-teal-50 rounded-full">
            <ArrowRight className="w-5 h-5 text-blue-700" />
          </span>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white shadow rounded-2xl p-6 relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
          2
        </div>
        <div className="flex justify-center mb-4">
          <span className="p-3 bg-teal-50 rounded-xl">
            <Upload className="w-8 h-8 text-blue-700" />
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Upload & Pay</h3>
        <p className="mt-2 text-gray-600">
          Share your symptoms, reports and complete secure payment
        </p>
        <div className="absolute right-[-15px] top-1/2 transform -translate-y-1/2 hidden lg:block">
          <span className="w-8 h-8 flex items-center justify-center bg-teal-50 rounded-full">
            <ArrowRight className="w-5 h-5 text-blue-700" />
          </span>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white shadow rounded-2xl p-6 relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
          3
        </div>
        <div className="flex justify-center mb-4">
          <span className="p-3 bg-teal-50 rounded-xl">
            <Brain className="w-8 h-8 text-blue-700" />
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI-Enhanced Consult</h3>
        <p className="mt-2 text-gray-600">
          Doctor reviews AI summary and provides personalized care
        </p>
     
      </div>

      
    </div>
  </div>
</section>

        {/* End of features Section */}

        {/* our  Doctors Section */}

        <section>
          <div className="container">
            <div className="xl:w-[550px] mx-auto ">
              <h2 className="heading text-center">Meet Our Top Specialists</h2>

              <p className="text__para text-center">
                World-class care for everyone . Our health System offers
                unmatched, expert health care.
              </p>
            </div>
            <DoctorsList />
          </div>
        </section>

        {/* end of our doctors */}

        {/* faq section */}

     <section className="py-16 px-6 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-14">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Find answers to common questions about our platform, for both patients and doctors.
      </p>
    </div>

    {/* FAQ Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Patients FAQ */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Patients</h3>
        <div className="space-y-4">
          {[
            {
              question: "How do consultation fees work?",
              answer: "Consultation fees vary depending on the doctor and service. You will see the fee before confirming your appointment."
            },
            {
              question: "Is my medical data private?",
              answer: "Yes, all medical data is securely stored and only accessible by you and your authorized doctors."
            },
            {
              question: "Can I choose online or in-person consultations?",
              answer: "Yes, you can choose your preferred consultation mode while booking an appointment."
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <summary className="font-medium cursor-pointer flex justify-between items-center">
                {faq.question}
                <span className="ml-2 transition-transform duration-300 group-open:rotate-45 text-indigo-500">
                  +
                </span>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Doctors FAQ */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Doctors</h3>
        <div className="space-y-4">
          {[
            {
              question: "How do AI insights work?",
              answer: "Our AI analyzes patient data to provide actionable insights and treatment suggestions to doctors."
            },
            {
              question: "Can I track referred patients?",
              answer: "Yes, our platform allows you to track patients referred to you from other healthcare professionals."
            },
            {
              question: "How secure is patient data?",
              answer: "Patient data is stored using industry-standard encryption and security protocols to ensure privacy and protection."
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <summary className="font-medium cursor-pointer flex justify-between items-center">
                {faq.question}
                <span className="ml-2 transition-transform duration-300 group-open:rotate-45 text-indigo-500">
                  +
                </span>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>


        {/* faq section end */}

        {/* Testimonal section */}

        <section>
          <div className="container">
            <div className="xl:w-[500px] mx-auto ">
              <h2 className="heading text-center">What our patients Say</h2>
              <p className="text__para text-center">
                World-class care for everyone . Our health System offers
                unmatched, expert health care.
              </p>
            </div>

            <Testimonial />
          </div>
        </section>
        {/* Testimonal section end */}
        <Security/>
      </>
    </>
  );
};

export default Home;
