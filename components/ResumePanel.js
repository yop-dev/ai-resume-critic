import React from "react";
import { FileText, BarChart3, CheckCircle, AlertTriangle } from "lucide-react";

export default function ResumePanel({
  resumeText,
  setResumeText,
  onAnalyze,
  loading,
}) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid rgba(226, 232, 240, 0.8)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '16px'
      }}>
        <div style={{
          backgroundColor: '#ebf5ff',
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FileText size={24} color="#3b82f6" />
        </div>
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0
          }}>
            Resume Editor
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Review and edit your resume text before analysis
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
            Resume Content
          </label>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            {resumeText.length} characters
          </span>
        </div>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={{
            width: '100%',
            minHeight: '240px',
            maxHeight: '400px',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            resize: 'vertical',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            outline: 'none',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#93c5fd';
            e.target.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.25)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
          placeholder="Your resume text appears here. Feel free to make any edits before analysis."
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: resumeText.length < 100 ? '#fff1f2' : '#f0fdf4',
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            {resumeText.length < 100 ? (
              <AlertTriangle size={16} color="#e11d48" />
            ) : (
              <CheckCircle size={16} color="#16a34a" />
            )}
            <span style={{ 
              fontSize: '13px', 
              color: resumeText.length < 100 ? '#e11d48' : '#16a34a'
            }}>
              {resumeText.length < 100 
                ? 'Resume text is too short for effective analysis' 
                : 'Resume text is ready for analysis'}
            </span>
          </div>
        </div>
        <button
          onClick={onAnalyze}
          disabled={loading || resumeText.length < 100}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: loading || resumeText.length < 100 ? '#94a3b8' : '#3b82f6',
            backgroundImage: loading || resumeText.length < 100 ? 'none' : 'linear-gradient(to right, #3b82f6, #2563eb)',
            color: 'white',
            fontWeight: '600',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: loading || resumeText.length < 100 ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseOver={(e) => {
            if (!loading && resumeText.length >= 100) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 size={18} />
              Analyze Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
}