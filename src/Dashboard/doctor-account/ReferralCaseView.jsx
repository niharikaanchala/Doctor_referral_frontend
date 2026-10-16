import React, { useEffect, useState } from "react";
import {
  Activity,
  Calendar,
  ClipboardList,
  FileText,
  HeartPulse,
  Pill,
  Stethoscope,
  X,
} from "lucide-react";
import { CONDITION_STEPS, conditionLabel } from "../../utils/referralCases";

const STATUS_STYLE = {
  referred: "bg-amber-50 text-amber-800",
  accepted: "bg-blue-50 text-[#0067FF]",
  under_care: "bg-indigo-50 text-indigo-700",
  improving: "bg-cyan-50 text-cyan-800",
  recovered: "bg-emerald-50 text-emerald-700",
};

const OPEN_STEPS = CONDITION_STEPS.filter((step) => step.id !== "recovered");

const fieldClass = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0067FF] focus:bg-white";

function formatWhen(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatDay(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function initials(name) {
  return String(name || "P").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function asList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function Card({ icon: Icon, tint, title, extra, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${tint}`}>
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        {extra}
      </div>
      {children}
    </section>
  );
}

function isHttp(file) {
  return typeof file === "string" && /^https?:\/\//i.test(file);
}

function isPdf(file) {
  return /\.pdf(\?|$)/i.test(String(file).split("?")[0]);
}

function isImage(file) {
  if (!isHttp(file) || isPdf(file)) return false;
  return true;
}

function fileName(file, fallback) {
  if (!isHttp(file)) return String(file || fallback || "File");
  try {
    const name = decodeURIComponent(String(file).split("?")[0].split("/").pop() || "");
    return name || fallback || "File";
  } catch {
    return fallback || "File";
  }
}

function MediaFile({ file, label }) {
  const [preview, setPreview] = useState(null);
  const url = isHttp(file) ? file : "";
  const name = label || fileName(file);
  const image = isImage(file);

  const view = () => {
    if (!url) return;
    if (image) setPreview(url);
    else window.open(url, "_blank", "noreferrer");
  };

  const download = async () => {
    if (!url) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("download failed");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName(file, "report");
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank", "noreferrer");
    }
  };

  return (
    <>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2">
        <button type="button" onClick={view} disabled={!url} className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 disabled:cursor-default">
          {image ? (
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[11px] font-semibold text-slate-500">
              {isPdf(file) ? "PDF" : "FILE"}
            </span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">{name}</p>
          {!url && <p className="text-[11px] text-slate-400">File name only. The scan was not uploaded.</p>}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button type="button" onClick={view} disabled={!url} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-[#0067FF] disabled:cursor-not-allowed disabled:text-slate-300">View</button>
          <button type="button" onClick={download} disabled={!url} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300">Download</button>
        </div>
      </div>
      {preview && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4" onClick={() => setPreview(null)}>
          <img src={preview} alt={name} className="max-h-[90vh] max-w-full rounded-lg bg-white object-contain" onClick={(event) => event.stopPropagation()} />
          <button type="button" className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white" onClick={() => setPreview(null)}>Close</button>
        </div>
      )}
    </>
  );
}

function ReportFiles({ report }) {
  const files = report?.files || [];
  if (!files.length) return <p className="mt-1 text-xs text-slate-400">No file attached</p>;
  return files.map((file, index) => (
    <MediaFile key={`${file}-${index}`} file={file} label={files.length > 1 ? `${report.name} ${index + 1}` : report.name} />
  ));
}

const ReferralCaseView = ({ caseRecord, viewerRole, onClose, onAddUpdate, onDischarge, onReopen }) => {
  const canEdit = viewerRole === "receiving";
  const [panel, setPanel] = useState(canEdit ? "update" : "timeline");
  const patient = caseRecord.patient || {};
  const closed = caseRecord.conditionStatus === "recovered" || caseRecord.declined;
  const authorName = caseRecord.referredTo?.name || "Receiving doctor";
  const lastUpdate = caseRecord.timeline?.[caseRecord.timeline.length - 1];
  const plan = caseRecord.treatmentPlan || {};

  const [note, setNote] = useState("");
  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState(caseRecord.conditionStatus === "recovered" ? "under_care" : caseRecord.conditionStatus || "referred");
  const [followUpDate, setFollowUpDate] = useState(caseRecord.followUpDate ? String(caseRecord.followUpDate).slice(0, 10) : "");
  const [reportName, setReportName] = useState("");
  const [medications, setMedications] = useState(plan.medications || "");
  const [procedures, setProcedures] = useState(plan.procedures || "");
  const [recommendations, setRecommendations] = useState(plan.recommendations || "");
  const [changes, setChanges] = useState(plan.changes || "");
  const [discharge, setDischarge] = useState({ outcome: "", medications: "", advice: "", followUp: "" });
  const [reopenNote, setReopenNote] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const currentPlan = caseRecord.treatmentPlan || {};
    setMedications(currentPlan.medications || "");
    setProcedures(currentPlan.procedures || "");
    setRecommendations(currentPlan.recommendations || "");
    setChanges(currentPlan.changes || "");
    setFollowUpDate(caseRecord.followUpDate ? String(caseRecord.followUpDate).slice(0, 10) : "");
    setStatus(caseRecord.conditionStatus === "recovered" ? "under_care" : caseRecord.conditionStatus || "referred");
    setNote("");
    setObservations("");
    setReportName("");
    setFormError("");
    setPanel(viewerRole === "receiving" ? "update" : "timeline");
  }, [caseRecord.id, caseRecord.updatedAt, caseRecord.conditionStatus, viewerRole]);

  const submitUpdate = (event) => {
    event.preventDefault();
    if (!canEdit || closed || !note.trim()) return;
    const result = onAddUpdate({
      authorRole: "receiving",
      authorName,
      status,
      note: note.trim(),
      observations: observations.trim() || note.trim(),
      followUpDate,
      reportName: reportName.trim(),
      treatmentPlan: { medications, procedures, recommendations, changes },
    });
    if (result?.error) setFormError(result.error);
  };

  const submitDischarge = () => {
    if (!canEdit) return;
    const result = onDischarge(discharge, { authorRole: "receiving", authorName });
    if (result?.error) setFormError(result.error);
  };

  const submitReopen = (event) => {
    event.preventDefault();
    if (!canEdit) return;
    const result = onReopen({ authorRole: "receiving", authorName, note: reopenNote.trim() });
    if (result?.error) setFormError(result.error);
  };

  const tabs = [
    ...(canEdit ? [["update", closed ? "Reopen" : "Update", Stethoscope]] : []),
    ["timeline", "Timeline", Activity],
    ["summary", "Summary", ClipboardList],
    ["documents", "Documents", FileText],
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#f7f9fc] w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
        <header className="bg-white px-5 py-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0067FF] text-white font-semibold">
              {initials(patient.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{patient.name || "Patient"}</h2>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[caseRecord.conditionStatus] || STATUS_STYLE.referred}`}>
                  {conditionLabel(caseRecord.conditionStatus)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {patient.age || "—"} yrs · {patient.gender || "—"} · {patient.id || "—"} · {caseRecord.id}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5 text-[#0067FF]" />{caseRecord.referredBy?.name || "Referring doctor"}</span>
                <span>→</span>
                <span>{caseRecord.referredTo?.name || "Receiving doctor"}{caseRecord.referredTo?.specialization ? ` · ${caseRecord.referredTo.specialization}` : ""}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDay(caseRecord.createdAt)}</span>
              </p>
            </div>
            <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className={`mt-3 rounded-xl px-3 py-2 text-xs ${canEdit ? "bg-blue-50 text-[#0067FF]" : "bg-slate-100 text-slate-600"}`}>
            {canEdit
              ? `You are the receiving doctor (${authorName}). Updates you save are visible to the referring doctor.`
              : "View only. You can follow this patient's condition, treatment, reports, and notes. The receiving doctor adds the updates."}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-3 p-4 space-y-3">
            <Card
              icon={HeartPulse}
              tint="bg-blue-50 text-[#0067FF]"
              title="Current condition"
              extra={<span className="text-[11px] text-slate-400">{formatWhen(caseRecord.latestCondition?.updatedAt || caseRecord.updatedAt)}</span>}
            >
              <p className="text-sm font-semibold text-[#0067FF]">{caseRecord.latestCondition?.status || conditionLabel(caseRecord.conditionStatus)}</p>
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{caseRecord.latestCondition?.observations || "No observation recorded yet."}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" /> Next review {formatDay(caseRecord.followUpDate)}
              </p>
            </Card>

            <Card icon={Pill} tint="bg-emerald-50 text-emerald-600" title="Treatment plan">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Medications</dt><dd className="text-slate-800 mt-0.5">{plan.medications || "—"}</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Procedures</dt><dd className="text-slate-800 mt-0.5">{plan.procedures || "—"}</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Recommendations</dt><dd className="text-slate-800 mt-0.5">{plan.recommendations || "—"}</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Changes</dt><dd className="text-slate-800 mt-0.5">{plan.changes || "—"}</dd></div>
              </dl>
            </Card>

            <Card icon={Stethoscope} tint="bg-indigo-50 text-indigo-600" title="Latest update">
              {lastUpdate ? (
                <div className="text-sm">
                  <p className="font-medium text-slate-800">{lastUpdate.authorName}</p>
                  <p className="text-[11px] text-slate-400">{formatWhen(lastUpdate.createdAt)} · {conditionLabel(lastUpdate.status)}</p>
                  <p className="text-slate-700 mt-2 whitespace-pre-wrap">{lastUpdate.note}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No update yet.</p>
              )}
            </Card>

            <Card icon={ClipboardList} tint="bg-slate-100 text-slate-600" title="Discharge summary">
              {caseRecord.discharge ? (
                <dl className="space-y-1.5 text-sm text-slate-700">
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Outcome</dt><dd>{caseRecord.discharge.outcome}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Discharged</dt><dd>{formatWhen(caseRecord.discharge.dischargedAt)}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Medications</dt><dd>{caseRecord.discharge.medications}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Advice</dt><dd>{caseRecord.discharge.advice}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Follow-up</dt><dd>{caseRecord.discharge.followUp}</dd></div>
                </dl>
              ) : (
                <p className="text-sm text-slate-500">Still open. Improving is not a discharge.</p>
              )}
            </Card>
          </div>

          <div className="lg:col-span-2 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-4">
            <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 mb-4">
              {tabs.map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPanel(id)}
                  className={`flex-1 inline-flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold ${panel === id ? "bg-white text-[#0067FF] shadow-sm" : "text-slate-500"}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
            {formError && <p className="text-xs text-red-600 mb-2">{formError}</p>}

            {panel === "summary" && (
              <div className="space-y-4 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Reason for referral</h3>
                  <p className="text-slate-800 mt-1 whitespace-pre-wrap">{caseRecord.reason || "—"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Consultation snapshot</h3>
                  <p className="text-slate-800 mt-1 whitespace-pre-wrap">{caseRecord.summary || "—"}</p>
                  <p className="text-xs text-[#0067FF] mt-2">Diagnosis: {caseRecord.latestDiagnosis || patient.condition || "—"}</p>
                </div>
                <div className="text-xs text-slate-500 space-y-1 px-1">
                  <p>{patient.phone || "—"} · {patient.email || "—"}</p>
                  <p>{patient.address || "—"}</p>
                  <p>Allergies: {asList(patient.allergies).join(", ") || "None recorded"}</p>
                  <p>History: {asList(patient.medicalHistory).join(", ") || "None recorded"}</p>
                </div>
              </div>
            )}

            {panel === "documents" && (
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Sent with the referral</h3>
                  <ul className="mt-2 space-y-2">
                    {(caseRecord.originalReports || caseRecord.reports || []).map((report) => (
                      <li key={report.name} className="rounded-xl border border-slate-200 px-3 py-2">
                        <p className="font-medium text-slate-800">{report.name}</p>
                        <ReportFiles report={report} />
                      </li>
                    ))}
                    {(caseRecord.originalReports || caseRecord.reports || []).length === 0 && <li className="text-slate-500">No original reports.</li>}
                  </ul>
                  <ul className="mt-2 space-y-2">
                    {(caseRecord.originalPrescriptions || caseRecord.prescriptions || []).map((item, index) => (
                      <li key={`${item.diagnosis}-${index}`} className="rounded-xl border border-slate-200 px-3 py-2">
                        <p className="font-medium text-slate-800">{item.diagnosis || "Prescription"}</p>
                        {(item.medicines || []).map((medicine) => (
                          <p key={medicine.name} className="text-slate-600">{medicine.name}{[medicine.dosage, medicine.frequency].filter(Boolean).length ? ` · ${[medicine.dosage, medicine.frequency].filter(Boolean).join(" · ")}` : ""}</p>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Added after referral</h3>
                  {(caseRecord.addedReports || []).length ? (
                    <ul className="mt-2 space-y-2">
                      {caseRecord.addedReports.map((report) => (
                        <li key={`${report.name}-${report.addedAt}`} className="rounded-xl border border-slate-200 px-3 py-2">
                          <p className="font-medium text-slate-800">{report.name}</p>
                          <p className="text-[11px] text-slate-400">{report.addedBy} · {formatWhen(report.addedAt)}</p>
                          <ReportFiles report={report} />
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-slate-500 mt-1">None yet.</p>}
                </div>
              </div>
            )}

            {panel === "timeline" && (
              <ol className="relative space-y-3 border-l-2 border-blue-100 ml-2 pl-4">
                {(caseRecord.timeline || []).map((entry) => (
                  <li key={entry.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0067FF] ring-4 ring-blue-50" />
                    <p className="text-xs font-semibold text-slate-800">{entry.authorName}</p>
                    <p className="text-[11px] text-slate-400">{formatWhen(entry.createdAt)} · {conditionLabel(entry.status)}</p>
                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{entry.note}</p>
                  </li>
                ))}
              </ol>
            )}

            {canEdit && panel === "update" && !closed && (
              <div className="space-y-3">
                <form onSubmit={submitUpdate} className="space-y-2.5 text-sm">
                  <label className="block text-xs font-medium text-slate-500">
                    Condition
                    <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClass}>
                      {OPEN_STEPS.map((step) => <option key={step.id} value={step.id}>{step.label}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs font-medium text-slate-500">
                    Progress note
                    <textarea required value={note} onChange={(event) => setNote(event.target.value)} rows="3" className={fieldClass} placeholder="What changed since the last review?" />
                  </label>
                  <label className="block text-xs font-medium text-slate-500">
                    Key observations
                    <textarea value={observations} onChange={(event) => setObservations(event.target.value)} rows="2" className={fieldClass} placeholder="Shown on the condition card" />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-medium text-slate-500">Medications<input value={medications} onChange={(event) => setMedications(event.target.value)} className={fieldClass} /></label>
                    <label className="block text-xs font-medium text-slate-500">Procedures<input value={procedures} onChange={(event) => setProcedures(event.target.value)} className={fieldClass} /></label>
                    <label className="block text-xs font-medium text-slate-500">Recommendations<input value={recommendations} onChange={(event) => setRecommendations(event.target.value)} className={fieldClass} /></label>
                    <label className="block text-xs font-medium text-slate-500">Changes<input value={changes} onChange={(event) => setChanges(event.target.value)} className={fieldClass} /></label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-medium text-slate-500">Next review<input type="date" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} className={fieldClass} /></label>
                    <label className="block text-xs font-medium text-slate-500">Report name<input value={reportName} onChange={(event) => setReportName(event.target.value)} className={fieldClass} placeholder="Optional" /></label>
                  </div>
                  <button type="submit" className="w-full rounded-xl bg-[#0067FF] hover:bg-blue-700 text-white text-sm font-semibold py-2.5">Save update</button>
                </form>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 space-y-2">
                  <p className="text-xs font-semibold text-emerald-800">Discharge and close</p>
                  <input value={discharge.outcome} onChange={(event) => setDischarge((prev) => ({ ...prev, outcome: event.target.value }))} placeholder="Clinical outcome" className={fieldClass} />
                  <input value={discharge.medications} onChange={(event) => setDischarge((prev) => ({ ...prev, medications: event.target.value }))} placeholder="Discharge medications" className={fieldClass} />
                  <input value={discharge.advice} onChange={(event) => setDischarge((prev) => ({ ...prev, advice: event.target.value }))} placeholder="Advice" className={fieldClass} />
                  <input value={discharge.followUp} onChange={(event) => setDischarge((prev) => ({ ...prev, followUp: event.target.value }))} placeholder="Recommended follow-up" className={fieldClass} />
                  <button type="button" onClick={submitDischarge} className="w-full rounded-xl border border-emerald-600 text-emerald-700 text-sm font-semibold py-2">Discharge</button>
                </div>
              </div>
            )}

            {canEdit && panel === "update" && closed && (
              <form onSubmit={submitReopen} className="space-y-3 text-sm">
                <p className="text-slate-600">This case is closed. Reopen it with a reason before adding another note.</p>
                {caseRecord.declined ? (
                  <p className="text-sm text-red-600">This referral was declined.</p>
                ) : (
                  <>
                    <textarea required value={reopenNote} onChange={(event) => setReopenNote(event.target.value)} rows="3" className={fieldClass} placeholder="Why is this case being reopened?" />
                    <button type="submit" className="w-full rounded-xl border border-[#0067FF] text-[#0067FF] text-sm font-semibold py-2.5">Reopen case</button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCaseView;
