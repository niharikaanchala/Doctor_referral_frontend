import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { buildReferralPacket, createReferralCase } from "../../utils/referralCases";

const SPECIALTY_HINTS = [
    { specialty: "Neurology", aliases: ["neuro"], terms: ["headache", "migraine", "seizure", "dizziness", "numbness", "tingling", "stroke", "memory", "vertigo"] },
    { specialty: "Orthopedics", aliases: ["ortho", "bone"], terms: ["fracture", "joint", "knee", "shoulder", "back pain", "bone", "sprain", "arthritis", "swelling"] },
    { specialty: "Vascular Surgeon", aliases: ["vascular"], terms: ["varicose", "vascular", "leg pain", "claudication", "dvt", "aneurysm", "circulation"] },
    { specialty: "Gynecology", aliases: ["gyn", "obstetric"], terms: ["pregnancy", "menstrual", "period pain", "pelvic", "ovary", "uterus"] },
    { specialty: "Pediatrics", aliases: ["paediatric", "child"], terms: ["child", "infant", "pediatric", "paediatric", "baby"] },
    { specialty: "Dentistry", aliases: ["dental"], terms: ["tooth", "teeth", "dental", "gum", "cavity", "jaw pain"] },
    { specialty: "Cardiology", aliases: ["cardiac", "heart"], terms: ["chest pain", "palpitation", "heart", "breathlessness", "hypertension"] },
];

function symptomText(booking, draftPrescription) {
    return [
        booking?.currentHealthIssues,
        ...(booking?.healthIssuesHistory || []).map((item) => item?.text),
        ...(booking?.prescriptions || []).map((item) => item?.diagnosis),
        draftPrescription?.diagnosis,
    ].filter(Boolean).join(" ");
}

function suggestSpecialties(text) {
    const haystack = String(text || "").toLowerCase();
    if (!haystack.trim()) return [];
    return SPECIALTY_HINTS
        .map((hint) => ({
            specialty: hint.specialty,
            aliases: hint.aliases,
            hits: hint.terms.filter((term) => haystack.includes(term)),
        }))
        .filter((hint) => hint.hits.length > 0);
}

function doctorMatchesHint(doctor, hint) {
    const label = String(doctor?.specialization || "").toLowerCase();
    if (!label) return false;
    const names = [hint.specialty, ...(hint.aliases || [])].map((item) => item.toLowerCase());
    return names.some((name) => label.includes(name) || name.includes(label));
}

const ReferToDoctor = ({ bookingId, booking, draftPrescription, onClose, onReferSuccess }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [referring, setReferring] = useState(false);
    const [viewMode, setViewMode] = useState("cards"); // "cards" or "details"
    const [showInviteForm, setShowInviteForm] = useState(false); // New state for invite form
    const [inviteFormData, setInviteFormData] = useState({
        name: "",
        email: "",
        phone_no: "",
        specialization: "",
        hospital: ""
    });
    const [sendingInvite, setSendingInvite] = useState(false);
    const [reason, setReason] = useState("");
    const [priority, setPriority] = useState("medium");
    const [includePacket, setIncludePacket] = useState({
        details: true,
        summary: true,
        reports: true,
        prescriptions: true,
    });

    // Static doctor data
    const staticDoctors = [
        {
            _id: "1",
            name: "Sarah Johnson",
            email: "sarah.johnson@medicalcenter.com",
            phone: "+1-555-0101",
            photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
            specialization: "Vascular Surgeon",
            hospital: "City General Hospital",
            location: "New York, NY",
            medical_license_number: "MED123456",
            year_of_registration: "2010",
            state_medical_license: "New York State Medical License",
            state_license_number: "NY789012",
            experience: "14",
            qualification: "MD, Cardiology Board Certified",
            equipment: "ECG, Echocardiogram, Stress Test"
        },
        {
            _id: "2",
            name: "Michael Chen",
            email: "michael.chen@healthcare.org",
            phone: "+1-555-0102",
            photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
            specialization: "Neurology",
            hospital: "Neuro Care Institute",
            location: "Los Angeles, CA",
            medical_license_number: "MED654321",
            year_of_registration: "2008",
            state_medical_license: "California Medical License",
            state_license_number: "CA456789",
            experience: "16",
            qualification: "MD, Neurology Specialist",
            equipment: "MRI, CT Scan, EEG"
        },
        {
            _id: "3",
            name: "Priya Sharma",
            email: "priya.sharma@medgroup.com",
            phone: "+1-555-0103",
            photo: "https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?w=150&h=150&fit=crop&crop=face",
            specialization: "Pediatrics",
            hospital: "Children's Medical Center",
            location: "Chicago, IL",
            medical_license_number: "MED987654",
            year_of_registration: "2015",
            state_medical_license: "Illinois Medical License",
            state_license_number: "IL123789",
            experience: "9",
            qualification: "MD, Pediatric Board Certified",
            equipment: "Child Monitoring, Vaccination Equipment"
        },
        {
            _id: "4",
            name: "Robert Williams",
            email: "robert.williams@surgical.org",
            phone: "+1-555-0104",
            photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
            specialization: "Orthopedics",
            hospital: "Bone & Joint Center",
            location: "Houston, TX",
            medical_license_number: "MED456123",
            year_of_registration: "2005",
            state_medical_license: "Texas Medical License",
            state_license_number: "TX987654",
            experience: "19",
            qualification: "MD, Orthopedic Surgery",
            equipment: "X-Ray, Arthroscopy, Surgical Tools"
        },
        {
            _id: "5",
            name: "Emily Davis",
            email: "emily.davis@womenshealth.com",
            phone: "+1-555-0105",
            photo: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face",
            specialization: "Gynecology",
            hospital: "Women's Health Clinic",
            location: "Miami, FL",
            medical_license_number: "MED789123",
            year_of_registration: "2012",
            state_medical_license: "Florida Medical License",
            state_license_number: "FL654987",
            experience: "12",
            qualification: "MD, Gynecology Specialist",
            equipment: "Ultrasound, Laparoscopy"
        },
        {
            _id: "6",
            name: "David Kim",
            email: "david.kim@dentalcare.com",
            phone: "+1-555-0106",
            photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
            specialization: "Dentistry",
            hospital: "Smile Dental Clinic",
            location: "Seattle, WA",
            medical_license_number: "MED321987",
            year_of_registration: "2018",
            state_medical_license: "Washington Dental License",
            state_license_number: "WA321654",
            experience: "6",
            qualification: "DDS, Dental Surgery",
            equipment: "Dental Chair, X-Ray, Cleaning Tools"
        }
    ];

    useEffect(() => {
        // Simulate API call with static data
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                // Using static data instead of API call
                setTimeout(() => {
                    setDoctors(staticDoctors);
                    setLoading(false);
                }, 1000); // Simulate network delay
            } catch (err) {
                toast.error("Failed to fetch doctors");
                console.error("Error fetching doctors:", err);
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleReferToDoctor = async () => {
        if (!selectedDoctor) {
            toast.error("Please select a doctor first");
            return;
        }
        if (!reason.trim()) {
            toast.error("Add the reason you are referring this patient");
            return;
        }

        try {
            setReferring(true);
            const packet = buildReferralPacket(booking, draftPrescription);
            await new Promise(resolve => setTimeout(resolve, 400));
            createReferralCase({
                bookingId,
                reason: reason.trim(),
                priority,
                summary: includePacket.summary ? packet.summary : "",
                latestDiagnosis: includePacket.summary ? packet.latestDiagnosis : "",
                referredBy: packet.referredBy,
                referredTo: {
                    id: selectedDoctor._id,
                    name: `Dr. ${selectedDoctor.name}`,
                    specialization: selectedDoctor.specialization,
                    hospital: selectedDoctor.hospital,
                    photo: selectedDoctor.photo,
                },
                patient: includePacket.details
                    ? packet.patient
                    : { id: packet.patient?.id, name: packet.patient?.name },
                reports: includePacket.reports ? packet.reports : [],
                prescriptions: includePacket.prescriptions ? packet.prescriptions : [],
            });
            toast.success(`Referred to Dr. ${selectedDoctor.name}. Track the case in Dashboard → Referrals.`);
            onReferSuccess?.();
            onClose();
        } catch (err) {
            toast.error("Failed to refer patient");
            console.error("Refer error:", err);
        } finally {
            setReferring(false);
        }
    };

    const handleViewDetails = (doctor) => {
        setSelectedDoctor(doctor);
        setViewMode("details");
    };

    const handleBackToList = () => {
        setViewMode("cards");
        setSelectedDoctor(null);
    };

    // New functions for invite doctor functionality
    const handleInviteDoctor = () => {
        setShowInviteForm(true);
    };

    const handleInviteFormChange = (e) => {
        const { name, value } = e.target;
        setInviteFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendInvite = async () => {
        // Basic validation
        if (!inviteFormData.name || !inviteFormData.email || !inviteFormData.specialization) {
            toast.error("Please fill in all required fields (Name, Email, Specialization)");
            return;
        }

        try {
            setSendingInvite(true);
            // Simulate API call for sending invite
            await new Promise(resolve => setTimeout(resolve, 1500));
            
           toast.success(`Invitation sent to Dr. ${inviteFormData.name} successfully`);
            
            // Reset form and close
            setInviteFormData({
                name: "",
                email: "",
                phone_no: "",
                specialization: "",
                hospital: ""
            });
            setShowInviteForm(false);
        } catch (err) {
            toast.error("Failed to send invitation");
            console.error("Invite error:", err);
        } finally {
            setSendingInvite(false);
        }
    };

    const handleCancelInvite = () => {
        setShowInviteForm(false);
        setInviteFormData({
            name: "",
            email: "",
            phone_no: "",
            specialization: "",
            hospital: ""
        });
    };

    const packet = buildReferralPacket(booking, draftPrescription);
    const recordedSymptoms = (booking?.currentHealthIssues || "").trim();
    const specialtyMatches = useMemo(
        () => suggestSpecialties(symptomText(booking, draftPrescription)),
        [booking, draftPrescription]
    );
    const rankedDoctors = useMemo(() => {
        return doctors
            .map((doctor) => {
                const match = specialtyMatches.find((hint) => doctorMatchesHint(doctor, hint));
                return match
                    ? { ...doctor, suggested: true, matchedTerms: match.hits, suggestedSpecialty: match.specialty }
                    : { ...doctor, suggested: false, matchedTerms: [], suggestedSpecialty: "" };
            })
            .sort((a, b) => Number(b.suggested) - Number(a.suggested));
    }, [doctors, specialtyMatches]);
    const suggestedSpecialties = [...new Set(rankedDoctors.filter((doctor) => doctor.suggested).map((doctor) => doctor.suggestedSpecialty))];

    const openReferralPacket = () => {
        if (!reason.trim() && selectedDoctor?.suggested) {
            const symptom = recordedSymptoms || selectedDoctor.matchedTerms.join(", ");
            setReason(`Referring for ${symptom}. A ${selectedDoctor.specialization} review may help with these symptoms.`);
        }
        setViewMode("packet");
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading doctors...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">
                            {showInviteForm ? "Invite a Doctor" : viewMode === "cards" ? "Refer to Another Doctor" : viewMode === "packet" ? "Send referral Details" : "Doctor Details"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <p className="text-blue-100 mt-1">
                        {showInviteForm
                            ? "Invite a doctor to join our platform"
                            : viewMode === "cards"
                                ? "Select a doctor to refer your patient to"
                                : viewMode === "packet"
                                    ? "Add the reason, then send the patient packet"
                                    : "View doctor details and make referral"}
                    </p>
                </div>

                <div className="h-[70vh] overflow-y-auto">
                    {showInviteForm ? (
                        // Invite Doctor Form
                        <div className="p-6">
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-700">
                                                Invite a doctor to join our platform. They will receive an email invitation to create an account.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={inviteFormData.name}
                                            onChange={handleInviteFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter doctor's full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={inviteFormData.email}
                                            onChange={handleInviteFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter doctor's email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone_no"
                                            value={inviteFormData.phone_no}
                                            onChange={handleInviteFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter doctor's phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Specialization <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={inviteFormData.specialization}
                                            onChange={handleInviteFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter specialization"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hospital/Clinic
                                        </label>
                                        <input
                                            type="text"
                                            name="hospital"
                                            value={inviteFormData.hospital}
                                            onChange={handleInviteFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter hospital or clinic name"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-6 border-t">
                                    <button
                                        onClick={handleCancelInvite}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendInvite}
                                        disabled={sendingInvite}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {sendingInvite ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending Invite...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Send Invitation
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : viewMode === "cards" ? (
                        <div className="p-6">
                            {/* Add Invite Doctor Button */}
                            {suggestedSpecialties.length > 0 ? (
                                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                    <p className="text-sm font-semibold text-emerald-900">Suggested from this patient's symptoms</p>
                                    <p className="mt-1 text-sm text-emerald-800">
                                        {recordedSymptoms ? `Symptoms: ${recordedSymptoms}. ` : ""}
                                        {suggestedSpecialties.join(" and ")} {suggestedSpecialties.length === 1 ? "is" : "are"} a useful referral for this visit. Matching doctors are listed first.
                                    </p>
                                    <p className="mt-1 text-xs text-emerald-700">This is a prompt for you to review. You still choose who to refer.</p>
                                </div>
                            ) : (
                                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    {recordedSymptoms
                                        ? `Symptoms recorded: ${recordedSymptoms}. No specialty stood out from that note, so choose the doctor you want to refer.`
                                        : "No symptoms are recorded on this visit yet. Choose the doctor you want to refer."}
                                </div>
                            )}
                            <div className="mb-6 flex justify-end">
                                <button
                                    onClick={handleInviteDoctor}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Invite Doctor
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rankedDoctors.map((doctor) => (
                                    <div key={doctor._id} className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow ${doctor.suggested ? "border-emerald-300 ring-1 ring-emerald-100" : "border-gray-200"}`}>
                                        <div className="p-5">
                                            <div className="flex items-center gap-4 mb-4">
                                                <img
                                                    src={doctor.photo}
                                                    alt={doctor.name}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-gray-800">Dr. {doctor.name}</h3>
                                                    <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                                                    {doctor.suggested && (
                                                        <p className="mt-1 text-[11px] font-semibold text-emerald-700">Suggested for {doctor.matchedTerms.join(", ")}</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Hospital:</span>
                                                    <span>{doctor.hospital || "Medical Center"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Location:</span>
                                                    <span>{doctor.location || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Experience:</span>
                                                    <span>{doctor.experience ? `${doctor.experience} years` : "Not specified"}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleViewDetails(doctor)}
                                                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : viewMode === "packet" && selectedDoctor ? (
                        <div className="p-6 max-w-3xl mx-auto space-y-5">
                            <button
                                onClick={() => setViewMode("details")}
                                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                </svg>
                                Back to Dr. {selectedDoctor.name}
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block text-sm font-medium text-gray-700 md:col-span-2">
                                    Reason for referral <span className="text-red-500">*</span>
                                    <textarea
                                        value={reason}
                                        onChange={(event) => setReason(event.target.value)}
                                        rows="3"
                                        placeholder="Why does this patient need this specialist?"
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </label>
                                <label className="block text-sm font-medium text-gray-700">
                                    Priority
                                    <select
                                        value={priority}
                                        onChange={(event) => setPriority(event.target.value)}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                                    >
                                        <option value="routine">Routine</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </label>
                            </div>

                            <fieldset className="border border-slate-200 rounded-lg p-3">
                                <legend className="px-1 text-sm font-medium text-slate-700">Referral packet</legend>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                    {[
                                        ["details", "Patient details"],
                                        ["summary", "Clinical summary and diagnosis"],
                                        ["reports", "Reports"],
                                        ["prescriptions", "Prescription"],
                                    ].map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={includePacket[key]}
                                                onChange={(event) => setIncludePacket((prev) => ({ ...prev, [key]: event.target.checked }))}
                                                className="accent-[#0067FF]"
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <div className={`bg-gray-50 rounded-lg p-4 text-sm space-y-2 ${includePacket.details ? "" : "opacity-40"}`}>
                                <h3 className="font-semibold text-gray-800">Patient details</h3>
                                <p>{packet.patient?.name} · {packet.patient?.age || "Age not recorded"} · {packet.patient?.gender || "Gender not recorded"}</p>
                                <p className="text-gray-600">{packet.patient?.phone || "No phone"} · {packet.patient?.email || "No email"}</p>
                                <p className="text-gray-600">{packet.patient?.address || "No address"}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className={`border border-gray-200 rounded-lg p-4 ${includePacket.reports ? "" : "opacity-40"}`}>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-800">Reports</h3>
                                        {packet.reportsAreSample && (
                                            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Sample</span>
                                        )}
                                    </div>
                                    <ul className="space-y-3 text-gray-700">
                                        {(packet.reports || []).map((report) => (
                                            <li key={report.name}>
                                                <p className="font-medium text-gray-800">{report.name}</p>
                                                <ul className="mt-1 space-y-1">
                                                    {(report.files || []).map((file) => (
                                                        <li key={file}>
                                                            {String(file).startsWith("http") ? (
                                                                <a href={file} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{file}</a>
                                                            ) : (
                                                                <span className="text-gray-600">{file}</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={`border border-gray-200 rounded-lg p-4 ${includePacket.prescriptions ? "" : "opacity-40"}`}>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-800">Prescription</h3>
                                        {packet.prescriptionsAreSample && (
                                            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Sample</span>
                                        )}
                                    </div>
                                    <ul className="space-y-3 text-gray-700">
                                        {(packet.prescriptions || []).map((item, index) => (
                                            <li key={`${item.diagnosis || "rx"}-${index}`}>
                                                <p className="font-medium text-gray-800">
                                                    {item.diagnosis || "Prescription"}
                                                    {item.draft ? " (not saved yet)" : ""}
                                                </p>
                                                {item.notes && <p className="text-gray-600 mt-1 whitespace-pre-wrap">{item.notes}</p>}
                                                <ul className="mt-1">
                                                    {(item.medicines || []).map((medicine) => (
                                                        <li key={`${medicine.name}-${medicine.dosage}`}>
                                                            {medicine.name}
                                                            {medicine.dosage ? ` · ${medicine.dosage}` : ""}
                                                            {medicine.frequency ? ` · ${medicine.frequency}` : ""}
                                                            {medicine.duration ? ` · ${medicine.duration}` : ""}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className={`bg-gray-50 rounded-lg p-4 text-sm ${includePacket.summary ? "" : "opacity-40"}`}>
                                <h3 className="font-semibold text-gray-800 mb-2">Patient summary</h3>
                                {packet.latestDiagnosis && (
                                    <p className="text-xs text-[#0067FF] mb-2">Latest diagnosis: {packet.latestDiagnosis}</p>
                                )}
                                <p className="text-gray-700 whitespace-pre-wrap">{packet.summary || "No summary on this visit yet."}</p>
                            </div>

                            <p className="text-xs text-gray-500">
                                After you send this, open Dashboard, then Referrals. The case appears under Referrals Sent and Received Referrals.
                            </p>

                            <button
                                onClick={handleReferToDoctor}
                                disabled={referring || !reason.trim()}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {referring ? "Sending referral..." : `Send to Dr. ${selectedDoctor.name}`}
                            </button>
                        </div>
                    ) : (
                        <div className="p-6">
                            {selectedDoctor && (
                                <div className="max-w-4xl mx-auto">
                                    {/* Back Button */}
                                    <button
                                        onClick={handleBackToList}
                                        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                        </svg>
                                        Back to Doctors List
                                    </button>

                                    {/* Doctor Header */}
                                    <div className="text-center mb-8">
                                        <img
                                            src={selectedDoctor.photo}
                                            alt={selectedDoctor.name}
                                            className="w-24 h-24 rounded-full mx-auto border-4 border-blue-100 shadow-lg"
                                        />
                                        <h2 className="text-2xl font-bold text-gray-800 mt-4">Dr. {selectedDoctor.name}</h2>
                                        <p className="text-lg text-blue-600 font-medium">{selectedDoctor.specialization}</p>
                                        <p className="text-gray-600">{selectedDoctor.hospital || "Medical Center"}</p>
                                    </div>

                                    {/* Detailed Information Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        {/* Personal Information */}
                                        <div className="bg-gray-50 p-5 rounded-lg">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                </svg>
                                                Personal Information
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Full Name:</span>
                                                    <span className="text-gray-800">Dr. {selectedDoctor.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Email:</span>
                                                    <span className="text-gray-800">{selectedDoctor.email}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Mobile No:</span>
                                                    <span className="text-gray-800">{selectedDoctor.phone || "Not provided"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional Information */}
                                        <div className="bg-gray-50 p-5 rounded-lg">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                                </svg>
                                                Professional Details
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Specialization:</span>
                                                    <span className="text-gray-800">{selectedDoctor.specialization}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Hospital:</span>
                                                    <span className="text-gray-800">{selectedDoctor.hospital || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Location:</span>
                                                    <span className="text-gray-800">{selectedDoctor.location || "Not specified"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Medical License Information */}
                                        <div className="bg-gray-50 p-5 rounded-lg">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                                </svg>
                                                License Information
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Medical License No:</span>
                                                    <span className="text-gray-800">{selectedDoctor.medical_license_number || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Year of Registration:</span>
                                                    <span className="text-gray-800">{selectedDoctor.year_of_registration || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">State Medical License:</span>
                                                    <span className="text-gray-800">{selectedDoctor.state_medical_license || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">State License No:</span>
                                                    <span className="text-gray-800">{selectedDoctor.state_license_number || "Not specified"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Experience & Qualifications */}
                                        <div className="bg-gray-50 p-5 rounded-lg">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                                </svg>
                                                Qualifications & Experience
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Experience:</span>
                                                    <span className="text-gray-800">{selectedDoctor.experience || "Not specified"} years</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Qualification:</span>
                                                    <span className="text-gray-800">{selectedDoctor.qualification || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Equipment:</span>
                                                    <span className="text-gray-800">{selectedDoctor.equipment || "Not specified"}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-4 pt-6 border-t">
                                        <button
                                            onClick={handleBackToList}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                        >
                                            Back to List
                                        </button>
                                        <button
                                            onClick={openReferralPacket}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                            Refer to Dr. {selectedDoctor.name}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReferToDoctor;
