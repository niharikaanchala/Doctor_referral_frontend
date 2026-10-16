const STORAGE_KEY = "demo_referral_cases_v2";
const CHANGE_EVENT = "referral-cases-changed";

export const CONDITION_STEPS = [
  { id: "referred", label: "Referred" },
  { id: "accepted", label: "Accepted" },
  { id: "under_care", label: "Under care" },
  { id: "improving", label: "Improving" },
  { id: "recovered", label: "Recovered / Discharged" },
];

export function conditionLabel(status) {
  return CONDITION_STEPS.find((step) => step.id === status)?.label || "Referred";
}

const seedCases = [
  {
    id: "REF-1001",
    bookingId: "demo-booking-1",
    lists: ["sent"],
    sharedDemo: false,
    priority: "high",
    conditionStatus: "under_care",
    createdAt: "2026-10-10T09:30:00.000Z",
    reason: "Claudication and a weak left pedal pulse. Needs a vascular opinion before we escalate treatment.",
    summary: "45-year-old man with hypertension and type 2 diabetes. Walking pain in the left calf for 6 weeks. ABI not available in clinic. Started on antiplatelet therapy and referred for vascular assessment.",
    referredBy: {
      name: "Dr. You",
      specialization: "General Medicine",
      hospital: "City Clinic",
    },
    referredTo: {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialization: "Vascular Surgeon",
      hospital: "City General Hospital",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    },
    patient: {
      id: "PAT-001",
      name: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "+1-555-0123",
      gender: "Male",
      age: 45,
      bloodType: "A+",
      address: "123 Main St, New York, NY",
      condition: "Peripheral artery disease",
      allergies: ["Penicillin"],
      medicalHistory: ["Hypertension", "Type 2 diabetes"],
      medications: ["Lisinopril 10mg", "Metformin 500mg", "Aspirin 75mg"],
    },
    reports: [
      { name: "Lipid profile", files: ["lipid-profile.pdf"] },
      { name: "Doppler note", files: ["left-leg-doppler.pdf"] },
    ],
    prescriptions: [
      {
        diagnosis: "Suspected peripheral artery disease",
        notes: "Walk daily. Avoid smoking. Review after vascular opinion.",
        createdAt: "2026-10-10T09:00:00.000Z",
        medicines: [
          { name: "Aspirin", dosage: "75mg", frequency: "Once daily", duration: "30 days" },
          { name: "Atorvastatin", dosage: "20mg", frequency: "At night", duration: "30 days" },
        ],
      },
    ],
    latestDiagnosis: "Peripheral artery disease",
    followUpDate: "2026-10-27",
    updatedAt: "2026-10-13T11:20:00.000Z",
    treatmentPlan: {
      medications: "Aspirin 75mg daily, atorvastatin 20mg at night",
      procedures: "Repeat ankle-brachial index",
      recommendations: "Supervised walking. Continue antiplatelet therapy. No ulcer care.",
      changes: "Walking program started. Antiplatelet therapy unchanged from the referral.",
    },
    latestCondition: {
      status: "Under care",
      observations: "ABI 0.72 on the left. Calf pain on walking persists. No rest pain or ulcer.",
      updatedAt: "2026-10-13T11:20:00.000Z",
    },
    addedReports: [],
    discharge: null,
    timeline: [
      {
        id: "upd-1001-a",
        authorRole: "referring",
        authorName: "Dr. You",
        status: "referred",
        note: "Referred for vascular assessment. Packet includes labs, Doppler note, and current prescription.",
        createdAt: "2026-10-10T09:30:00.000Z",
      },
      {
        id: "upd-1001-b",
        authorRole: "receiving",
        authorName: "Dr. Sarah Johnson",
        status: "accepted",
        note: "Accepted. Clinic visit booked. Will repeat ankle-brachial index.",
        createdAt: "2026-10-11T14:10:00.000Z",
      },
      {
        id: "upd-1001-c",
        authorRole: "receiving",
        authorName: "Dr. Sarah Johnson",
        status: "under_care",
        note: "ABI 0.72 on the left. Started supervised walking and continued antiplatelet therapy. No ulcer.",
        createdAt: "2026-10-13T11:20:00.000Z",
      },
    ],
  },
  {
    id: "REF-1002",
    bookingId: "demo-booking-2",
    lists: ["received"],
    sharedDemo: false,
    priority: "urgent",
    conditionStatus: "improving",
    createdAt: "2026-10-08T16:00:00.000Z",
    reason: "Intermittent chest pain with ECG changes. Needs cardiology follow-up after the emergency visit.",
    summary: "52-year-old man, ex-smoker, with hypertension. Pressure-like chest pain on exertion. ECG showed nonspecific ST changes. Troponin negative in emergency. Referred for outpatient cardiology.",
    referredBy: {
      name: "Dr. Amanda White",
      specialization: "Internal Medicine",
      hospital: "City General Hospital",
    },
    referredTo: {
      id: "you",
      name: "Dr. You",
      specialization: "Cardiology",
      hospital: "Your clinic",
    },
    patient: {
      id: "PAT-005",
      name: "David Lee",
      email: "david.lee@email.com",
      phone: "+1-555-0131",
      gender: "Male",
      age: 52,
      bloodType: "O+",
      address: "654 Maple St, Houston, TX",
      condition: "Chest pain",
      allergies: ["Aspirin"],
      medicalHistory: ["Hypertension", "High cholesterol"],
      medications: ["Atorvastatin 20mg", "Amlodipine 5mg"],
    },
    reports: [
      { name: "ECG", files: ["ecg-12-lead.pdf"] },
      { name: "Troponin", files: ["troponin.pdf"] },
    ],
    prescriptions: [
      {
        diagnosis: "Possible stable angina",
        notes: "Rest if pain returns. Emergency review if pain lasts more than 15 minutes.",
        createdAt: "2026-10-08T15:40:00.000Z",
        medicines: [
          { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "14 days" },
          { name: "Glyceryl trinitrate spray", dosage: "1 spray", frequency: "As needed", duration: "14 days" },
        ],
      },
    ],
    latestDiagnosis: "Possible stable angina",
    followUpDate: "2026-10-21",
    updatedAt: "2026-10-14T10:05:00.000Z",
    treatmentPlan: {
      medications: "Amlodipine 5mg daily, glyceryl trinitrate spray as needed. Aspirin avoided.",
      procedures: "Treadmill test planned",
      recommendations: "Emergency review if pain lasts more than 15 minutes.",
      changes: "No new medicines. Pain-free for 4 days on the referral prescription.",
    },
    latestCondition: {
      status: "Improving",
      observations: "Exertional pain has settled. No rest pain. This is not a discharge.",
      updatedAt: "2026-10-14T10:05:00.000Z",
    },
    addedReports: [],
    discharge: null,
    timeline: [
      {
        id: "upd-1002-a",
        authorRole: "referring",
        authorName: "Dr. Amanda White",
        status: "referred",
        note: "Sending ECG, troponin, and the discharge prescription.",
        createdAt: "2026-10-08T16:00:00.000Z",
      },
      {
        id: "upd-1002-b",
        authorRole: "receiving",
        authorName: "Dr. You",
        status: "accepted",
        note: "Accepted into cardiology clinic this week.",
        createdAt: "2026-10-09T08:15:00.000Z",
      },
      {
        id: "upd-1002-c",
        authorRole: "receiving",
        authorName: "Dr. You",
        status: "improving",
        note: "Pain-free for 4 days on current medicines. Treadmill test planned. Referring doctor can keep watching this thread.",
        createdAt: "2026-10-14T10:05:00.000Z",
      },
    ],
  },
  {
    id: "REF-1003",
    bookingId: "demo-booking-3",
    lists: ["sent"],
    sharedDemo: false,
    priority: "medium",
    conditionStatus: "recovered",
    createdAt: "2026-09-20T10:00:00.000Z",
    reason: "Knee swelling after a twist. Needs an orthopedic plan.",
    summary: "58-year-old man with knee osteoarthritis. Acute swelling after a minor twist. Settled with rest, ice, and anti-inflammatory treatment.",
    referredBy: {
      name: "Dr. You",
      specialization: "General Medicine",
      hospital: "City Clinic",
    },
    referredTo: {
      id: "4",
      name: "Dr. Robert Williams",
      specialization: "Orthopedics",
      hospital: "Bone & Joint Center",
      photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    },
    patient: {
      id: "PAT-003",
      name: "Robert Brown",
      email: "robert.brown@email.com",
      phone: "+1-555-0127",
      gender: "Male",
      age: 58,
      bloodType: "B+",
      address: "789 Pine St, Chicago, IL",
      condition: "Knee osteoarthritis flare",
      allergies: ["Codeine"],
      medicalHistory: ["Osteoarthritis"],
      medications: ["Celecoxib 200mg"],
    },
    reports: [{ name: "Knee X-ray", files: ["knee-xray.pdf"] }],
    prescriptions: [
      {
        diagnosis: "Osteoarthritis flare",
        notes: "Physiotherapy and activity as tolerated.",
        createdAt: "2026-09-20T09:40:00.000Z",
        medicines: [
          { name: "Celecoxib", dosage: "200mg", frequency: "Once daily", duration: "7 days" },
        ],
      },
    ],
    latestDiagnosis: "Osteoarthritis flare",
    followUpDate: "",
    updatedAt: "2026-10-02T15:30:00.000Z",
    treatmentPlan: {
      medications: "Celecoxib stopped after the flare settled",
      procedures: "None",
      recommendations: "Physiotherapy and activity as tolerated",
      changes: "Anti-inflammatory course completed.",
    },
    latestCondition: {
      status: "Recovered / Discharged",
      observations: "Swelling resolved. Full weight bearing.",
      updatedAt: "2026-10-02T15:30:00.000Z",
    },
    addedReports: [],
    discharge: {
      outcome: "Recovered. Knee swelling resolved and full weight bearing restored.",
      dischargedAt: "2026-10-02T15:30:00.000Z",
      medications: "Celecoxib stopped. Paracetamol as needed for pain.",
      advice: "Activity as tolerated. Home exercises twice a week for 4 weeks.",
      followUp: "Return to the referring doctor only if swelling recurs.",
    },
    timeline: [
      {
        id: "upd-1003-a",
        authorRole: "referring",
        authorName: "Dr. You",
        status: "referred",
        note: "X-ray and prescription attached.",
        createdAt: "2026-09-20T10:00:00.000Z",
      },
      {
        id: "upd-1003-b",
        authorRole: "receiving",
        authorName: "Dr. Robert Williams",
        status: "recovered",
        note: "Swelling resolved. Full weight bearing. No further specialist follow-up. Case closed for both doctors.",
        createdAt: "2026-10-02T15:30:00.000Z",
      },
    ],
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}

export function normalizeCase(item) {
  const originalReports = item.originalReports || item.reports || [];
  const originalPrescriptions = item.originalPrescriptions || item.prescriptions || [];
  const last = item.timeline?.[item.timeline.length - 1];
  const lists = item.sharedDemo ? ["sent"] : (item.lists?.length ? item.lists : ["sent"]);
  return {
    ...item,
    lists,
    priority: item.priority === "low" ? "routine" : item.priority || "medium",
    latestDiagnosis: item.latestDiagnosis || item.patient?.condition || "",
    originalReports: clone(originalReports) || [],
    originalPrescriptions: clone(originalPrescriptions) || [],
    reports: clone(originalReports) || [],
    prescriptions: clone(originalPrescriptions) || [],
    addedReports: item.addedReports || [],
    treatmentPlan: {
      medications: "",
      procedures: "",
      recommendations: "",
      changes: "",
      ...(item.treatmentPlan || {}),
    },
    latestCondition: item.latestCondition || {
      status: conditionLabel(item.conditionStatus),
      observations: last?.note || item.summary || "",
      updatedAt: item.updatedAt || last?.createdAt || item.createdAt || "",
    },
    followUpDate: item.followUpDate || "",
    discharge: item.discharge || null,
    updatedAt: item.updatedAt || last?.createdAt || item.createdAt || "",
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readCases() {
  if (!canUseStorage()) return seedCases.map(normalizeCase);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedCases.map(normalizeCase);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeCase) : seedCases.map(normalizeCase);
  } catch {
    return seedCases.map(normalizeCase);
  }
}

function writeCases(cases) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getReferralCases() {
  return readCases();
}

export function subscribeReferralCases(listener) {
  if (!canUseStorage()) return () => {};
  const handler = () => listener(readCases());
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function createReferralCase(input) {
  const now = new Date().toISOString();
  const reports = clone(input.reports || []) || [];
  const prescriptions = clone(input.prescriptions || []) || [];
  const record = normalizeCase({
    id: `REF-${Date.now()}`,
    bookingId: input.bookingId || "",
    lists: ["sent"],
    sharedDemo: false,
    priority: input.priority || "medium",
    conditionStatus: "referred",
    createdAt: now,
    updatedAt: now,
    reason: input.reason,
    summary: input.summary || "",
    latestDiagnosis: input.latestDiagnosis || input.patient?.condition || "",
    referredBy: clone(input.referredBy),
    referredTo: clone(input.referredTo),
    patient: clone(input.patient),
    reports,
    prescriptions,
    originalReports: reports,
    originalPrescriptions: prescriptions,
    addedReports: [],
    treatmentPlan: {
      medications: (input.patient?.medications || []).join(", "),
      procedures: "",
      recommendations: "",
      changes: "",
    },
    latestCondition: {
      status: "Referred",
      observations: input.summary || input.reason || "",
      updatedAt: now,
    },
    followUpDate: "",
    discharge: null,
    timeline: [
      {
        id: `upd-${Date.now()}`,
        type: "created",
        authorRole: "referring",
        authorName: input.referredBy?.name || "Referring doctor",
        status: "referred",
        note: input.reason,
        createdAt: now,
      },
    ],
  });
  writeCases([record, ...readCases()]);
  return record;
}

export function declineReferralCase(caseId, update) {
  const next = readCases().map((item) => {
    if (item.id !== caseId || item.conditionStatus === "recovered" || item.declined) return item;
    const entry = {
      id: `upd-${Date.now()}`,
      authorRole: update.authorRole || "receiving",
      authorName: update.authorName || "Receiving doctor",
      status: item.conditionStatus,
      note: update.note || "Declined this referral.",
      createdAt: new Date().toISOString(),
    };
    return {
      ...item,
      declined: true,
      timeline: [...(item.timeline || []), entry],
    };
  });
  writeCases(next);
  return next.find((item) => item.id === caseId) || null;
}

function isClosed(item) {
  return item?.conditionStatus === "recovered" || !!item?.declined;
}

export function addProgressUpdate(caseId, update) {
  let error = "";
  const next = readCases().map((item) => {
    if (item.id !== caseId) return item;
    if (isClosed(item)) {
      error = "This referral is closed. Reopen it before adding updates.";
      return item;
    }
    if (update.status === "recovered") {
      error = "A discharge summary is required before the case can be closed.";
      return item;
    }
    const now = new Date().toISOString();
    const status = update.status || item.conditionStatus;
    const addedReports = [...(item.addedReports || [])];
    if (update.reportName?.trim()) {
      addedReports.push({
        name: update.reportName.trim(),
        files: update.reportFiles || [],
        addedBy: update.authorName || "",
        addedAt: now,
      });
    }
    const treatmentPlan = {
      ...item.treatmentPlan,
      ...(update.treatmentPlan || {}),
    };
    const observations = (update.observations || update.note || "").trim();
    return {
      ...item,
      conditionStatus: status,
      updatedAt: now,
      followUpDate: update.followUpDate !== undefined ? update.followUpDate : item.followUpDate,
      treatmentPlan,
      latestCondition: {
        status: conditionLabel(status),
        observations,
        updatedAt: now,
      },
      addedReports,
      reports: item.originalReports,
      prescriptions: item.originalPrescriptions,
      timeline: [
        ...(item.timeline || []),
        {
          id: `upd-${Date.now()}`,
          type: status !== item.conditionStatus ? "status" : "progress",
          authorRole: update.authorRole,
          authorName: update.authorName,
          status,
          note: update.note,
          observations,
          followUpDate: update.followUpDate || "",
          createdAt: now,
        },
      ],
    };
  });
  if (error) return { record: readCases().find((item) => item.id === caseId) || null, error };
  writeCases(next);
  return { record: next.find((item) => item.id === caseId) || null, error: "" };
}

export function addConditionUpdate(caseId, update) {
  return addProgressUpdate(caseId, update).record;
}

export function dischargeReferralCase(caseId, discharge, author = {}) {
  const outcome = discharge?.outcome?.trim() || "";
  const medications = discharge?.medications?.trim() || "";
  const advice = discharge?.advice?.trim() || "";
  const followUp = discharge?.followUp?.trim() || "";
  if (!outcome || !medications || !advice || !followUp) {
    return { record: null, error: "Outcome, medications, advice, and follow-up are required before discharge." };
  }
  let error = "";
  const now = new Date().toISOString();
  const next = readCases().map((item) => {
    if (item.id !== caseId) return item;
    if (item.declined) {
      error = "A declined referral cannot be discharged.";
      return item;
    }
    if (item.conditionStatus === "recovered") {
      error = "This referral is already discharged.";
      return item;
    }
    const summary = {
      outcome,
      dischargedAt: now,
      medications,
      advice,
      followUp,
    };
    return {
      ...item,
      conditionStatus: "recovered",
      updatedAt: now,
      followUpDate: "",
      discharge: summary,
      latestCondition: { status: "Recovered / Discharged", observations: outcome, updatedAt: now },
      timeline: [
        ...(item.timeline || []),
        {
          id: `upd-${Date.now()}`,
          type: "discharge",
          authorRole: author.authorRole || "receiving",
          authorName: author.authorName || "Receiving doctor",
          status: "recovered",
          note: outcome,
          createdAt: now,
        },
      ],
    };
  });
  if (error) return { record: null, error };
  writeCases(next);
  return { record: next.find((item) => item.id === caseId) || null, error: "" };
}

export function reopenReferralCase(caseId, update) {
  if (!update?.note?.trim()) {
    return { record: null, error: "A clinical reason is required to reopen this referral." };
  }
  let error = "";
  const now = new Date().toISOString();
  const next = readCases().map((item) => {
    if (item.id !== caseId) return item;
    if (item.conditionStatus !== "recovered") {
      error = "Only a discharged referral can be reopened.";
      return item;
    }
    return {
      ...item,
      conditionStatus: "under_care",
      updatedAt: now,
      reopenedAt: now,
      latestCondition: {
        status: "Under care",
        observations: update.note.trim(),
        updatedAt: now,
      },
      timeline: [
        ...(item.timeline || []),
        {
          id: `upd-${Date.now()}`,
          type: "reopened",
          authorRole: update.authorRole,
          authorName: update.authorName,
          status: "under_care",
          note: update.note.trim(),
          createdAt: now,
        },
      ],
    };
  });
  if (error) return { record: null, error };
  writeCases(next);
  return { record: next.find((item) => item.id === caseId) || null, error: "" };
}

function textFromAnalysis(aiAnalysis) {
  if (!aiAnalysis) return "";
  if (typeof aiAnalysis === "string") return aiAnalysis;
  return aiAnalysis.summary || aiAnalysis.text || aiAnalysis.analysis || "";
}

function draftIsUseful(draft) {
  if (!draft) return false;
  const hasDiagnosis = !!draft.diagnosis?.trim();
  const hasNotes = !!draft.notes?.trim();
  const hasMedicine = (draft.medicines || []).some((medicine) => medicine.name?.trim());
  return hasDiagnosis || hasNotes || hasMedicine;
}

export function buildReferralPacket(booking, draftPrescription) {
  const user = booking?.user;
  if (!user) {
    return {
      summary: "Patient reports exertional calf pain. Please review the attached Doppler note and current medicines.",
      referredBy: { name: "Dr. You", specialization: "General Medicine", hospital: "City Clinic" },
      latestDiagnosis: "Suspected peripheral artery disease",
      patient: seedCases[0].patient,
      reports: seedCases[0].reports,
      reportsAreSample: true,
      prescriptions: seedCases[0].prescriptions,
      prescriptionsAreSample: true,
    };
  }

  const savedPrescriptions = booking.prescriptions || [];
  const visitPrescriptions = draftIsUseful(draftPrescription)
    ? [
        ...savedPrescriptions,
        {
          diagnosis: draftPrescription.diagnosis || "",
          notes: draftPrescription.notes || "",
          medicines: (draftPrescription.medicines || []).filter((medicine) => medicine.name?.trim()),
          createdAt: new Date().toISOString(),
          draft: true,
        },
      ]
    : savedPrescriptions;
  const prescriptionsAreSample = visitPrescriptions.length === 0;
  const prescriptions = prescriptionsAreSample ? seedCases[0].prescriptions : visitPrescriptions;

  const visitReports = (booking.currentReports || []).map((report) => ({
    name: report.name,
    files: report.files || [],
  }));
  const reportsAreSample = visitReports.length === 0;
  const reports = reportsAreSample ? seedCases[0].reports : visitReports;

  const analysis = textFromAnalysis(booking.aiAnalysis);
  const visitDiagnosis = visitPrescriptions.at(-1)?.diagnosis;
  const summaryParts = [
    booking.currentHealthIssues,
    visitDiagnosis ? `Working diagnosis: ${visitDiagnosis}` : "",
    analysis,
  ].filter(Boolean);

  const flag = (label, field) => {
    if (!field?.known || !field.value) return null;
    return `${label}: ${field.value}`;
  };

  return {
    summary: summaryParts.join("\n\n") || "No clinical summary recorded on this visit yet.",
    referredBy: {
      name: booking.doctor?.name ? `Dr. ${booking.doctor.name}` : "Dr. You",
      specialization: booking.doctor?.specialization || "",
      hospital: booking.doctor?.hospital || "",
      photo: booking.doctor?.photo || "",
    },
    patient: {
      id: user._id || booking._id,
      name: user.name || "Patient",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      age: user.age || "",
      bloodType: user.bloodType || "",
      photo: user.photo || "",
      address: user.address || "",
      condition: visitDiagnosis || "Clinical review",
      allergies: user.allergies || [],
      medicalHistory: [flag("BP", user.bp), flag("Diabetes", user.diabetic), flag("Thyroid", user.hyperthyroidism)].filter(Boolean),
      medications: visitPrescriptions.flatMap((item) => (item.medicines || []).map((medicine) => medicine.name)).filter(Boolean),
    },
    latestDiagnosis: visitDiagnosis || "",
    reports,
    reportsAreSample,
    prescriptions,
    prescriptionsAreSample,
  };
}

export function toReferralTableRow(item) {
  const patient = item.patient || {};
  const status = item.declined
    ? "rejected"
    : item.conditionStatus === "recovered"
      ? "completed"
      : item.conditionStatus === "referred"
        ? "pending"
        : "accepted";

  return {
    id: item.id,
    caseId: item.id,
    sharedDemo: !!item.sharedDemo,
    declined: !!item.declined,
    conditionStatus: item.conditionStatus,
    conditionText: item.declined ? "Declined" : conditionLabel(item.conditionStatus),
    patientName: patient.name || "Patient",
    patientId: patient.id || "—",
    condition: patient.condition || "Referral",
    referredTo: item.referredTo?.name || "—",
    referredBy: item.referredBy?.name || "—",
    referredToDepartment: item.referredTo?.specialization || "",
    referredByDepartment: item.referredBy?.specialization || "",
    department: item.referredTo?.specialization || item.referredBy?.specialization || "",
    dateReferred: (item.createdAt || "").slice(0, 10),
    status,
    priority: item.priority || "medium",
    notes: item.reason || "",
    latestNote: item.timeline?.[item.timeline.length - 1]?.note || item.reason || "",
    latestUpdateAt: item.updatedAt || item.createdAt || "",
    followUpDate: item.followUpDate || "",
    needsAttention: item.conditionStatus === "referred" || item.priority === "urgent" || (!!item.followUpDate && item.conditionStatus !== "recovered" && item.followUpDate.slice(0, 10) <= new Date().toISOString().slice(0, 10)),
    assignedDoctor: item.referredTo?.name || "—",
    patientDetails: {
      full_name: patient.name || "Patient",
      email: patient.email || "—",
      mobile_no: patient.phone || "—",
      gender: patient.gender || "—",
      age: patient.age || "—",
      condition: patient.condition || "—",
      address: patient.address || "—",
      emergency_contact: patient.emergencyContact || "—",
      blood_type: patient.bloodType || "—",
      allergies: patient.allergies?.length ? patient.allergies : ["None recorded"],
      medical_history: patient.medicalHistory?.length ? patient.medicalHistory : ["See referral summary"],
      current_medications: patient.medications?.length ? patient.medications : ["See prescription"],
      last_visit: (item.createdAt || "").slice(0, 10),
      insurance_provider: "—",
      insurance_number: "—",
    },
  };
}
