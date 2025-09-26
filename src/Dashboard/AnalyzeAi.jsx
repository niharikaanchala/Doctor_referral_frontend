import React, { useState } from "react";

const AnalyzeAi = ({ booking, aiAnalysis, onClose }) => {
    const [activeTab, setActiveTab] = useState("analysis"); // 'analysis' or 'chat'
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [explainingReport, setExplainingReport] = useState(null);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: newMessage,
            timestamp: new Date().toISOString(),
        };

        setChatMessages((prev) => [...prev, userMessage]);
        setNewMessage("");

        // Simulate AI response after a delay
        setTimeout(() => {
            const aiMessage = {
                id: Date.now() + 1,
                sender: "ai",
                text: "This is a simulated AI response. In a real implementation, this would connect to your AI backend to get a response about the medical reports.",
                timestamp: new Date().toISOString(),
            };
            setChatMessages((prev) => [...prev, aiMessage]);
        }, 1000);
    };

    const handleExplainReport = (report) => {
        setExplainingReport(report);
        setActiveTab("chat");
        setChatMessages([
            {
                id: 1,
                sender: "ai",
                text: `You asked about the ${report.groupName} report. Here's what I can tell you:\n\n${report.analysis}`,
                timestamp: new Date().toISOString(),
            },
        ]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4 text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center">
                            <svg
                                className="w-6 h-6 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                ></path>
                            </svg>
                            {activeTab === "analysis" ? "AI Analysis Report" : "Chat with AI"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm text-purple-100 mt-1">
                        {activeTab === "analysis"
                            ? `Analyzing reports for ${booking.user.name}`
                            : `Discussing reports with AI`}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab("analysis")}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${activeTab === "analysis"
                                ? "border-purple-500 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <svg
                                className={`w-5 h-5 mr-2 ${activeTab === "analysis" ? "text-purple-500" : "text-gray-400"
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                             AI Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab("chat")}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${activeTab === "chat"
                                ? "border-purple-500 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <svg
                                className={`w-5 h-5 mr-2 ${activeTab === "chat" ? "text-purple-500" : "text-gray-400"
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                            Chat with AI
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "analysis" ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-8">
                            {/* 1. Patient Overview */}
                            {aiAnalysis?.patientInfo && (
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Patient Overview
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-500">
                                                Basic Information
                                            </h4>
                                            <table className="mt-2 w-full">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-1 text-sm font-medium text-gray-700">
                                                            Name
                                                        </td>
                                                        <td className="py-1 text-sm text-gray-900">
                                                            {aiAnalysis.patientInfo.name}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 text-sm font-medium text-gray-700">
                                                            Age
                                                        </td>
                                                        <td className="py-1 text-sm text-gray-900">
                                                            {aiAnalysis.patientInfo.age}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 text-sm font-medium text-gray-700">
                                                            Gender
                                                        </td>
                                                        <td className="py-1 text-sm text-gray-900">
                                                            {aiAnalysis.patientInfo.gender}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-500">
                                                Vital Statistics
                                            </h4>
                                            <table className="mt-2 w-full">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-1 text-sm font-medium text-gray-700">
                                                            Blood Pressure
                                                        </td>
                                                        <td
                                                            className={`py-1 text-sm ${aiAnalysis.patientInfo.bloodPressure?.includes(
                                                                "High"
                                                            )
                                                                ? "text-red-600"
                                                                : "text-gray-900"
                                                                }`}
                                                        >
                                                            {aiAnalysis.patientInfo.bloodPressure || "N/A"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 text-sm font-medium text-gray-700">
                                                            Diabetic
                                                        </td>
                                                        <td
                                                            className={`py-1 text-sm ${aiAnalysis.patientInfo.diabetic === "Yes"
                                                                ? "text-red-600"
                                                                : "text-gray-900"
                                                                }`}
                                                        >
                                                            {aiAnalysis.patientInfo.diabetic || "N/A"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 text-sm font-medium text-gray-700">
                                                            Hyperthyroidism
                                                        </td>
                                                        <td
                                                            className={`py-1 text-sm ${aiAnalysis.patientInfo.hyperthyroidism === "Yes"
                                                                ? "text-red-600"
                                                                : "text-gray-900"
                                                                }`}
                                                        >
                                                            {aiAnalysis.patientInfo.hyperthyroidism || "N/A"}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-500">
                                                Key Health Indicators
                                            </h4>
                                            {aiAnalysis.patientInfo.keyIndicators ? (
                                                <table className="mt-2 w-full">
                                                    <tbody>
                                                        {Object.entries(
                                                            aiAnalysis.patientInfo.keyIndicators
                                                        ).map(([key, value]) => (
                                                            <tr key={key}>
                                                                <td className="py-1 text-sm font-medium text-gray-700">
                                                                    {key}
                                                                </td>
                                                                <td
                                                                    className={`py-1 text-sm ${value?.status === "abnormal"
                                                                        ? "text-red-600"
                                                                        : "text-gray-900"
                                                                        }`}
                                                                >
                                                                    {value?.value || "N/A"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="text-sm text-gray-500 mt-2">
                                                    No additional indicators available
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {aiAnalysis?.overallSummary && (
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                            />
                                        </svg>
                                        Comprehensive Health Summary
                                    </h3>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="whitespace-pre-line text-gray-700">
                                            {aiAnalysis.overallSummary}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Report Analyses */}
                            {Array.isArray(aiAnalysis?.reportAnalyses) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Detailed Report Analysis
                                    </h3>
                                    <div className="space-y-4">
                                        {aiAnalysis.reportAnalyses.map((report, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                                            >
                                                <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                                                    <h4 className="font-semibold text-gray-800">
                                                        {report.groupName}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        {report.reportUrls?.length > 0 && (
                                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                                {report.reportUrls.length} file(s)
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => handleExplainReport(report)}
                                                            className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center"
                                                        >
                                                            <svg
                                                                className="w-3 h-3 mr-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            Explain
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        <div className="lg:col-span-2">
                                                            <h5 className="text-md font-medium text-gray-700 mb-2">
                                                                Analysis Summary
                                                            </h5>
                                                            <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                                                                <p className="text-gray-700 whitespace-pre-line">
                                                                    {report.analysis}
                                                                </p>
                                                            </div>

                                                            {Array.isArray(report.warnings) &&
                                                                report.warnings.length > 0 && (
                                                                    <div className="mt-4">
                                                                        <h5 className="text-md font-medium text-red-600 mb-2 flex items-center">
                                                                            <svg
                                                                                className="w-4 h-4 mr-1"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                                                />
                                                                            </svg>
                                                                            Clinical Findings Requiring Attention
                                                                        </h5>
                                                                        <ul className="list-disc pl-5 space-y-1 text-red-600 bg-red-50 p-3 rounded-md">
                                                                            {report.warnings.map((warning, i) => (
                                                                                <li key={i} className="text-sm">
                                                                                    {warning}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                        </div>

                                                        {report.reportUrls?.length > 0 && (
                                                            <div>
                                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                                    Report Previews
                                                                </h5>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {report.reportUrls.slice(0, 4).map((url, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="rounded overflow-hidden shadow border border-gray-200"
                                                                        >
                                                                            <img
                                                                                src={url}
                                                                                alt={`Report ${idx + 1}`}
                                                                                className="object-cover w-full h-24 hover:opacity-80 transition-opacity cursor-pointer"
                                                                                onClick={() =>
                                                                                    window.open(url, "_blank")
                                                                                }
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    e.target.src = "/pdf-icon.png";
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {report.reportUrls.length > 4 && (
                                                                    <p className="text-xs text-gray-500 mt-2">
                                                                        + {report.reportUrls.length - 4} more files
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. Overall Summary */}


                            {/* 4. Doctor Recommendations */}
                            {Array.isArray(aiAnalysis?.doctorRecommendations) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                        Clinical Recommendations
                                    </h3>
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="divide-y divide-gray-200">
                                            {aiAnalysis.doctorRecommendations.map(
                                                (suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 mt-1">
                                                                <div
                                                                    className={`p-1 rounded-full ${index % 3 === 0
                                                                        ? "bg-blue-100"
                                                                        : index % 3 === 1
                                                                            ? "bg-green-100"
                                                                            : "bg-purple-100"
                                                                        }`}
                                                                >
                                                                    <svg
                                                                        className={`w-4 h-4 ${index % 3 === 0
                                                                            ? "text-blue-600"
                                                                            : index % 3 === 1
                                                                                ? "text-green-600"
                                                                                : "text-purple-600"
                                                                            }`}
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M5 13l4 4L19 7"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    {" "}
                                                                    {suggestion.replace(/^\\d+\\.\\s*/, "")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 5. Action Plan (if available) */}
                            {aiAnalysis?.actionPlan && (
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        Proposed Treatment Plan
                                    </h3>
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Action
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Details
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Timeline
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Priority
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {aiAnalysis.actionPlan.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {item.action}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {item.details}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.timeline}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2 py-1 text-xs rounded-full ${item.priority === "High"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : item.priority === "Medium"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-green-100 text-green-800"
                                                                    }`}
                                                            >
                                                                {item.priority}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Chat Interface
                        <div className="h-full flex flex-col">
                            <div className="flex-1 overflow-y-auto mb-4">
                                {explainingReport && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium text-blue-800">
                                                Discussing: {explainingReport.groupName}
                                            </h4>
                                            <button
                                                onClick={() => setExplainingReport(null)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Change topic
                                            </button>
                                        </div>
                                        <p className="text-sm text-blue-700 mt-1 line-clamp-2">
                                            {explainingReport.analysis.substring(0, 100)}...
                                        </p>
                                    </div>
                                )}

                                {chatMessages.length > 0 ? (
                                    <div className="space-y-4">
                                        {chatMessages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-3/4 rounded-lg px-4 py-3 ${message.sender === "user"
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-line">{message.text}</p>
                                                    <p className="text-xs mt-1 opacity-70">
                                                        {new Date(message.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                            />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                                            AI Medical Assistant
                                        </h3>
                                        <p className="mt-2 text-gray-500">
                                            Ask questions about the patient's reports or health
                                            condition.
                                        </p>
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => {
                                                    setChatMessages([
                                                        {
                                                            id: 1,
                                                            sender: "ai",
                                                            text: "Can you summarize the key findings from all reports?",
                                                            timestamp: new Date().toISOString(),
                                                        },
                                                    ]);
                                                }}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                                            >
                                                Summarize key findings
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setChatMessages([
                                                        {
                                                            id: 1,
                                                            sender: "ai",
                                                            text: "What are the most critical issues that need attention?",
                                                            timestamp: new Date().toISOString(),
                                                        },
                                                    ]);
                                                }}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                                            >
                                                Critical issues
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form
                                onSubmit={handleSendMessage}
                                className="border-t border-gray-200 pt-4"
                            >
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your question..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {activeTab === "analysis"
                            ? "AI-generated analysis - For professional review only"
                            : "AI assistant - May produce inaccurate information"}
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Close
                        </button>
                        {activeTab === "analysis" ? (
                            <button
                                onClick={() => setActiveTab("chat")}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md transition-colors flex items-center shadow-md hover:shadow-lg"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                                Chat with AI
                            </button>
                        ) : (
                            <button
                                onClick={() => setActiveTab("analysis")}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md transition-colors flex items-center shadow-md hover:shadow-lg"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Back to Analysis
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyzeAi;