import { useState } from "react";

const isPdf = (url) => typeof url === "string" && url.toLowerCase().split("?")[0].endsWith(".pdf");

export const formatVisitDate = (value) => {
  if (!value) return "Date not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not recorded";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const relativeWhen = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.round((Date.now() - date.getTime()) / 86400000);
  if (days < 0) return "Upcoming";
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;
  const years = Math.round(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
};

const formatClock = (time) => {
  if (!time || !String(time).includes(":")) return time || "";
  const [rawH, rawM] = String(time).split(":");
  let hours = parseInt(rawH, 10);
  const minutes = String(parseInt(rawM, 10) || 0).padStart(2, "0");
  if (Number.isNaN(hours)) return String(time);
  const meridian = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${meridian}`;
};

export const formatSlotRange = (slot) => {
  if (!slot?.startingTime) return "";
  const start = formatClock(slot.startingTime);
  const end = slot.endingTime ? formatClock(slot.endingTime) : "";
  return end ? `${start} - ${end}` : start;
};

const statusChip = (status) => {
  if (status === "completed") return { label: "Completed", className: "bg-emerald-50 text-emerald-700" };
  if (status === "approved") return { label: "Consultation", className: "bg-blue-50 text-blue-700" };
  if (status === "pending") return { label: "Pending", className: "bg-amber-50 text-amber-700" };
  if (status === "cancelled") return { label: "Cancelled", className: "bg-red-50 text-red-600" };
  return { label: status || "Visit", className: "bg-slate-100 text-slate-600" };
};

const PrescriptionBlock = ({ visit }) => {
  const { diagnosis, notes, medicines } = visitFacts(visit);
  if (!diagnosis && medicines.length === 0 && notes.length === 0) return null;
  return (
    <div className="mt-2 rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Prescription</p>
      {diagnosis && <p className="mt-1 text-sm font-medium text-slate-800">{diagnosis}</p>}
      {medicines.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {medicines.map((medicine, index) => (
            <li key={`${medicine.name}-${index}`} className="text-sm text-slate-800">
              {medicine.name}
              <span className="text-slate-500">
                {" "}
                {[medicine.dosage, medicine.frequency, medicine.duration].filter(Boolean).join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      )}
      {notes.length > 0 && (
        <p className="mt-1 text-xs text-slate-600 whitespace-pre-line">{notes.join("\n")}</p>
      )}
    </div>
  );
};

export const VisitTimelineRow = ({ visit }) => {
  const chip = statusChip(visit?.status);
  const when = formatSlotRange(visit?.timeSlot);
  return (
    <div className="flex gap-3">
      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{formatVisitDate(visit?.appointmentDate)}</p>
            {when && <p className="text-sm text-slate-500">{when}</p>}
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${chip.className}`}>
            {chip.label}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-slate-500 truncate">{visit?.complaint || "No symptoms recorded."}</p>
        <PrescriptionBlock visit={visit} />
      </div>
    </div>
  );
};

const visitFacts = (visit) => {
  const prescriptions = visit?.prescriptions || [];
  const diagnosis = prescriptions.map((item) => item.diagnosis).filter(Boolean).join(", ");
  const notes = prescriptions.map((item) => item.notes).filter(Boolean);
  const medicines = prescriptions.flatMap((item) => item.medicines || []);
  const reports = (visit?.reports || []).filter((group) => group?.files?.length);
  const fileCount = reports.reduce((total, group) => total + (group.files?.length || 0), 0);
  return { diagnosis, notes, medicines, reports, fileCount };
};

const ReportPreview = ({ preview, onClose }) => {
  if (!preview) return null;
  return (
    <div
      className="fixed inset-0 z-[70] bg-black/75 flex items-center justify-center p-4"
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <img
        src={preview}
        alt="Report"
        className="max-w-full max-h-[90vh] object-contain bg-white rounded-lg"
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full px-3 py-1 text-sm"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        Close
      </button>
    </div>
  );
};

