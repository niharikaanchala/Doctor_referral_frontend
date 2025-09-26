// BookingForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import convertTime from "../utils/convertTime";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import axios from "axios";
import { BASE_URL, token } from "../config";
import { FormatDate } from "../utils/FormatDate";
import { toast } from "react-toastify";
import { useDoctor } from "../context/DoctorContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

const ReportThumbnail = ({ url, onRemove, index }) => {
    const handleRemoveClick = (e) => {
        e.preventDefault();
        onRemove();
    };

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Thumbnail Container */}
            <div className="relative h-24 w-full border rounded-md overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                {url.endsWith(".pdf") ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="h-full flex flex-col items-center justify-center p-2 text-blue-600 hover:text-blue-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs truncate w-full text-center">PDF Document</span>
                    </a>
                ) : (
                    <>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                            title="View full size"
                        >
                            <div className="bg-white/90 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </a>
                    </>
                )}
            </div>

            {/* Remove Button - Outside the thumbnail */}
            <button
                type="button"
                onClick={handleRemoveClick}
                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Remove file"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
            </button>
        </div>
    );
};
const BookingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { doctor, loading: doctorLoading, error: doctorError, fetchDoctor } = useDoctor();
    const [formLoading, setFormLoading] = useState(false);
    // const [selectedDay, setSelectedDay] = useState("");
    const [blockedSlotMap, setBlockedSlotMap] = useState({});

    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [healthIssues, setHealthIssues] = useState("");
    const [reports, setReports] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [reportName, setReportName] = useState("");
    const [selectedGroupFiles, setSelectedGroupFiles] = useState([]);
    const [groupedReports, setGroupedReports] = useState([]);
    const [uploadingGroup, setUploadingGroup] = useState(false);
    const [uploadingReports, setUploadingReports] = useState(false);
    const [filteredSlots, setFilteredSlots] = useState([]);

    const [groupFiles, setGroupFiles] = useState({
        blood: [],
        xray: [],
        other: []
    });

    const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
    const [activeGroup, setActiveGroup] = useState(null);
    const [activeGroupName, setActiveGroupName] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const allowedDays = [...new Set(doctor?.timeSlots?.map(slot => slot.day.toLowerCase()))];


    const selectedDay = selectedDate
        ? selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
        : null;

    const getDayIndex = (dayName) => {
        return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
            .indexOf(dayName.toLowerCase());
    };

    const allowedWeekdayIndices = allowedDays.map(getDayIndex);
    const fetchAvailableSlots = async (date) => {
        try {
            setLoadingTimeSlots(true);
            const formattedDate = date.toLocaleDateString("en-US");

            const res = await axios.post(
                `${BASE_URL}/doctors/${id}/available-slots`,
                { date: formattedDate },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            let allSlots = res.data.availableSlots || [];

            // Remove already booked slots
            const bookedSlotsForDate = blockedSlotMap[formattedDate];
            if (Array.isArray(bookedSlotsForDate)) {
                allSlots = allSlots.filter(slot => {
                    const slotKey = `${slot.startingTime}-${slot.endingTime}`;
                    return !bookedSlotsForDate.includes(slotKey);
                });
            }

            setFilteredSlots(allSlots);
        } catch (err) {
            console.error("Error fetching available slots:", err);
            setFilteredSlots([]);
        } finally {
            setLoadingTimeSlots(false);
        }
    };


    useEffect(() => {
        const fetchBlockedSlots = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/doctors/${id}/blocked-dates-with-slots`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.data.success && res.data.blocked) {
                    setBlockedSlotMap(res.data.blocked);
                }
            } catch (err) {
                console.error("Failed to fetch blocked date/slots", err);
            }
        };

        if (doctor) fetchBlockedSlots();
    }, [doctor]);



    const isAllowedDay = (date) => {
        const weekday = date.getDay(); // 0 for Sunday ... 6 for Saturday
        const allowedIndices = allowedDays.map(getDayIndex);
        return allowedIndices.includes(weekday);
    };
    const [bookedDates, setBookedDates] = useState([]);

    // useEffect(() => {
    //     const fetchBlockedDates = async () => {
    //         try {
    //             const res = await axios.get(`${BASE_URL}/doctors/${id}/blocked-dates`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    //             setBookedDates(res.data.blockedDates.map(date => new Date(date)));
    //         } catch (err) {
    //             console.error("Failed to fetch blocked dates", err);
    //         }
    //     };

    //     if (doctor) fetchBlockedDates();
    // }, [doctor]);

    useEffect(() => {
        if (id) {
            fetchDoctor(id);
        }
    }, [id]);

    useEffect(() => {
        if (selectedDate && doctor) {
            fetchAvailableSlots(selectedDate);
            setSelectedTimeSlot(""); // reset selected time
        }
    }, [selectedDate]);

    const isAllowedDate = (date) => {
        const weekday = date.getDay();
        const dateStr = date.toISOString().split("T")[0];
        const isAllowedWeekday = allowedWeekdayIndices.includes(weekday);
        const isFullyBooked = blockedSlotMap[dateStr] === "fully booked";

        return isAllowedWeekday && !isFullyBooked;
    };

    const handleGroupFileSelect = (group, files) => {
        setGroupFiles(prev => ({
            ...prev,
            [group]: files
        }));
    };

    const handleGroupedReportUpload = async (groupName) => {
        const files = groupFiles[activeGroup];
        if (!files || files.length === 0) {
            toast.error("Please select files to upload");
            return;
        }

        try {
            setUploadingGroup(true);
            const uploadPromises = files.map(file => uploadImageToCloudinary(file));
            const uploadedResults = await Promise.all(uploadPromises);
            const urls = uploadedResults.map(res => res.url);

            setGroupedReports(prev => {
                const index = prev.findIndex(g => g.name.toLowerCase() === groupName.toLowerCase());
                const updatedGroups = [...prev];

                if (index !== -1) {
                    const existingUrls = new Set(updatedGroups[index].files);
                    const uniqueNewUrls = urls.filter(url => !existingUrls.has(url));
                    updatedGroups[index].files = [...updatedGroups[index].files, ...uniqueNewUrls];
                } else {
                    updatedGroups.push({ name: groupName, files: urls });
                }

                return updatedGroups;
            });

            // Clear the specific group's files after upload
            setGroupFiles(prev => ({ ...prev, [activeGroup]: [] }));
            toast.success("Files uploaded successfully");
        } catch (err) {
            toast.error("Upload failed");
            console.error(err);
        } finally {
            setUploadingGroup(false);
        }
    };

    const handleEditGroupName = (groupIndex, newName) => {
        setGroupedReports(prev =>
            prev.map((group, i) =>
                i === groupIndex ? { ...group, name: newName } : group
            )
        );
    };
    // console.log(selectedDate.toISOString().split("T")[0])
    const handleRemoveGroup = (indexToRemove) => {
        setGroupedReports(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleRemoveFile = (groupIndex, fileIndex) => {
        setGroupedReports(prev =>
            prev.map((group, i) => {
                if (i === groupIndex) {
                    const newFiles = group.files.filter((_, j) => j !== fileIndex);
                    return { ...group, files: newFiles };
                }
                return group;
            }).filter(group => group.files.length > 0)
        );
    };

    const handleRemoveReport = (index) => {
        const updatedReports = [...reports];
        updatedReports.splice(index, 1);
        setReports(updatedReports);
    };
    const dayOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const sortedDays = [...allowedDays].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    // console.log(groupedReports)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const matchedSlot = availableTimeSlots.find(slot => slot.value === selectedTimeSlot);

        if (!matchedSlot) {
            toast.error("Invalid time slot selected");
            return;
        }

        try {
            // const timeSlot = doctor.timeSlots.find(
            //     slot => slot.day === selectedDay &&
            //         `${convertTime(slot.startingTime)} - ${convertTime(slot.endingTime)}` === selectedTimeSlot
            // );

            // if (!timeSlot) {
            //     toast.error("Selected time slot not found");
            //     setFormLoading(false);
            //     return;
            // }

            // if (!timeSlot.isAvailable) {
            //     toast.error("This time slot is no longer available");
            //     setFormLoading(false);
            //     return;
            // }
            console.log(selectedDate.toLocaleDateString('en-CA'))

            const response = await axios.post(
                `${BASE_URL}/bookings/checkout-success/${id}`,
                {
                    appointmentDate: selectedDate.toLocaleDateString('en-CA'),

                    timeSlot: {
                        day: selectedDay,
                        startingTime: matchedSlot.raw.startingTime,
                        endingTime: matchedSlot.raw.endingTime
                    },
                    healthIssues,
                    groupedReports,
                    reports: groupedReports.flatMap(group => group.files),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = response.data;

            if (data.session.url) {
                window.location.href = data.session.url;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
            setFormLoading(false);
        }
    };

    const availableDays = [...new Set((doctor?.timeSlots || [])
        .filter(slot => slot.isAvailable)
        .map(slot => slot.day))];
    const availableTimeSlots = filteredSlots.map(slot => {
        const formatted = `${convertTime(slot.startingTime)} - ${convertTime(slot.endingTime)}`;
        return {
            value: formatted,
            label: formatted,
            raw: slot
        };
    });

    const bloodInputRef = useRef();
    const xrayInputRef = useRef();

    if (doctorLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-lg text-gray-700">Loading doctor information...</p>
                </div>
            </div>
        );
    }

    if (doctorError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center py-8 bg-red-50 p-6 rounded-lg max-w-md mx-auto">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Doctor</h3>
                    <p className="text-gray-600">{doctorError}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center py-8 bg-yellow-50 p-6 rounded-lg max-w-md mx-auto">
                    <div className="text-yellow-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Doctor Not Found</h3>
                    <p className="text-gray-600">The doctor you're looking for doesn't exist or may have been removed.</p>
                    <button
                        onClick={() => navigate('/doctors')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse Doctors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Book Your Appointment
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        With {doctor.name}, {doctor.specialization}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Doctor Info Section */}
                    <div className="lg:w-1/2 bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <img
                                        src={doctor.photo}
                                        alt={doctor.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
                                    />
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        {doctor.specialization}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">
                                        {doctor.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center">
                                            ⭐ {Math.round(doctor.averageRating, 2)} Rating
                                        </span>
                                        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center">
                                            👥 {doctor.totalRating} Reviews
                                        </span>
                                    </div>
                                    <div className="mt-3 text-sm text-white/90">
                                        <p>💰 Consultation Fee: ${doctor.ticketPrice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    About
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {doctor.about || "No about information available"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Experience
                                </h3>
                                {doctor.experiences && doctor.experiences.length > 0 ? (
                                    <ul className="space-y-4">
                                        {doctor.experiences.map((exp, index) => (
                                            <li key={index} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
                                                <span className="text-blue-600 text-sm font-semibold">
                                                    {FormatDate(exp.startingDate)} - {FormatDate(exp.endingDate)}
                                                </span>
                                                <p className="text-lg font-medium text-gray-800">
                                                    {exp.position}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {exp.hospital}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">No experience information available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Booking Form Section */}
                    <div className="lg:w-1/2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Book Appointment
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">

                            <div className="mb-6">
                                {allowedDays.length > 0 && (() => {
                                    const dayOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                                    const indices = allowedDays.map(day => dayOrder.indexOf(day.toLowerCase())).sort((a, b) => a - b);

                                    const areConsecutive = indices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);

                                    const capitalized = day => day.charAt(0).toUpperCase() + day.slice(1);

                                    if (areConsecutive && indices.length >= 2) {
                                        const from = capitalized(dayOrder[indices[0]]);
                                        const to = capitalized(dayOrder[indices[indices.length - 1]]);
                                        return (
                                            <p className="mb-2 text-sm text-gray-600 italic">
                                                You can book an appointment with the doctor from <span className="font-semibold text-blue-600">{from} to {to}</span>.
                                            </p>
                                        );
                                    } else {
                                        const days = indices.map(i => capitalized(dayOrder[i])).join(", ");
                                        return (
                                            <p className="mb-2 text-sm text-gray-600 italic">
                                                You can book an appointment with the doctor on <span className="font-semibold text-blue-600">{days}</span>.
                                            </p>
                                        );
                                    }
                                })()}

                                <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Appointment Date
                                </label>

                                <div className="relative">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => {
                                            setSelectedDate(date);
                                            setSelectedTimeSlot("");
                                        }}
                                        filterDate={isAllowedDate}
                                        minDate={new Date()}
                                        placeholderText="Select appointment date"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                        dateFormat="MMMM d, yyyy"
                                        calendarClassName="border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                                        dayClassName={(date) =>
                                            isAllowedDate(date)
                                                ? "hover:bg-blue-50 transition-colors"
                                                : "text-gray-400 cursor-not-allowed"
                                        }
                                        popperClassName="shadow-xl"
                                        popperPlacement="bottom-start"
                                        popperModifiers={[
                                            {
                                                name: "offset",
                                                options: {
                                                    offset: [0, 10],
                                                },
                                            },
                                        ]}
                                        required
                                    />

                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>

                                {selectedDate && (
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>
                                            Selected: <span className="font-medium text-blue-600">
                                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Day selection
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-semibold mb-3  items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Select Day
                                </label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjM1NzBmZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select a day</option>
                                    {availableDays.map((day, index) => (
                                        <option key={index} value={day}>
                                            {day.charAt(0).toUpperCase() + day.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div> */}

                            {selectedDate && (
                                <>
                                    <div className="mb-8">
                                        <label className="block text-gray-700 text-sm font-semibold mb-4">Select Time Slot</label>

                                        {loadingTimeSlots ? (
                                            // Loading state while fetching slots
                                            <div className="flex flex-col items-center justify-center py-6 space-y-2">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                                <span className="text-gray-600">Checking available time slots...</span>
                                            </div>
                                        ) : filteredSlots.length > 0 ? (
                                            // Available slots
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {availableTimeSlots.map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        className={`px-4 py-3 rounded-xl border-2 transition-colors ${selectedTimeSlot === slot.value
                                                            ? 'border-blue-500 bg-blue-50 font-semibold text-blue-700'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                            }`}
                                                        onClick={() => setSelectedTimeSlot(slot.value)}
                                                    >
                                                        {slot.label}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            // No slots available
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-yellow-500 inline-block mb-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                <p className="text-yellow-700">
                                                    All time slots are booked for this date. Please try another date.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}



                            {/* Health issues */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-semibold mb-3 items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Health Issues
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                    rows="4"
                                    placeholder="Describe your health issues in detail..."
                                    value={healthIssues}
                                    onChange={(e) => setHealthIssues(e.target.value)}
                                />
                            </div>

                            {/* Reports upload */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Upload Medical Reports
                                </h3>


                                {/* Predefined report groups - Upload Only Sections */}
                                <div className="space-y-6">

                                    {/* Blood Test Reports */}
                                    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                                Blood Test Reports
                                            </h4>
                                        </div>

                                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files</label>
                                                <div className="flex items-center gap-3">
                                                    <label className="flex-1 cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*,application/pdf"
                                                            multiple
                                                            onChange={(e) => {
                                                                setActiveGroup('blood');
                                                                handleGroupFileSelect('blood', Array.from(e.target.files));
                                                            }}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                        />
                                                    </label>
                                                    <button
                                                        onClick={() => handleGroupedReportUpload('Blood Test Reports')}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                                                        disabled={uploadingGroup || groupFiles.blood.length === 0}
                                                        type="button"
                                                    >
                                                        {uploadingGroup && activeGroup === 'blood' ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Uploading...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                                Upload
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* X-Ray Scans */}
                                    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                                X-Ray Scans
                                            </h4>
                                        </div>

                                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files</label>
                                                <div className="flex items-center gap-3">
                                                    <label className="flex-1 cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*,application/pdf"
                                                            multiple
                                                            onChange={(e) => {
                                                                setActiveGroup('xray');
                                                                handleGroupFileSelect('xray', Array.from(e.target.files));
                                                            }}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                        />
                                                    </label>
                                                    <button
                                                        onClick={() => handleGroupedReportUpload('X-Ray Scans')}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                                                        disabled={uploadingGroup || groupFiles.xray.length === 0}
                                                        type="button"
                                                    >
                                                        {uploadingGroup && activeGroup === 'xray' ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Uploading...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                                Upload
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* All Reports Display Section */}
                                    {groupedReports.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Uploaded Reports</h3>
                                            {groupedReports.map((group, i) => (
                                                <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="font-semibold text-blue-600">{group.name}</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveGroup(i)}
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                            title="Remove group"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {group.files.map((url, j) => (
                                                            <ReportThumbnail
                                                                key={j}
                                                                url={url}
                                                                onRemove={() => handleRemoveFile(i, j)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add More Reports Button */}
                                    {/* <div className="text-center">
                                        <button
                                            onClick={() => {
                                                setActiveGroupName('new-group');
                                                setActiveGroup('other');
                                                setGroupFiles(prev => ({ ...prev, other: [] }));
                                            }}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Click here to add other reports
                                        </button>
                                    </div> */}
                                </div>


                                {/* New Group Form (shown when activeGroupName is set) */}
                                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-blue-600 flex items-center gap-2">

                                            Other reports
                                        </h4>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Group Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., MRI Scans, Ultrasound Reports"
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={reportName}
                                            onChange={(e) => setReportName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files</label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex-1 cursor-pointer">
                                                <span className="sr-only">Choose files</span>
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    multiple
                                                    onChange={(e) => {
                                                        setActiveGroup('other');
                                                        handleGroupFileSelect('other', Array.from(e.target.files));
                                                    }}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </label>
                                            <button
                                                onClick={() => {
                                                    if (!reportName) {
                                                        toast.error("Please enter a group name");
                                                        return;
                                                    }
                                                    handleGroupedReportUpload(reportName);
                                                }}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                                                disabled={uploadingGroup || groupFiles.other.length === 0}
                                                type="button"
                                            >
                                                {uploadingGroup && activeGroup === 'other' ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        Upload
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {groupFiles.other.length > 0 && (
                                            <span className="text-xs text-gray-500 mt-1 block">
                                                {groupFiles.other.length} file(s) selected for "{reportName || 'new group'}"
                                            </span>
                                        )}
                                    </div>


                                </div>

                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 font-semibold text-lg"
                                disabled={formLoading || doctorLoading}
                            >
                                {formLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Your Booking...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Confirm Appointment
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;