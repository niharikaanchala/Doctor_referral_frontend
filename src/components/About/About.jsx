import React from "react";
import { Heart, Stethoscope, Brain } from "lucide-react"; // icon library

const About = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Built for Everyone in Healthcare
        </h2>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          From patients to specialists, our platform streamlines healthcare for all stakeholders
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <span className="p-4 rounded-xl bg-teal-50">
                <Heart className="w-8 h-8 text-blue-700" />
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">For Patients</h3>
            <p className="mt-2 text-gray-600">
              Search doctors, view availability, upload reports, pay & confirm
            </p>
            <ul className="mt-4 text-left text-gray-600 space-y-2">
              <li>• Easy booking</li>
              <li>• Secure payments</li>
              <li>• Digital records</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <span className="p-4 rounded-xl bg-teal-50">
                <Stethoscope className="w-8 h-8 text-blue-700" />
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">For Doctors</h3>
            <p className="mt-2 text-gray-600">
              Accept/reject bookings, set availability, AI insights on symptoms/reports
            </p>
            <ul className="mt-4 text-left text-gray-600 space-y-2">
              <li>• Smart scheduling</li>
              <li>• AI clinical summaries</li>
              <li>• Referral network</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <span className="p-4 rounded-xl bg-teal-50">
                <Brain className="w-8 h-8 text-blue-700" />
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">For Specialists</h3>
            <p className="mt-2 text-gray-600">
              Receive referrals with context, update notes, share progress back
            </p>
            <ul className="mt-4 text-left text-gray-600 space-y-2">
              <li>• Contextual referrals</li>
              <li>• Collaborative care</li>
              <li>• Progress tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
