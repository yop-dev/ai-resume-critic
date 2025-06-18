import React from "react";

export default function ResumePanel({
  resumeText,
  setResumeText,
  onAnalyze,
  loading,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="font-semibold mb-2 text-lg text-gray-800">
        Extracted Resume Text
      </h2>
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows={10}
        className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <button
        onClick={onAnalyze}
        className={`w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
}