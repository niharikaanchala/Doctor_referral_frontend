import { useState, useEffect } from "react";
import { FormatDate } from "../../utils/FormatDate.js";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config.js";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading.jsx";

const Appointments = ({ appointments }) => {
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [cancelMode, setCancelMode] = useState(null); // 'date' or 'slot'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRowClick = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  // Get available time slots when date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!filterDate) {
        setAvailableSlots([]);
        setSelectedSlot(null);
        return;
      }

      setLoadingSlots(true);
      try {
        const res = await fetch(`${BASE_URL}/doctors/available-slots`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ date: filterDate }),
        });

        const data = await res.json();
        if (data.success) {
          const formattedSlots = data.availableSlots.map(slot => ({
            value: `${slot.startingTime}-${slot.endingTime}`,
            label: `${slot.startingTime} - ${slot.endingTime}`,
            raw: slot
          }));
          setAvailableSlots(formattedSlots);
          console.log(formattedSlots)
          setSelectedSlot(null);
        } else {
          setAvailableSlots([]);
          toast.error(data.message || "Failed to fetch available slots");
        }
      } catch (err) {
        console.error("Failed to fetch available slots", err);
        toast.error("Failed to fetch available slots");
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [filterDate]);

  const handleFilter = async (isSilent = false) => {
    if (!filterDate) {
      if (!isSilent) toast.error("Please select a date");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/doctors/appointments/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date: filterDate,
          ...(selectedSlot && {
            startingTime: selectedSlot.raw.startingTime,
            endingTime: selectedSlot.raw.endingTime
          })
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFilteredAppointments(data.data || []);
        setFiltering(true);
        setCancelMode(selectedSlot ? 'slot' : 'date');
      } else {
        setFilteredAppointments([]);
        setFiltering(false);
        if (!isSilent) toast.error(data.message || "No bookings found");
      }
    } catch (err) {
      console.error("Failed to filter appointments", err.message);
      setFilteredAppointments([]);
      setFiltering(false);
      if (!isSilent) toast.error("Something went wrong during filtering.");
    }
  };

  useEffect(() => {
    const autoFilter = async () => {
      if (!filterDate) return;

      try {
        const res = await fetch(`${BASE_URL}/doctors/appointments/filter`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          // Pass filter via query params
          // Use encodeURIComponent for safe URL construction
        });

        const url = new URL(`${BASE_URL}/doctors/appointments/filter`);
        url.searchParams.append("date", filterDate);
        if (selectedSlot) {
          url.searchParams.append("startingTime", selectedSlot.raw.startingTime);
          url.searchParams.append("endingTime", selectedSlot.raw.endingTime);
        }

        const resAuto = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await resAuto.json();

        if (data.success) {
          setFilteredAppointments(data.data || []);
          setFiltering(true);
          setCancelMode(selectedSlot ? "slot" : "date");
        } else {
          setFilteredAppointments([]);
          setFiltering(false);
          toast.error(data.message || "No bookings found");
        }
      } catch (err) {
        console.error("Auto-filter error", err.message);
        setFilteredAppointments([]);
        setFiltering(false);
        toast.error("Something went wrong during filtering.");
      }
    };

    autoFilter();
  }, [filterDate, selectedSlot]);


  const handleCancel = async () => {
    if (!filterDate) {
      toast.error("Please select a date first.");
      return;
    }

    if (cancelMode === 'slot' && !selectedSlot) {
      toast.error("Please select a time slot to cancel.");
      return;
    }

    const confirmationMessage = cancelMode === 'date'
      ? `Are you sure you want to cancel ALL ${filteredAppointments.length} bookings for ${filterDate}?`
      : `Are you sure you want to cancel ${filteredAppointments.length} bookings for ${filterDate} at ${selectedSlot.label}?`;

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/doctors/appointments/cancel-slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date: filterDate,
          ...(cancelMode === 'slot' && {
            startingTime: selectedSlot.raw.startingTime,
            endingTime: selectedSlot.raw.endingTime
          })
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsRefreshing(true); // Show loader
        await handleFilter(true); // Pass flag to avoid toast
        setIsRefreshing(false);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel appointments.");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 border-b rounded-t">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
          {loadingSlots ? (
            <div className="px-4 py-2 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              Loading...
            </div>
          ) : (
            <select
              value={selectedSlot?.value || ""}
              onChange={(e) => {
                const slot = availableSlots.find(
                  (s) => s.value === e.target.value
                );
                setSelectedSlot(slot || null);
              }}
              className="w-full border px-3 py-2 rounded"
              disabled={!filterDate || availableSlots.length === 0}
            >
              <option value="">All Time Slots</option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-end gap-2">

        </div>
      </div>

      {filtering && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">
                Showing appointments for <span className="text-blue-600">{filterDate}</span>
                {selectedSlot && (
                  <span> at <span className="text-blue-600">{selectedSlot.label}</span></span>
                )}
              </h3>
              <p className="text-sm text-gray-600">
                Found {filteredAppointments.length} appointment(s)
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className={`px-4 py-2 rounded text-sm ${filteredAppointments.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                disabled={filteredAppointments.length === 0}
              >
                {cancelMode === 'date' ? 'Cancel All for Date' : 'Cancel This Slot'}
              </button>
              <button
                onClick={() => {
                  setFiltering(false);
                  setFilteredAppointments([]);
                  setFilterDate("");
                  setSelectedSlot(null);
                  setCancelMode(null);
                }}
                className="px-4 py-2 rounded text-sm bg-white border border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
      {isRefreshing ? (
        <div className="p-6">
          <Loading />
        </div>
      ) : (
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Patient</th>
              <th scope="col" className="px-6 py-3 font-medium">Gender</th>
              <th scope="col" className="px-6 py-3 font-medium">Payment</th>
              <th scope="col" className="px-6 py-3 font-medium">Price</th>
              <th scope="col" className="px-6 py-3 font-medium">Date</th>
              <th scope="col" className="px-6 py-3 font-medium">Time Slot</th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filtering && filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No appointments found for the selected criteria
                </td>
              </tr>
            ) : (
              (filtering ? filteredAppointments : appointments)?.map((item) => {
                const timeSlot = item.timeSlot || {};
                const startingTime = timeSlot.startingTime || 'N/A';
                const endingTime = timeSlot.endingTime || 'N/A';
                const appointmentDate = item.appointmentDate ? FormatDate(item.appointmentDate) : 'N/A';

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(item._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.user.photo}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={item.user.name}
                        />
                        <div className="ml-3 relative">
                          <div className="font-medium text-gray-900">
                            {item.user.name}
                            {item.unreadPatientUpdates > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {item.unreadPatientUpdates}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500 text-sm">{item.user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${item.user.gender === 'male'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-pink-100 text-pink-800'
                        }`}>
                        {item.user.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isPaid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {item.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.ticketPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointmentDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {startingTime} - {endingTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {item.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default Appointments;