const ReportTiles = ({ reports, onOpen }) => (
  <div className="grid grid-cols-2 gap-2">
    {reports.flatMap((group) =>
      (group.files || []).map((url, index) => (
        <button
          key={url}
          type="button"
          onClick={() => onOpen(url)}
          className="rounded-lg border border-slate-200 bg-white overflow-hidden text-left hover:border-blue-300"
        >
          <span className="block h-28 bg-slate-100 overflow-hidden">
            {isPdf(url) ? (
              <span className="flex h-full items-center justify-center text-xs font-semibold text-red-500">PDF</span>
            ) : (
              <img src={url} alt={group.name} className="h-full w-full object-cover" />
            )}
          </span>
          <span className="block px-2 py-1.5 text-xs font-medium text-slate-700 truncate">
            {group.files.length > 1 ? `${group.name} ${index + 1}` : group.name}
          </span>
        </button>
      ))
    )}
  </div>
);

const VisitDetails = ({ visit, onReuse }) => {
  const [preview, setPreview] = useState(null);
  const { diagnosis, medicines, reports } = visitFacts(visit);
  const canReuse = typeof onReuse === "function" && (diagnosis || medicines.length > 0);

  const openReport = (url) => {
    if (!url) return;
    if (isPdf(url)) window.open(url, "_blank", "noreferrer");
    else setPreview(url);
  };

  return (
    <div className="space-y-3">
      {reports.length > 0 && <ReportTiles reports={reports} onOpen={openReport} />}
      {canReuse && (
        <button
          type="button"
          onClick={() => onReuse(visit)}
          className="text-xs font-medium text-emerald-700"
        >
          Copy medicines into this prescription
        </button>
      )}
      <ReportPreview preview={preview} onClose={() => setPreview(null)} />
    </div>
  );
};

export const VisitSummary = ({ visit, onReuse }) => {
  const { reports, fileCount } = visitFacts(visit);
  const [preview, setPreview] = useState(null);

  const openReport = (url) => {
    if (!url) return;
    if (isPdf(url)) window.open(url, "_blank", "noreferrer");
    else setPreview(url);
  };

  return (
    <div>
      <VisitTimelineRow visit={visit} />
      {fileCount > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {reports.map((group) => (
            <button
              key={group.name}
              type="button"
              onClick={() => openReport(group.files[0])}
              className="rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 hover:bg-blue-100"
            >
              {group.name}
              {group.files.length > 1 ? ` · ${group.files.length}` : ""}
            </button>
          ))}
        </div>
      )}
      {typeof onReuse === "function" && visitFacts(visit).medicines.length > 0 && (
        <button type="button" onClick={() => onReuse(visit)} className="mt-2 text-xs font-medium text-emerald-700">
          Copy medicines into this prescription
        </button>
      )}
      <ReportPreview preview={preview} onClose={() => setPreview(null)} />
    </div>
  );
};

export const VisitHistoryList = ({ visits = [], onReuse }) => {
  const [openId, setOpenId] = useState(visits[0]?._id || null);

  if (!visits.length) {
    return <p className="text-sm text-slate-500">No earlier visits with you.</p>;
  }

  return (
    <div className="space-y-2">
      {visits.map((visit) => {
        const open = String(openId) === String(visit._id);
        const { fileCount, diagnosis, medicines } = visitFacts(visit);
        const meta = [
          fileCount ? `${fileCount} report${fileCount === 1 ? "" : "s"}` : "",
          diagnosis || "",
          medicines.length ? `${medicines.length} medicine${medicines.length === 1 ? "" : "s"}` : "",
        ].filter(Boolean);

        return (
          <article key={visit._id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : visit._id)}
              className="w-full text-left px-3.5 py-3"
            >
              <VisitTimelineRow visit={visit} />
              <div className="mt-1.5 pl-5 flex items-center justify-between gap-2">
                <p className="text-xs text-slate-400 truncate">{meta.join(" · ") || "No reports or prescription"}</p>
                <span className="text-xs font-medium text-blue-600 shrink-0">{open ? "Hide" : "Details"}</span>
              </div>
            </button>
            {open && (
              <div className="px-3.5 pb-3.5 border-t border-slate-100 pt-3">
                <VisitDetails visit={visit} onReuse={onReuse} />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export const VisitCard = VisitSummary;
