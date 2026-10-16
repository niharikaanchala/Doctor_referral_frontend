
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import { toast } from "react-hot-toast"
import { BASE_URL, token } from "../config";
import axios from "axios";
import { authContext } from "../context/authContext";
import Loading from "../components/loader/Loading";
import Error from "../components/Error/Error";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { useContext } from "react";
import AnalyzeAi from "./AnalyzeAi";
import ReferToDoctor from "./doctor-account/ReferToDoctor";
import { VisitHistoryList, VisitTimelineRow } from "./doctor-account/VisitHistory";

function resolveAiStatus(booking) {
    if (!booking) return "idle";
    if (booking.aiStatus === "processing" || booking.aiStatus === "failed" || booking.aiStatus === "ready") {
        return booking.aiStatus;
    }
    return booking.aiAnalysis ? "ready" : "idle";
}

const DOSAGE_PRESETS = [
    { label: "1-0-0", title: "Morning" },
    { label: "0-0-1", title: "Night" },
    { label: "1-0-1", title: "Morning and night" },
    { label: "1-1-1", title: "Morning, afternoon, and night" },
];
const DURATION_PRESETS = ["5 days", "7 days", "14 days", "1 month"];
const FREQUENCY_PRESETS = [
    { label: "OD", value: "Once daily" },
    { label: "BD", value: "Twice daily" },
    { label: "TDS", value: "Thrice daily" },
    { label: "HS", value: "At bedtime" },
    { label: "SOS", value: "If needed" },
];

