import { useNavigate } from "react-router-dom";
import useFetchdata from "../../hooks/useFetchdata.jsx";
import { BASE_URL } from "../../config";
import Loading from "../../components/loader/Loading.jsx";
import Error from "../../components/Error/Error.jsx";
import convertTime from "../../utils/convertTime";

const MyBookings = () => {
  const navigate = useNavigate();
  const {
    data: bookings,
    loading,
    error,
  } = useFetchdata(`${BASE_URL}/users/appointments/my-appointments`);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-headingColor">My Appointments</h1>

      {loading && !error && <Loading />}

      {error && !loading && <Error errMessage={error} />}

      {!loading && !error && (
        <div className="space-y-6">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Doctor Information */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4">

                      <img
                        src={booking.doctor?.photo || '/default-doctor.jpg'}
                        className="w-20 h-20 rounded-full object-cover border-2 border-primaryColor"
                        alt={booking.doctor?.name}
                      />
                      <div className="relative">
                        <h3 className="text-xl font-bold text-headingColor">
                         {booking.doctor?.name}
                        </h3>
                        <p className="text-gray-600">{booking.doctor?.specialization}</p>
                        {booking.unreadDoctorResponses > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {booking.unreadDoctorResponses}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Doctor Experience */}
                    {booking.doctor?.experiences?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-800">Experience:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {booking.doctor.experiences.map((exp, i) => (
                            <li key={i}>
                              {exp.position} at {exp.hospital} ({exp.startingDate} - {exp.endingDate || 'Present'})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 space-y-3">
                    <div className="border-b pb-3">
                      <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
                      <p className="text-gray-600">
                        <span className="font-medium">Date:</span> {new Date(booking.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        {/* <span className="font-medium">Time Slot:</span> {booking.timeSlot.day}, {convertTime(booking.timeSlot.startingTime)} - {convertTime(booking.timeSlot.endingTime)} */}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {booking.status}
                        </span>
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800">Health Concerns:</h4>
                      <p className="text-gray-600 whitespace-pre-line">
                        {booking.currentHealthIssues || "No health issues specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => navigate(`/bookings/${booking._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Get in Touch
                  </button>
                  <button
                    onClick={() => navigate(`/doctors/${booking.doctor._id}`)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    View Doctor Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700">
                You haven't booked any appointments yet
              </h2>
              <p className="text-gray-500 mt-2">
                Book your first appointment to see it listed here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;