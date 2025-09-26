import { useState } from "react";

export default function ReceptionistDashboard() {
  const [tab, setTab] = useState("dashboard");

  // Render content dynamically
  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <div className="p-4">📊 Dashboard Content</div>;
      case "patients":
        return <div className="p-4">👩‍⚕️ Patients List / Management</div>;
      case "referrals":
        return <div className="p-4">🔗 Referrals Information</div>;
      case "appointments":
        return <div className="p-4">📅 Appointments Scheduling</div>;
      case "profile":
        return <div className="p-4">🙍 Receptionist Profile Settings</div>;
      default:
        return <div className="p-4">Select a tab</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold text-primaryColor mb-6">
          Receptionist Panel
        </h2>

        <div className="space-y-2">
          <button
            onClick={() => setTab("dashboard")}
            className={`${
              tab === "dashboard"
                ? "bg-indigo-100 text-primaryColor"
                : "bg-transparent text-headingColor"
            } w-full btn mt-0 rounded-md`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setTab("patients")}
            className={`${
              tab === "patients"
                ? "bg-indigo-100 text-primaryColor"
                : "bg-transparent text-headingColor"
            } w-full btn mt-0 rounded-md`}
          >
            Patients
          </button>

          <button
            onClick={() => setTab("referrals")}
            className={`${
              tab === "referrals"
                ? "bg-indigo-100 text-primaryColor"
                : "bg-transparent text-headingColor"
            } w-full btn mt-0 rounded-md`}
          >
            Referrals
          </button>

          <button
            onClick={() => setTab("appointments")}
            className={`${
              tab === "appointments"
                ? "bg-indigo-100 text-primaryColor"
                : "bg-transparent text-headingColor"
            } w-full btn mt-0 rounded-md`}
          >
            Appointments
          </button>

          <button
            onClick={() => setTab("profile")}
            className={`${
              tab === "profile"
                ? "bg-indigo-100 text-primaryColor"
                : "bg-transparent text-headingColor"
            } w-full btn mt-0 rounded-md`}
          >
            Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white m-4 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
}