const GetInTouch = () => {
    const { id: bookingId } = useParams();
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
    const showAIRef = useRef(false);
    const analysisRequestRef = useRef(false);
    const analysisWatchRef = useRef(0);
    const aiStatusRef = useRef("");
    const announcedAiRef = useRef("");
    const chatScrollRef = useRef(null);
    showAIRef.current = showAI;
    aiStatusRef.current = booking?.aiStatus || "";
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [showReferDoctor, setShowReferDoctor] = useState(false);
    const emptyMedicine = { name: "", dosage: "", frequency: "", duration: "" };
    const [prescriptionDiagnosis, setPrescriptionDiagnosis] = useState("");
    const [prescriptionNotes, setPrescriptionNotes] = useState("");
    const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
    const [savingPrescription, setSavingPrescription] = useState(false);
    const [composerOpen, setComposerOpen] = useState(false);
    const [editingPrescriptionId, setEditingPrescriptionId] = useState(null);
    const [editingNote, setEditingNote] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showAllReports, setShowAllReports] = useState(false);
    const [reportDrafts, setReportDrafts] = useState([{ name: "", files: [] }]);
    const [priorVisits, setPriorVisits] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [panelTab, setPanelTab] = useState("conversation");

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
                setComposerOpen(false);
                setEditingPrescriptionId(null);
                setPrescriptionDiagnosis("");
                setPrescriptionNotes("");
                setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
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
    }, [booking?._id, booking?.unreadDoctorResponses, booking?.unreadPatientUpdates, bookingId, role]);

    useEffect(() => {
        const patientId = booking?.user?._id;
        if (role !== "doctor" || !patientId) return;

        let cancelled = false;
        const loadHistory = async () => {
            try {
                setHistoryLoading(true);
                setHistoryError("");
                const response = await axios.get(
                    `${BASE_URL}/bookings/patient/${patientId}/history`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        params: { exclude: bookingId },
                    }
                );
                if (!cancelled) setPriorVisits(response.data?.data || []);
            } catch (err) {
                console.error("Error loading visit history:", err);
                if (!cancelled) {
                    setPriorVisits([]);
                    setHistoryError("Earlier visits could not be loaded.");
                }
            } finally {
                if (!cancelled) setHistoryLoading(false);
            }
        };

        loadHistory();
        return () => {
            cancelled = true;
        };
    }, [booking?.user?._id, bookingId, role]);

    useEffect(() => {
        if (role !== "doctor" || booking?.aiStatus !== "processing" || !bookingId) return undefined;
        let cancelled = false;

        const refresh = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/ai/status/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (cancelled) return;
                const next = response.data;
                if (!next?.status) return;
                if (analysisWatchRef.current === 1) {
                    if (next.status !== "processing") return;
                    analysisWatchRef.current = 2;
                }

                setBooking((prev) => prev ? ({
                    ...prev,
                    aiStatus: next.status,
                    aiStartedAt: next.startedAt,
                    aiError: next.error || "",
                    ...(next.analysis ? { aiAnalysis: next.analysis } : {}),
                }) : prev);
                if (next.analysis) setAiAnalysis(next.analysis);
                if (next.status === "ready" || next.status === "failed") analysisWatchRef.current = 0;
                announceAiChange(next.status, next.error, next.startedAt);
            } catch (err) {
                console.error("Error checking AI analysis:", err);
            }
        };

        refresh();
        const timer = setInterval(refresh, 3000);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [booking?.aiStatus, bookingId, role]);

    const announceAiChange = (nextStatus, nextError, nextStartedAt) => {
        if (role !== "doctor" || aiStatusRef.current !== "processing") return;
        const key = `${nextStatus}:${nextStartedAt || ""}`;
        if (announcedAiRef.current === key || showAIRef.current) return;
        announcedAiRef.current = key;
        if (nextStatus === "ready") toast.success("AI analysis is ready");
        if (nextStatus === "failed") toast.error(nextError || "AI analysis failed. Please try again.");
    };

    useEffect(() => {
        if (!bookingId) return undefined;
        let cancelled = false;

        const refreshVisit = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (cancelled) return;
                const next = response.data?.data;
                if (!next) return;

                const nextStatus = resolveAiStatus(next);
                const keepLocalAi = role === "doctor" && analysisWatchRef.current === 1 && nextStatus !== "processing";
                if (role === "doctor" && !keepLocalAi) announceAiChange(nextStatus, next.aiError, next.aiStartedAt);
                if (role === "doctor" && analysisWatchRef.current === 1 && nextStatus === "processing") analysisWatchRef.current = 2;
                if (role === "doctor" && (nextStatus === "ready" || nextStatus === "failed")) analysisWatchRef.current = 0;

                setBooking((prev) => {
                    if (!prev) return next;
                    return {
                        ...prev,
                        currentHealthIssues: next.currentHealthIssues,
                        healthIssuesHistory: next.healthIssuesHistory,
                        currentReports: next.currentReports,
                        reportsHistory: next.reportsHistory,
                        doctorResponses: next.doctorResponses,
                        patientMessages: next.patientMessages,
                        prescriptions: next.prescriptions,
                        unreadDoctorResponses: next.unreadDoctorResponses,
                        unreadPatientUpdates: next.unreadPatientUpdates,
                        status: next.status,
                        ...(keepLocalAi ? {} : {
                            aiAnalysis: next.aiAnalysis,
                            aiStatus: next.aiStatus,
                            aiStartedAt: next.aiStartedAt,
                            aiError: next.aiError || "",
                        }),
                    };
                });
                if (role === "doctor" && !keepLocalAi && nextStatus === "ready" && next.aiAnalysis) setAiAnalysis(next.aiAnalysis);
            } catch (err) {
                console.error("Error refreshing the visit:", err);
            }
        };

        const timer = setInterval(refreshVisit, 4000);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [role, bookingId]);

    useEffect(() => {
        const node = chatScrollRef.current;
        if (!node || panelTab !== "conversation") return;
        node.scrollTop = node.scrollHeight;
    }, [
        booking?.doctorResponses?.length,
        booking?.patientMessages?.length,
        booking?.healthIssuesHistory?.length,
        panelTab,
    ]);

    const reusePrescription = (visit) => {
        const prescription = (visit?.prescriptions || []).find(
            (item) => item?.diagnosis || item?.medicines?.length
        );
        if (!prescription) {
            toast.error("That visit has no prescription to copy");
            return;
        }
        const nextMedicines = (prescription.medicines || [])
            .filter((medicine) => medicine?.name)
            .map((medicine) => ({
                name: medicine.name || "",
                dosage: medicine.dosage || "",
                frequency: medicine.frequency || "",
                duration: medicine.duration || "",
            }));
        setEditingPrescriptionId(null);
        setMedicines(nextMedicines.length ? nextMedicines : [{ name: "", dosage: "", frequency: "", duration: "" }]);
        setPrescriptionDiagnosis(prescription.diagnosis || "");
        setPrescriptionNotes(prescription.notes || "");
        setComposerOpen(true);
        setShowHistory(false);
        setPanelTab("prescription");
        toast.success("Previous prescription copied. Review it before saving.");
    };

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
        const ready = reportDrafts.filter((draft) => draft.name.trim() && draft.files.length > 0);
        if (ready.length === 0) {
            toast.error("Add a report type and at least one file for each report");
            return;
        }

        try {
            setUploading(true);
            let latestBooking = null;
            for (const draft of ready) {
                const uploadedResults = await Promise.all(draft.files.map((file) => uploadImageToCloudinary(file)));
                const urls = uploadedResults.map((res) => res.url);
                const res = await axios.post(
                    `${BASE_URL}/bookings/${bookingId}/reports/save`,
                    { name: draft.name.trim(), urls },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                latestBooking = res.data.data;
            }

            if (latestBooking) setBooking(latestBooking);
            setReportDrafts([{ name: "", files: [] }]);
            setReportName("");
            setSelectedFiles([]);
            setShowUpload(false);
            toast.success(ready.length > 1 ? "Reports uploaded & saved" : "Report uploaded & saved");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload reports");
            console.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateHealthIssues = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${BASE_URL}/bookings/${bookingId}/health-issues`,
                { healthIssues: newHealthIssues },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedAt = new Date().toISOString();
            setHealthIssueUpdatedAt(updatedAt);
            setBooking((prev) => ({
                ...prev,
                currentHealthIssues: newHealthIssues,
                healthIssuesHistory: [
                    ...(prev?.healthIssuesHistory || []),
                    { text: newHealthIssues, updatedAt },
                ],
            }));
            setEditingNote(false);
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
                `${BASE_URL}/bookings/${bookingId}/reports/${encodeURIComponent(groupName)}/remove-file`,
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
        const text = newResponse.trim();
        if (!text) return;
        const sendingAsPatient = role === "patient";
        try {
            await axios.post(
                `${BASE_URL}/bookings/${bookingId}/${sendingAsPatient ? "patient-message" : "doctor-response"}`,
                { response: text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooking(response.data.data);

            toast.success(sendingAsPatient ? "Message sent" : "Response added successfully");
            setNewResponse("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error sending message");
        }
    };

    const updateMedicine = (index, field, value) => {
        setMedicines((prev) =>
            prev.map((medicine, i) => (i === index ? { ...medicine, [field]: value } : medicine))
        );
    };

    const blankMedicine = () => ({ name: "", dosage: "", frequency: "", duration: "" });

    const clearPrescriptionDraft = () => {
        setPrescriptionDiagnosis("");
        setPrescriptionNotes("");
        setMedicines([blankMedicine()]);
        setEditingPrescriptionId(null);
        setComposerOpen(false);
    };

    const openNewPrescription = () => {
        setEditingPrescriptionId(null);
        setPrescriptionDiagnosis("");
        setPrescriptionNotes("");
        setMedicines([blankMedicine()]);
        setComposerOpen(true);
    };

    const openEditPrescription = (prescription) => {
        const nextMedicines = (prescription.medicines || [])
            .filter((medicine) => medicine?.name)
            .map((medicine) => ({
                name: medicine.name || "",
                dosage: medicine.dosage || "",
                frequency: medicine.frequency || "",
                duration: medicine.duration || "",
            }));
        setEditingPrescriptionId(prescription._id);
        setPrescriptionDiagnosis(prescription.diagnosis || "");
        setPrescriptionNotes(prescription.notes || "");
        setMedicines(nextMedicines.length ? nextMedicines : [blankMedicine()]);
        setComposerOpen(false);
    };

    const handleAddPrescription = async (e) => {
        e.preventDefault();
        const cleanedMedicines = medicines.filter((medicine) => medicine.name.trim());
        if (!prescriptionDiagnosis.trim() && cleanedMedicines.length === 0) {
            toast.error("Add a diagnosis or at least one medicine");
            return;
        }

        const editing = Boolean(editingPrescriptionId);
        try {
            setSavingPrescription(true);
            const payload = {
                diagnosis: prescriptionDiagnosis,
                medicines: cleanedMedicines,
                notes: prescriptionNotes,
            };
            const url = editing
                ? `${BASE_URL}/bookings/${bookingId}/prescription/${editingPrescriptionId}`
                : `${BASE_URL}/bookings/${bookingId}/prescription`;
            await axios[editing ? "put" : "post"](url, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooking(response.data.data);
            clearPrescriptionDraft();
            toast.success(editing ? "Prescription updated" : "Prescription added");
        } catch (err) {
            toast.error(err.response?.data?.message || (editing ? "Error updating prescription" : "Error adding prescription"));
        } finally {
            setSavingPrescription(false);
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

    const handleAddToExistingGroup = async (groupName, files = selectedFiles) => {
        const list = Array.from(files || []);
        if (list.length === 0) {
            toast.error("Please select files to upload");
            return;
        }
        try {
            setUploading(true);
            const uploadPromises = list.map(file => uploadImageToCloudinary(file));
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
        if (role !== "doctor") return;
        const started = booking?.aiStartedAt ? new Date(booking.aiStartedAt).getTime() : 0;
        const stale = resolveAiStatus(booking) === "processing" && started && Date.now() - started > 4 * 60 * 1000;
        if ((analysisRequestRef.current || resolveAiStatus(booking) === "processing") && !stale) {
            setShowAI(true);
            return;
        }

        analysisRequestRef.current = true;
        analysisWatchRef.current = 1;
        setShowAI(true);
        setBooking((prev) => ({
            ...prev,
            aiStatus: "processing",
            aiError: "",
            aiStartedAt: new Date().toISOString(),
        }));

        try {
            await axios.post(
                `${BASE_URL}/ai/analyze`,
                { bookingId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("AI error:", err);
            setBooking((prev) => ({
                ...prev,
                aiStatus: "failed",
                aiError: "Analysis didn't finish. You can try again.",
            }));
            toast.error("AI analysis failed. Please try again.");
        } finally {
            analysisRequestRef.current = false;
        }
    };


    if (loading) return <Loading />;
    if (error) return <Error errMessage={error} />;
    if (!booking) return <div className="text-center py-8">Booking not found</div>;

    const isPatient = role === "patient";
    const isDoctor = role === "doctor";
    const aiStatus = resolveAiStatus(booking);
    const aiButtonLabel = {
        processing: "Analyzing reports…",
        ready: "View AI Analysis",
        failed: "Try analysis again",
        idle: "Analyze with AI",
    }[aiStatus];
    const isBookingClosed = booking?.status === "completed" || booking?.status === "cancelled";
    const patient = booking.user || {};
    const doctor = booking.doctor || {};
    const weekdayLabel = booking.timeSlot?.day
        ? booking.timeSlot.day.charAt(0).toUpperCase() + booking.timeSlot.day.slice(1)
        : booking.appointmentDate
            ? new Date(booking.appointmentDate).toLocaleDateString("en-US", { weekday: "long" })
            : "";
    const headerStatus = {
        pending: "Pending",
        approved: "Approved",
        completed: "Completed",
        cancelled: "Cancelled",
    }[booking.status] || booking.status;

    const formatClock = (time) => {
        if (!time || !String(time).includes(":")) return time || "";
        const [rawH, rawM] = String(time).split(":");
        let hours = parseInt(rawH, 10);
        const minutes = (rawM || "00").slice(0, 2).padStart(2, "0");
        if (Number.isNaN(hours)) return time;
        const meridian = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${meridian}`;
    };

    const bubbleTime = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    };

    const canCancelAppointment = isDoctor && (booking.status === "pending" || booking.status === "approved");
    const headerTime = booking.timeSlot?.startingTime
        ? `${formatClock(booking.timeSlot.startingTime)} - ${formatClock(booking.timeSlot.endingTime)}`
        : "";

    const symptomHistory = booking.healthIssuesHistory?.length
        ? booking.healthIssuesHistory
        : booking.currentHealthIssues
            ? [{ text: booking.currentHealthIssues, updatedAt: healthIssueUpdatedAt }]
            : [];

    const thread = [
        ...symptomHistory.map((item, index) => ({
            key: `patient-${index}`,
            side: "patient",
            text: item.text,
            at: item.updatedAt,
        })),
        ...(booking.patientMessages || []).map((item, index) => ({
            key: `patient-msg-${index}`,
            side: "patient",
            text: item.text,
            at: item.updatedAt,
        })),
        ...(booking.doctorResponses || []).map((item, index) => ({
            key: `doctor-${index}`,
            side: "doctor",
            text: item.text,
            at: item.updatedAt,
        })),
    ]
        .filter((item) => item.text)
        .sort((a, b) => new Date(a.at || 0) - new Date(b.at || 0));

    const threadLabel = thread.length
        ? new Date(thread[thread.length - 1].at).toDateString() === new Date().toDateString()
            ? "Today"
            : new Date(thread[0].at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : null;

    const isPdf = (url) => typeof url === "string" && url.toLowerCase().split("?")[0].endsWith(".pdf");
    const openFile = (url) => {
        if (!url) return;
        if (isPdf(url)) window.open(url, "_blank", "noreferrer");
        else setExpandedImage(url);
    };

    const reportCards = (booking.currentReports || []).flatMap((group, groupIndex) =>
        (group.files || []).map((url, fileIndex) => ({
            key: `${groupIndex}-${fileIndex}`,
            groupName: group.name,
            url,
            fileCount: group.files.length,
        }))
    );
    const visibleReports = [...reportCards].reverse().slice(0, 4);
    const prescriptions = booking.prescriptions || [];
    const editingPrescription = Boolean(editingPrescriptionId);
    const showNewComposer = isDoctor && !isBookingClosed && !editingPrescription && (composerOpen || prescriptions.length === 0);
    const formatRxStamp = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
        });
    };
    const presetChip = (active) =>
        `px-2 py-1 rounded-full text-[11px] font-semibold border transition ${active ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700"}`;
    const fieldClass = "w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

    const prescriptionComposer = (
        <form onSubmit={handleAddPrescription} className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 shrink-0 rounded-2xl bg-emerald-600 text-white shadow-sm flex items-center justify-center font-serif text-lg italic">Rx</div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                            {editingPrescription ? "Revise this prescription" : prescriptions.length ? "Write another prescription" : "Write a prescription"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {editingPrescription
                                ? "Changes replace this prescription on the visit."
                                : "Saved on this visit for the patient to follow."}
                        </p>
                    </div>
                </div>
                {(editingPrescription || prescriptions.length > 0) && (
                    <button
                        type="button"
                        onClick={clearPrescriptionDraft}
                        className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-slate-500 hover:bg-white hover:text-slate-800"
                    >
                        Cancel
                    </button>
                )}
            </div>
            <div className="space-y-4 px-4 py-4">
                <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Diagnosis</label>
                    <textarea rows="2" value={prescriptionDiagnosis} onChange={(e) => setPrescriptionDiagnosis(e.target.value)} placeholder="Clinical diagnosis" className={`${fieldClass} resize-none`} />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Medicines</label>
                        <button
                            type="button"
                            onClick={() => setMedicines((prev) => [...prev, blankMedicine()])}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                            + Add medicine
                        </button>
                    </div>
                    <div className="space-y-3">
                        {medicines.map((medicine, index) => (
                            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="h-6 w-6 rounded-lg bg-emerald-600 text-white text-xs font-bold inline-flex items-center justify-center">{index + 1}</span>
                                        <span className="text-xs font-semibold text-slate-500">Medicine</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (medicines.length === 1) setMedicines([blankMedicine()]);
                                            else setMedicines((prev) => prev.filter((_, i) => i !== index));
                                        }}
                                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-white hover:text-red-600"
                                        aria-label="Remove medicine"
                                    >
                                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <input type="text" value={medicine.name} onChange={(e) => updateMedicine(index, "name", e.target.value)} placeholder="Medicine name" className={fieldClass} />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                    <input type="text" value={medicine.dosage} onChange={(e) => updateMedicine(index, "dosage", e.target.value)} placeholder="Dosage" className={fieldClass} />
                                    <input type="text" value={medicine.frequency} onChange={(e) => updateMedicine(index, "frequency", e.target.value)} placeholder="Frequency" className={fieldClass} />
                                    <input type="text" value={medicine.duration} onChange={(e) => updateMedicine(index, "duration", e.target.value)} placeholder="Duration" className={fieldClass} />
                                </div>
                                <div className="mt-2.5 space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="w-14 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Dose</span>
                                        {DOSAGE_PRESETS.map((preset) => (
                                            <button key={preset.label} type="button" title={preset.title} onClick={() => updateMedicine(index, "dosage", preset.label)} className={presetChip(medicine.dosage === preset.label)}>
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="w-14 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Freq</span>
                                        {FREQUENCY_PRESETS.map((preset) => (
                                            <button key={preset.label} type="button" onClick={() => updateMedicine(index, "frequency", preset.value)} className={presetChip(medicine.frequency === preset.value)} title={preset.value}>
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="w-14 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Course</span>
                                        {DURATION_PRESETS.map((preset) => (
                                            <button key={preset} type="button" onClick={() => updateMedicine(index, "duration", preset)} className={presetChip(medicine.duration === preset)}>
                                                {preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Advice</label>
                    <textarea rows="2" value={prescriptionNotes} onChange={(e) => setPrescriptionNotes(e.target.value)} placeholder="Rest, diet, and when to follow up" className={`${fieldClass} resize-none`} />
                </div>
                <button
                    type="submit"
                    disabled={savingPrescription}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl shadow-sm"
                >
                    {savingPrescription ? "Saving..." : editingPrescription ? "Save changes" : prescriptions.length ? "Add this prescription" : "Save prescription"}
                </button>
            </div>
        </form>
    );

    const portrait = (src, name, size = "h-10 w-10 text-sm") => (
        <div className={`${size} rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0`}>
            {src ? (
                <img src={src} alt={name || ""} className="h-full w-full object-cover" />
            ) : (
                <span className="font-semibold text-slate-500">{(name || "?").charAt(0).toUpperCase()}</span>
            )}
        </div>
    );

    const updateDraft = (index, patch) => {
        setReportDrafts((prev) => prev.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)));
    };

    const addDraftFiles = (index, incoming) => {
        const nextFiles = Array.from(incoming || []);
        if (nextFiles.length === 0) return;
        setReportDrafts((prev) => prev.map((draft, i) => {
            if (i !== index) return draft;
            const merged = [...draft.files];
            nextFiles.forEach((file) => {
                const duplicate = merged.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified);
                if (!duplicate) merged.push(file);
            });
            return { ...draft, files: merged };
        }));
    };

    const removeDraftFile = (index, fileIndex) => {
        setReportDrafts((prev) => prev.map((draft, i) => (
            i === index ? { ...draft, files: draft.files.filter((_, current) => current !== fileIndex) } : draft
        )));
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "";
        if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="bg-[#eef3f9] px-4 py-5 sm:px-6">
            <div className="max-w-[1440px] mx-auto flex flex-col gap-5">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight">Appointment Communication</h1>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/95">
                            <span className="inline-flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {weekdayLabel || "Date not set"}
                            </span>
                            {headerTime && (
                                <span className="inline-flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {headerTime}
                                </span>
                            )}
                            <span className="rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-slate-800">{headerStatus}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            {portrait(doctor.photo, doctor.name, "h-12 w-12 text-base border-white/40")}
                            <div className="min-w-0">
                                <p className="font-semibold truncate">Dr. {doctor.name}</p>
                                <p className="text-sm text-white/80 truncate">{doctor.specialization}</p>
                            </div>
                        </div>
                        {canCancelAppointment && (
                            <button
                                type="button"
                                onClick={() => handleStatusChange("cancelled")}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 ${panelTab === "conversation" ? "xl:items-stretch" : "items-start"}`}>
                <div className="flex flex-col gap-5">
                    <section className="!py-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5">
                        <div className="flex items-center justify-between mb-3 gap-3">
                            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Health Issues
                            </h2>
                            <div className="flex items-center gap-3">
                                {healthIssueUpdatedAt && (
                                    <span className="text-[11px] text-slate-400">Last updated: {new Date(healthIssueUpdatedAt).toLocaleString()}</span>
                                )}
                                {isPatient && !isBookingClosed && !editingNote && (
                                    <button type="button" onClick={() => setEditingNote(true)} className="text-xs font-medium text-blue-600">
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                        {isPatient && editingNote && !isBookingClosed ? (
                            <form onSubmit={handleUpdateHealthIssues} className="space-y-2">
                                <textarea
                                    className={fieldClass}
                                    rows="3"
                                    value={newHealthIssues}
                                    onChange={(e) => setNewHealthIssues(e.target.value)}
                                    placeholder="Describe your current health issues..."
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingNote(false);
                                            setNewHealthIssues(booking.currentHealthIssues || "");
                                        }}
                                        className="px-2 py-1 text-xs text-slate-500"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg">Save note</button>
                                </div>
                            </form>
                        ) : (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                                <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">
                                    {booking.currentHealthIssues || "No symptoms added yet."}
                                </p>
                            </div>
                        )}
                        {isBookingClosed && (
                            <p className="text-[11px] text-slate-500 mt-2">This booking is {booking.status}. No further updates are allowed.</p>
                        )}
                    </section>

                    {isDoctor && (
                        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-4">
                            <div className="flex items-center justify-between mb-1">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Previous Visits{priorVisits.length ? ` (${priorVisits.length})` : ""}
                                </h2>
                                {priorVisits.length > 0 && (
                                    <button type="button" onClick={() => setShowHistory(true)} className="text-sm font-medium text-blue-600">
                                        View all
                                    </button>
                                )}
                            </div>
                            {historyLoading ? (
                                <p className="text-sm text-slate-500">Loading earlier visits...</p>
                            ) : historyError ? (
                                <p className="text-sm text-red-600">{historyError}</p>
                            ) : priorVisits.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {priorVisits.slice(0, 3).map((visit) => (
                                        <div key={visit._id} className="py-3">
                                            <VisitTimelineRow visit={visit} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 pt-2">First visit with you. No earlier visits on record.</p>
                            )}
                        </section>
                    )}

                    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                <span className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 inline-flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                Medical Reports
                            </h2>
                            <div className="flex items-center gap-2">
                                {reportCards.length > 0 && (
                                    <button type="button" onClick={() => setShowAllReports(true)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50">
                                        View all
                                    </button>
                                )}
                                {isPatient && !isBookingClosed && (
                                    <button type="button" onClick={() => setShowUpload((prev) => !prev)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${showUpload ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                                        {showUpload ? "Close" : "Upload"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {isPatient && isBookingClosed && (
                            <p className="text-xs text-slate-500 mb-2">This booking is {booking.status}. No further reports can be uploaded.</p>
                        )}

                        {isPatient && showUpload && !isBookingClosed && (
                            <div className="mb-4 rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/70 to-white p-4">
                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-slate-900">Upload reports</p>
                                    <p className="mt-0.5 text-xs text-slate-500">Group files by type. You can attach several images or PDFs to each one.</p>
                                </div>
                                <datalist id="report-types">
                                    <option value="Blood Test" />
                                    <option value="MRI" />
                                    <option value="X-Ray" />
                                    <option value="CT Scan" />
                                    <option value="Ultrasound" />
                                    <option value="Lab Report" />
                                </datalist>
                                <div className="space-y-3">
                                    {reportDrafts.map((draft, index) => (
                                        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                                            <div className="mb-2.5 flex items-center justify-between gap-2">
                                                <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-600 text-[11px] text-white">{index + 1}</span>
                                                    Report type
                                                </span>
                                                {reportDrafts.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setReportDrafts((prev) => prev.filter((_, i) => i !== index))}
                                                        className="text-xs font-medium text-slate-400 hover:text-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                list="report-types"
                                                value={draft.name}
                                                onChange={(e) => updateDraft(index, { name: e.target.value })}
                                                placeholder="Blood Test, MRI, X-Ray..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                            />
                                            <label className="mt-2.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-3 py-5 text-center transition hover:border-blue-400 hover:bg-blue-50">
                                                <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0-12l-4 4m4-4l4 4" />
                                                    </svg>
                                                </span>
                                                <span className="text-sm font-semibold text-slate-800">Add files</span>
                                                <span className="mt-0.5 text-xs text-slate-500">Select several PDFs or images at once</span>
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        addDraftFiles(index, e.target.files);
                                                        e.target.value = "";
                                                    }}
                                                />
                                            </label>
                                            {draft.files.length > 0 && (
                                                <ul className="mt-2.5 space-y-1.5">
                                                    {draft.files.map((file, fileIndex) => (
                                                        <li key={`${file.name}-${file.lastModified}-${fileIndex}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2">
                                                            <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${file.type === "application/pdf" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"}`}>
                                                                {file.type === "application/pdf" ? "PDF" : "IMG"}
                                                            </span>
                                                            <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">{file.name}</span>
                                                            <span className="shrink-0 text-[11px] text-slate-400">{formatFileSize(file.size)}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeDraftFile(index, fileIndex)}
                                                                className="shrink-0 text-slate-400 hover:text-red-600"
                                                                aria-label={`Remove ${file.name}`}
                                                            >
                                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => setReportDrafts((prev) => [...prev, { name: "", files: [] }])}
                                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700"
                                    >
                                        + Add another type
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleGroupedReportUpload}
                                        disabled={uploading}
                                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {uploading ? "Uploading..." : "Upload all"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {visibleReports.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {visibleReports.map((card) => (
                                    <div key={card.key} className={`group relative shrink-0 ${isDoctor ? "w-24" : "w-32"}`}>
                                        <button
                                            type="button"
                                            onClick={() => openFile(card.url)}
                                            className="block w-full text-left"
                                        >
                                            <span className={`relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition group-hover:border-blue-300 group-hover:shadow-md ${isDoctor ? "h-24" : "h-32"}`}>
                                                {isPdf(card.url) ? (
                                                    <span className="flex h-full items-center justify-center text-[11px] font-semibold tracking-wide text-red-500">PDF</span>
                                                ) : (
                                                    <img src={card.url} alt={card.groupName} className="h-full w-full object-cover" />
                                                )}
                                                <span className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition group-hover:opacity-100">
                                                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm">View</span>
                                                </span>
                                            </span>
                                        </button>
                                        {isPatient && !isBookingClosed && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImageFromGroup(card.groupName, card.url)}
                                                className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:bg-red-50 hover:text-red-600"
                                                aria-label={`Remove ${card.groupName}`}
                                            >
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                        <span className="mt-1.5 block truncate text-center text-[11px] font-medium text-slate-600">{card.groupName}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 py-4 text-center">
                                {isPatient ? "Upload reports of any type to share with your doctor." : "No reports uploaded yet."}
                            </p>
                        )}

                        {isDoctor && !isBookingClosed && booking.currentReports?.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (aiStatus === "ready" || aiStatus === "processing") {
                                            setShowAI(true);
                                            return;
                                        }
                                        handleAnalyzeWithAI();
                                    }}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold py-3 rounded-xl inline-flex items-center justify-center gap-2"
                                >
                                    {aiStatus === "processing" ? (
                                        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    )}
                                    {aiButtonLabel}
                                </button>
                                {aiStatus === "processing" && (
                                    <p className="text-xs leading-relaxed text-violet-800 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2">
                                        Analysis is still running. This usually takes a minute. You can keep reading the reports, or open this to follow the progress.
                                    </p>
                                )}
                                {aiStatus === "failed" && (
                                    <p className="text-xs leading-relaxed text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                                        {booking.aiError || "Analysis didn't finish. You can try again."}
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowReferDoctor(true)}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-3 rounded-xl inline-flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z" />
                                    </svg>
                                    Refer to Doctor
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                <section className={`!py-0 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden ${panelTab === "conversation" ? "xl:h-full xl:flex xl:flex-col" : ""}`}>
                    <div className="shrink-0 px-3 pt-3 pb-2 flex gap-2 bg-gradient-to-r from-slate-50 to-blue-50/70">
                        <button
                            type="button"
                            onClick={() => setPanelTab("conversation")}
                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition ${panelTab === "conversation" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:text-slate-700"}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Conversation
                        </button>
                        <button
                            type="button"
                            onClick={() => setPanelTab("prescription")}
                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition ${panelTab === "prescription" ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:text-slate-700"}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Prescription
                            {prescriptions.length > 0 && (
                                <span className={`min-w-[1.15rem] rounded-full px-1.5 text-[11px] leading-5 text-center ${panelTab === "prescription" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"}`}>
                                    {prescriptions.length}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className={`${panelTab === "conversation" ? "xl:flex-1 xl:min-h-0 xl:flex xl:flex-col" : "hidden"}`}>
                        <div ref={chatScrollRef} className={`mx-3 mb-3 overflow-y-auto rounded-2xl bg-gradient-to-b from-blue-50 via-white to-indigo-50/80 border border-blue-100 px-3 py-3 space-y-3 ${isPatient ? "min-h-[32rem] max-h-[40rem] xl:max-h-none xl:min-h-[36rem] xl:flex-1" : "min-h-[22rem] max-h-[28rem] xl:max-h-none xl:min-h-0 xl:flex-1"}`}>
                        {threadLabel && (
                            <div className="flex justify-center">
                                <span className="text-[11px] font-medium text-blue-700 bg-white border border-blue-100 shadow-sm rounded-full px-3 py-0.5">{threadLabel}</span>
                            </div>
                        )}
                        {thread.length > 0 ? thread.map((item) => (
                            <div key={item.key} className={`flex ${item.side === "doctor" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex items-end gap-2 max-w-[88%] ${item.side === "doctor" ? "flex-row-reverse" : ""}`}>
                                    {portrait(item.side === "doctor" ? doctor.photo : patient.photo, item.side === "doctor" ? doctor.name : patient.name, "h-8 w-8 text-[11px] ring-2 ring-white")}
                                    <div>
                                        <div className={`flex items-center gap-1.5 mb-1 ${item.side === "doctor" ? "justify-end" : ""}`}>
                                            <span className={`text-[11px] font-semibold ${item.side === "doctor" ? "text-blue-700" : "text-slate-600"}`}>
                                                {item.side === "doctor" ? `Dr. ${doctor.name}` : patient.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{bubbleTime(item.at)}</span>
                                        </div>
                                        <div className={`px-3.5 py-2.5 text-sm leading-snug whitespace-pre-line shadow-sm ${item.side === "doctor" ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-md" : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-md"}`}>
                                            {item.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-6 flex flex-col items-center justify-center text-center">
                                <div className="h-11 w-11 rounded-2xl bg-white text-blue-600 shadow-sm border border-blue-100 flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-slate-700">No messages sent yet</p>
                                <p className="text-xs text-slate-500 mt-1">{isDoctor ? "Send a message to your patient" : "Send a message to your doctor"}</p>
                            </div>
                        )}
                        </div>
                    </div>
                    {panelTab === "conversation" && (
                        <div className="px-3 pb-3 xl:mt-auto shrink-0">
                            {isBookingClosed ? (
                                <p className="text-xs text-slate-500 px-1 py-1">This booking is {booking.status}. No further messages can be sent.</p>
                            ) : (
                                <form onSubmit={handleAddResponse} className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 p-1.5">
                                    <textarea
                                        rows="1"
                                        value={newResponse}
                                        onChange={(e) => setNewResponse(e.target.value)}
                                        required
                                        placeholder={isDoctor ? "Type a message to the patient..." : "Type a message to your doctor..."}
                                        className="flex-1 resize-none px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                    <button type="submit" className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm inline-flex items-center justify-center" aria-label="Send">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 2L11 13" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 2l-7 20-4-9-9-4 20-7z" />
                                        </svg>
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                    <div className={`px-4 py-4 ${panelTab === "prescription" ? "" : "hidden"}`}>
                    <div className="space-y-4">
                        {prescriptions.map((prescription, index) => {
                            const isEditing = editingPrescriptionId && String(editingPrescriptionId) === String(prescription._id);
                            if (isEditing) return <div key={prescription._id || index}>{prescriptionComposer}</div>;
                            const stamp = prescription.updatedAt || prescription.createdAt;
                            const isLatest = index === prescriptions.length - 1;
                            return (
                                <article key={prescription._id || index} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-600" />
                                    <div className="pl-5 pr-4 py-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-11 w-11 shrink-0 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-serif text-lg italic">Rx</div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold text-slate-900">Prescription {index + 1}</p>
                                                        {isLatest && prescriptions.length > 1 && (
                                                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Latest</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {prescription.updatedAt ? "Revised " : ""}
                                                        {formatRxStamp(stamp)}
                                                        {doctor.name ? ` · Dr. ${doctor.name}` : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            {isDoctor && !isBookingClosed && (
                                                <button
                                                    type="button"
                                                    onClick={() => openEditPrescription(prescription)}
                                                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Revise
                                                </button>
                                            )}
                                        </div>
                                        {prescription.diagnosis && (
                                            <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Diagnosis</p>
                                                <p className="mt-0.5 text-sm text-slate-800 whitespace-pre-line">{prescription.diagnosis}</p>
                                            </div>
                                        )}
                                        {prescription.medicines?.length > 0 && (
                                            <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
                                                {prescription.medicines.map((medicine, medicineIndex) => (
                                                    <li key={medicineIndex} className="flex items-start gap-3 px-3 py-2.5">
                                                        <span className="mt-0.5 h-6 w-6 shrink-0 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold inline-flex items-center justify-center">{medicineIndex + 1}</span>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900">{medicine.name}</p>
                                                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                                {[
                                                                    ["dosage", medicine.dosage],
                                                                    ["frequency", medicine.frequency],
                                                                    ["duration", medicine.duration],
                                                                ].filter(([, value]) => value).map(([kind, detail]) => (
                                                                    <span key={kind} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{detail}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {prescription.notes && (
                                            <div className="mt-3">
                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Advice</p>
                                                <p className="mt-0.5 text-sm text-slate-700 whitespace-pre-line">{prescription.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}

                        {!isDoctor && prescriptions.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                                <div className="mx-auto mb-2 h-11 w-11 rounded-2xl bg-white border border-slate-200 text-emerald-700 font-serif italic text-lg flex items-center justify-center">Rx</div>
                                <p className="text-sm font-semibold text-slate-700">No prescription yet</p>
                                <p className="text-xs text-slate-500 mt-1">Your doctor has not written a prescription for this visit.</p>
                            </div>
                        )}

                        {isDoctor && isBookingClosed && (
                            <p className="text-xs text-slate-500">
                                {prescriptions.length
                                    ? `This booking is ${booking.status}. Prescriptions can no longer be changed.`
                                    : `This booking is ${booking.status}. No prescription was written.`}
                            </p>
                        )}

                        {showNewComposer && prescriptionComposer}

                        {isDoctor && !isBookingClosed && prescriptions.length > 0 && !editingPrescription && !showNewComposer && (
                            <button
                                type="button"
                                onClick={openNewPrescription}
                                className="w-full rounded-2xl border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white px-4 py-5 text-left hover:border-emerald-400 hover:shadow-sm transition"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="h-11 w-11 rounded-2xl bg-emerald-600 text-white text-xl font-semibold inline-flex items-center justify-center shadow-sm">+</span>
                                    <span>
                                        <span className="block text-sm font-semibold text-slate-900">Add another prescription</span>
                                        <span className="block text-xs text-slate-500 mt-0.5">A new sheet, kept alongside the ones already saved.</span>
                                    </span>
                                </span>
                            </button>
                        )}
                    </div>
                    </div>
                </section>
            </div>

            {showAllReports && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => { setShowAllReports(false); setEditingGroup(null); }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Medical Reports</h3>
                                <p className="text-sm text-slate-500">{reportCards.length} file{reportCards.length === 1 ? "" : "s"} across {booking.currentReports?.length || 0} report{(booking.currentReports?.length || 0) === 1 ? "" : "s"}</p>
                            </div>
                            <button type="button" onClick={() => { setShowAllReports(false); setEditingGroup(null); }} className="h-9 w-9 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close">
                                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto px-6 py-5 space-y-6">
                            {(booking.currentReports || []).map((group) => (
                                <div key={group.name}>
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        {editingGroup === group.name ? (
                                            <form
                                                className="flex items-center gap-2"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleUpdateGroupName(group.name);
                                                }}
                                            >
                                                <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
                                                <button type="submit" className="text-sm font-medium text-blue-600">Save</button>
                                                <button type="button" onClick={() => setEditingGroup(null)} className="text-sm text-slate-500">Cancel</button>
                                            </form>
                                        ) : (
                                            <h4 className="text-base font-semibold text-slate-800">{group.name}</h4>
                                        )}
                                        {isPatient && !isBookingClosed && editingGroup !== group.name && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <button type="button" onClick={() => { setEditingGroup(group.name); setNewGroupName(group.name); }} className="text-slate-500 hover:text-blue-600">Rename</button>
                                                <label className="text-blue-600 cursor-pointer">
                                                    Add files
                                                    <input
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        multiple
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            handleAddToExistingGroup(group.name, e.target.files);
                                                            e.target.value = "";
                                                        }}
                                                    />
                                                </label>
                                                <button type="button" onClick={() => handleRemoveGroup(group.name)} className="text-red-500">Delete</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {(group.files || []).map((url) => (
                                            <div key={url} className="group relative w-36">
                                                <button type="button" onClick={() => openFile(url)} className="relative block h-36 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-[#eef4ff] shadow-sm">
                                                    {isPdf(url) ? (
                                                        <span className="flex h-full items-center justify-center text-sm font-medium text-red-500">PDF</span>
                                                    ) : (
                                                        <img src={url} alt={group.name} className="h-full w-full object-cover" />
                                                    )}
                                                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition group-hover:opacity-100">
                                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">View</span>
                                                    </span>
                                                </button>
                                                {isPatient && !isBookingClosed && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImageFromGroup(group.name, url)}
                                                        className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:bg-red-50 hover:text-red-600"
                                                        aria-label={`Remove ${group.name}`}
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showHistory && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={() => setShowHistory(false)}>
                    <div
                        className="h-full w-full max-w-md bg-[#f8fafc] shadow-xl flex flex-col"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">Visit history</h2>
                                <p className="text-xs text-slate-500">{patient.name || "Patient"} · {priorVisits.length} earlier visit{priorVisits.length === 1 ? "" : "s"}</p>
                            </div>
                            <button type="button" onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none" aria-label="Close history">
                                ×
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                            <VisitHistoryList
                                visits={priorVisits}
                                onReuse={!isBookingClosed ? reusePrescription : null}
                            />
                        </div>
                    </div>
                </div>
            )}
            {expandedImage && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" onClick={() => setExpandedImage(null)}>
                    <div className="max-w-4xl max-h-full">
                        <img src={expandedImage} className="max-w-full max-h-screen object-contain" alt="Expanded report" />
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedImage(null);
                            }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            {showAI && role === "doctor" && (
                <AnalyzeAi
                    booking={booking}
                    aiAnalysis={aiAnalysis}
                    status={aiStatus}
                    onClose={() => setShowAI(false)}
                    onRetry={handleAnalyzeWithAI}
                />
            )}
            {showReferDoctor && (
                <ReferToDoctor
                    bookingId={bookingId}
                    booking={booking}
                    draftPrescription={{
                        diagnosis: prescriptionDiagnosis,
                        notes: prescriptionNotes,
                        medicines,
                    }}
                    onClose={() => setShowReferDoctor(false)}
                    onReferSuccess={() => {
                        toast.success("Referral completed successfully!");
                    }}
                />
            )}
            </div>
        </div>
    );
};

export default GetInTouch;
