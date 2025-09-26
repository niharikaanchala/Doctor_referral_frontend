
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import { toast } from "react-hot-toast"
import { BASE_URL, token } from "../config";
import axios from "axios";
import { authContext } from "../context/authContext";
import convertTime from "../utils/convertTime";
import Loading from "../components/loader/Loading";
import Error from "../components/Error/Error";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { useContext } from "react";
import AnalyzeAi from "./AnalyzeAi";
import ReferToDoctor from "./doctor-account/ReferToDoctor";

const GetInTouch = () => {
    const { id: bookingId } = useParams();
    const [showChatBot, setShowChatBot] = useState(false);

    const { user: authUser, role } = useContext(authContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [booking, setBooking] = useState(null);
    const [newHealthIssues, setNewHealthIssues] = useState("");
    const [newReports, setNewReports] = useState([]);
    const [reportName, setReportName] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [newResponse, setNewResponse] = useState("");
    const [uploading, setUploading] = useState(false);
    const [healthIssueUpdatedAt, setHealthIssueUpdatedAt] = useState(null);
    const [expandedImage, setExpandedImage] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
    const [newGroupName, setNewGroupName] = useState("");
    const [showAI, setShowAI] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [showReferDoctor, setShowReferDoctor] = useState(false);

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBooking(response.data.data);
                setNewHealthIssues(response.data.data.currentHealthIssues);
                setAiAnalysis(response.data.data.aiAnalysis || "");
                setHealthIssueUpdatedAt(response.data.data.updatedAt);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBookingData();
        }
    }, [bookingId]);

    useEffect(() => {
        const resetCounters = async () => {
            try {
                if (role === 'patient' && booking?.unreadDoctorResponses > 0) {
                    await axios.put(
                        `${BASE_URL}/bookings/${bookingId}/reset-unread`,
                        { type: 'responses' },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } else if (role === 'doctor' && booking?.unreadPatientUpdates > 0) {
                    await axios.put(
                        `${BASE_URL}/bookings/${bookingId}/reset-unread`,
                        { type: 'updates' },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
            } catch (err) {
                console.error("Error resetting unread counters:", err);
            }
        };

        if (booking) {
            resetCounters();
        }
    }, [booking, bookingId, role, token]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const uploadedFile = await uploadImageToCloudinary(file);

            await axios.put(
                `${BASE_URL}/bookings/${bookingId}/reports`,
                { action: "add", reportUrl: uploadedFile.url },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooking(response.data.data);

            toast.success("Report uploaded successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload report");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleGroupedReportUpload = async () => {
        if (!reportName.trim() || selectedFiles.length === 0) {
            toast.error("Please provide a report name and select files");
            return;
        }

        try {
            setUploading(true);
            const uploadPromises = selectedFiles.map(file => uploadImageToCloudinary(file));
            const uploadedResults = await Promise.all(uploadPromises);
            const urls = uploadedResults.map(res => res.url);

            const res = await axios.post(
                `${BASE_URL}/bookings/${bookingId}/reports/save`,
                {
                    name: reportName,
                    urls
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setBooking(res.data.data);
            setReportName("");
            setSelectedFiles([]);
            toast.success("Reports uploaded & saved");
        } catch (err) {
            toast.error(err.response.data.message);
            console.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateHealthIssues = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${BASE_URL}/bookings/${bookingId}/health-issues`,
                { healthIssues: newHealthIssues },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setHealthIssueUpdatedAt(new Date().toISOString());
            toast.success("Health issues updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating health issues");
        }
    };

    const handleRemoveReport = async (reportUrl) => {
        try {
            await axios.put(
                `${BASE_URL}/bookings/${bookingId}/reports`,
                { action: "remove", reportUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooking(response.data.data);

            toast.success("Report removed successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove report");
        }
    };
    const handleRemoveImageFromGroup = async (groupName, url) => {
        try {
            await axios.put(
                `${BASE_URL}/bookings/${bookingId}/reports/${groupName}/remove-file`,
                { fileUrl: url },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooking(response.data.data);
            toast.success("Image removed from group");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove image");
        }
    };


    const handleAddResponse = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${BASE_URL}/bookings/${bookingId}/doctor-response`,
                { response: newResponse },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooking(response.data.data);

            toast.success("Response added successfully");
            setNewResponse("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding response");
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.put(
                `${BASE_URL}/bookings/${bookingId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBooking((prev) => ({ ...prev, status: newStatus }));
            toast.success(`Booking marked as ${newStatus}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status");
        }
    };


    const handleRemoveGroup = async (groupName) => {
        try {
            await axios.delete(
                `${BASE_URL}/bookings/${bookingId}/reports/${groupName}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooking(response.data.data);
            toast.success("Report group removed successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove report group");
        }
    };

    const handleUpdateGroupName = async (oldName) => {
        if (!newGroupName.trim()) {
            toast.error("Please enter a new group name");
            return;
        }
        try {
            await axios.put(
                `${BASE_URL}/bookings/${bookingId}/reports/${oldName}`,
                { newName: newGroupName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooking(response.data.data);
            setEditingGroup(null);
            setNewGroupName("");
            toast.success("Group name updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update group name");
        }
    };

    const handleAddToExistingGroup = async (groupName) => {
        if (selectedFiles.length === 0) {
            toast.error("Please select files to upload");
            return;
        }
        try {
            setUploading(true);
            const uploadPromises = selectedFiles.map(file => uploadImageToCloudinary(file));
            const uploadedResults = await Promise.all(uploadPromises);
            const urls = uploadedResults.map(res => res.url);

            await axios.put(
                `${BASE_URL}/bookings/${bookingId}/reports/${groupName}/add`,
                { urls },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooking(response.data.data);
            setSelectedFiles([]);
            toast.success("Files added to group successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add files to group");
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyzeWithAI = async () => {
        try {
            toast.info("Analyzing reports with AI...");
            const response = await axios.post(
                `${BASE_URL}/ai/analyze`,
                { bookingId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("AI analysis completed!");

            const analysis = response.data.analysis;

            // Update both states
            setAiAnalysis(analysis);
            setShowAI(true);

            // Update booking in memory so the button switches
            setBooking((prev) => ({ ...prev, aiAnalysis: analysis }));
        } catch (err) {
            console.error("AI error:", err);
            toast.error("AI analysis failed. Please try again.");
        }
    };


    if (loading) return <Loading />;
    if (error) return <Error errMessage={error} />;
    if (!booking) return <div className="text-center py-8">Booking not found</div>;
    console.log(booking)

    const isPatient = role === 'patient';
    const isDoctor = role === 'doctor';
    const isBookingClosed = booking?.status === 'completed' || booking?.status === 'cancelled';

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all hover:scale-[1.005] hover:shadow-2xl">
                    <div className="p-6 md:p-8 text-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">Appointment Communication</h1>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-blue-100">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span>{booking.timeSlot.day}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>{convertTime(booking.timeSlot.startingTime)} - {convertTime(booking.timeSlot.endingTime)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            booking.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                                            <img
                                                src={booking.doctor.photo}
                                                alt={booking.doctor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium">{booking.doctor.name}</p>
                                            <p className="text-xs text-blue-200">{booking.doctor.specialization}</p>
                                        </div>
                                    </div>
                                </div>

                                {isDoctor && (
                                    <div className="flex space-x-2 mt-3">
                                        {booking.status === 'pending' || booking.status === 'approved' ? (
                                            <>
                                                {/* <button
                                                    onClick={() => handleStatusChange("completed")}
                                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm rounded-lg transition-all transform hover:scale-105 flex items-center shadow-md"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Complete
                                                </button> */}

                                                <button
                                                    onClick={() => handleStatusChange("cancelled")}
                                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm rounded-lg transition-all transform hover:scale-105 flex items-center shadow-md"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${booking.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Health Info */}
                    <div className="space-y-6">
                        {/* Health Issues Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-100">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Health Issues
                                </h2>
                                {healthIssueUpdatedAt && (
                                    <span className="text-xs text-gray-500">
                                        Last updated: {new Date(healthIssueUpdatedAt).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="p-6">
                                {isPatient ? (
                                    <form onSubmit={handleUpdateHealthIssues} className="space-y-4">
                                        {isBookingClosed ? (
                                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                                                <p className="text-gray-600 mb-2">
                                                    This booking is {booking.status}. {booking.status === 'completed' ?
                                                        'If you have any other health issues, please book a new appointment.' :
                                                        'Please book a new appointment if needed.'}
                                                </p>
                                                <textarea
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                                    rows="5"
                                                    value={newHealthIssues}
                                                    readOnly
                                                    placeholder="Booking is closed - no further updates allowed"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <textarea
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                                                    rows="5"
                                                    value={newHealthIssues}
                                                    onChange={(e) => setNewHealthIssues(e.target.value)}
                                                    placeholder="Describe your current health issues..."
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        Update Health Issues
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </form>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="whitespace-pre-line text-gray-700">{booking.currentHealthIssues || "No health issues provided yet."}</p>
                                        {isBookingClosed && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                Booking is {booking.status} - no further updates allowed
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Medical Reports Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-100">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        Medical Reports
                                    </div>
                                    {isPatient && booking.currentReports?.length > 0 && (
                                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                                            {booking.currentReports.length} {booking.currentReports.length === 1 ? 'report' : 'reports'}
                                        </span>
                                    )}
                                </h2>
                            </div>
                            <div className="p-6">
                                {isPatient && !isBookingClosed && (
                                    <div className="mb-6 space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Group Name (e.g., "Blood Report")
                                        </label>
                                        <input
                                            type="text"
                                            value={reportName}
                                            onChange={(e) => setReportName(e.target.value)}
                                            placeholder="Enter report group name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors"
                                        />

                                        <label className="block text-sm font-medium text-gray-700 mt-4">
                                            Upload Files (multiple allowed)
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <label className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                                                    <div className="text-center">
                                                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                        </svg>
                                                        <p className="mt-1 text-sm text-gray-600">
                                                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">Images or PDFs (max 10MB)</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        multiple
                                                        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                                                        className="hidden"
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                        {selectedFiles.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">{selectedFiles.length} file(s) selected</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleGroupedReportUpload}
                                            className="mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full flex items-center justify-center"
                                            disabled={uploading || !reportName || selectedFiles.length === 0}
                                        >
                                            {uploading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                    </svg>
                                                    Upload Reports
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {isPatient && isBookingClosed && (
                                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 mb-6">
                                        <p className="text-gray-600">
                                            This booking is {booking.status}. No further reports can be uploaded.
                                            {booking.status === 'completed' ? ' If you need to share more reports, please book a new appointment.' : ''}
                                        </p>
                                    </div>
                                )}

                                {booking.currentReports?.length > 0 ? (
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                        {booking.currentReports?.map((group, groupIndex) => (
                                            <div key={groupIndex} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="flex justify-between items-center mb-3">
                                                    {editingGroup === group.name ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={newGroupName}
                                                                onChange={(e) => setNewGroupName(e.target.value)}
                                                                className="px-3 py-1.5 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="New group name"
                                                            />
                                                            <button
                                                                onClick={() => handleUpdateGroupName(group.name)}
                                                                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingGroup(null)}
                                                                className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <h4 className="font-semibold text-gray-800">{group.name}</h4>
                                                    )}
                                                    {isPatient && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingGroup(group.name);
                                                                    setNewGroupName(group.name);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800 text-sm p-1 rounded-full hover:bg-blue-50 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveGroup(group.name)}
                                                                className="text-red-600 hover:text-red-800 text-sm p-1 rounded-full hover:bg-red-50 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {group.files.map((url, idx) => (
                                                        <div key={idx} className="relative group">
                                                            {url.endsWith('.pdf') ? (
                                                                <a
                                                                    href={url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="block p-2 border rounded bg-white hover:bg-blue-50 transition-colors"
                                                                >
                                                                    <div className="flex flex-col items-center">
                                                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                                        </svg>
                                                                        <span className="text-xs mt-1 text-gray-600">PDF Document</span>
                                                                    </div>
                                                                </a>
                                                            ) : (
                                                                <div
                                                                    className="cursor-pointer"
                                                                    onClick={() => setExpandedImage(url)}
                                                                >
                                                                    <img
                                                                        src={url}
                                                                        className="w-full h-24 object-cover rounded shadow hover:shadow-md transition-all"
                                                                        alt={`Report ${idx + 1}`}
                                                                    />
                                                                </div>
                                                            )}
                                                            {isPatient && (
                                                                <button
                                                                    onClick={() => handleRemoveImageFromGroup(group.name, url)}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                                                    style={{ width: '20px', height: '20px' }}
                                                                >
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {isPatient && selectedFiles.length > 0 && (
                                                    <div className="mt-3">
                                                        <button
                                                            onClick={() => handleAddToExistingGroup(group.name)}
                                                            className="text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full hover:from-green-600 hover:to-green-700 transition-colors flex items-center shadow-sm"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                            </svg>
                                                            Add selected files to this group
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {isPatient ? "Upload medical reports to share with your doctor" : "Patient hasn't uploaded any reports yet"}
                                        </p>
                                    </div>
                                )}
                                {expandedImage && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                                        onClick={() => setExpandedImage(null)}
                                    >
                                        <div className="max-w-4xl max-h-full">
                                            <img
                                                src={expandedImage}
                                                className="max-w-full max-h-screen object-contain"
                                                alt="Expanded view"
                                            />
                                            <button
                                                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedImage(null);
                                                }}
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {isDoctor && booking.currentReports?.length > 0 && !isBookingClosed && (
                                    <div className="mt-4">
                                        {booking.aiAnalysis ? (
                                            <button
                                                onClick={() => setShowAI(true)}
                                                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                View AI Analysis
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleAnalyzeWithAI}
                                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                                Analyze with AI
                                            </button>
                                        )}

                                        {isDoctor && !isBookingClosed && (
    <div className="mt-4">
        <button
            type="button"
            onClick={() => setShowReferDoctor(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all transform hover:scale-[1.02] w-full flex items-center justify-center"
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Refer to Doctor
        </button>
    </div>
)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Communication */}
                    <div className="space-y-6">
                        {/* Communication Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-100">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                    </svg>
                                    {isPatient ? "Doctor's Responses" : "Communication with Patient"}
                                </h2>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
                                {booking.doctorResponses.length > 0 ? (
                                    <div className="space-y-4">
                                        {booking.doctorResponses.map((response, index) => (
                                            <div key={index} className={`p-4 rounded-lg ${isPatient ? 'bg-blue-50' : 'bg-gray-50'} border border-gray-200`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                                        <img
                                                            src={booking.doctor.photo}
                                                            alt={booking.doctor.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="font-medium text-gray-800">Dr. {booking.doctor.name}</span>
                                                                <span className="text-xs text-gray-500 ml-2">
                                                                    {new Date(response.updatedAt).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            {isDoctor && (
                                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-gray-700 whitespace-pre-line">{response.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            {isPatient ? "No responses yet" : "No messages sent yet"}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {isPatient ? "Your doctor hasn't responded yet" : "Send a message to your patient"}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {isDoctor && (
                                <div className="border-t p-6">
                                    {isBookingClosed ? (
                                        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                                            <p className="text-gray-600 mb-2">
                                                This booking is {booking.status}. No further responses can be sent.
                                            </p>
                                            <textarea
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                                rows="3"
                                                placeholder="Booking is closed - no further responses allowed"
                                                readOnly
                                            />
                                            <button
                                                className="mt-3 bg-gray-400 text-white font-medium py-2.5 px-6 rounded-lg shadow-md w-full flex items-center justify-center cursor-not-allowed"
                                                disabled
                                            >
                                                Send Response (Disabled)
                                            </button>
                                           
                                        </div>
                                    ) : (
                                        <form onSubmit={handleAddResponse} className="space-y-3">
                                            <textarea
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                                                rows="3"
                                                placeholder="Write your response or advice..."
                                                value={newResponse}
                                                onChange={(e) => setNewResponse(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="submit"
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all transform hover:scale-[1.02] w-full flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                                </svg>
                                                Send Response
                                            </button>
                                           
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                        {showAI && <AnalyzeAi booking={booking} aiAnalysis={aiAnalysis} onClose={() => setShowAI(false)} />}
                            {showReferDoctor && (
    <ReferToDoctor
        bookingId={bookingId}
        onClose={() => setShowReferDoctor(false)}
        onReferSuccess={() => {
            // You can add any success logic here if needed
            toast.success("Referral completed successfully!");
        }}
    />
)}
                    </div>
                </div>
            </div>
            {/* Floating Chatbot Button */}
<div className="fixed bottom-6 right-6 z-50">
  {/* Floating Action Button with Animation */}
  <button
    onClick={() => setShowChatBot((prev) => !prev)}
    className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 
               text-white rounded-full shadow-2xl flex items-center justify-center 
               hover:scale-110 transform transition-all duration-300 hover:shadow-3xl
               hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700
               active:scale-95 group animate-pulse-slow"
  >
    {/* Animated Ring Effect */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-ping opacity-20"></div>
    
    {/* Chat Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 transform group-hover:scale-110 transition-transform duration-200"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.755-1.197L3 20l1.532-4.596C3.562 13.768 3 12.434 3 11c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    
    {/* Notification Dot */}
    {!showChatBot && (
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>
    )}
  </button>
</div>

{showChatBot && (
  <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col z-50 
                  animate-slide-up border border-gray-100">
    
    {/* Enhanced Header with Gradient */}
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-6-8h-2V7h2v2zm4 0h-2V7h2v2z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg">AI Assistant</h3>
          <p className="text-xs text-blue-100">Online • Ready to help</p>
        </div>
      </div>
      <button 
        onClick={() => setShowChatBot(false)} 
        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    {/* Enhanced Chat Area */}
    <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
      {/* Welcome Message */}
      <div className="flex items-start space-x-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[80%]">
          <p className="text-gray-700">👋 Hello! I'm your AI assistant. How can I help you today?</p>
          <span className="text-xs text-gray-400 mt-1 block">Just now</span>
        </div>
      </div>

      {/* Sample Quick Questions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button className="bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors duration-200">
          🤔 Explain AI
        </button>
        <button className="bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors duration-200">
          💡 Get ideas
        </button>
        <button className="bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors duration-200">
          📧 Help with email
        </button>
        <button className="bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors duration-200">
          🔧 Technical help
        </button>
      </div>
    </div>

    {/* Enhanced Input Area */}
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {/* Microphone Icon */}
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        </div>
        <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
      
      {/* Footer Text */}
      <p className="text-xs text-center text-gray-400 mt-2">
        AI assistant • Powered by advanced AI
      </p>
    </div>
  </div>
)}

        </div>
    );

    

};

export default GetInTouch;