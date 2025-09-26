import React from "react";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

const ServiceCard = ({ item, index }) => {
  const { name, desc, bgColor, textColor, imgUrl } = item;
  console.log("imgUrl ",imgUrl)

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      {/* Image */}
      <img src={imgUrl} alt={name} className="w-full h-72 object-cover " />

      {/* Content */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900">{name}</h2>
        <p className="text-gray-600 text-sm mt-2">{desc}</p>

        {/* Bottom actions */}
        <div className="flex items-center justify-between mt-4">
          {/* Button */}
          <Link
            to="/doctors"
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group hover:bg-teal-600 hover:border-none"
          >
            <BsArrowRight className="group-hover:text-white w-5 h-5" />
          </Link>

          {/* Number */}
          <span
            className="w-10 h-10 flex items-center justify-center text-sm font-semibold rounded"
            style={{
              background: bgColor,
              color: textColor,
            }}
          >
            {index + 1}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
