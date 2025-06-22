import React, { useEffect, useState } from "react";
import { FileText, BarChart3, CheckCircle, AlertTriangle, Sparkles } from "lucide-react";

export default function ResumePanel({
  resumeText,
  setResumeText,
  onAnalyze,
  loading,
  feedback,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const feedbackRef = React.useRef(null);

  // Function to handle re-analyze with scroll
  const handleReAnalyze = () => {
    onAnalyze();
    // Set a small timeout to ensure the feedback is rendered before scrolling
    setTimeout(() => {
      if (feedbackRef.current) {
        feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: isMobile ? '16px' : '24px',
      marginBottom: '24px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '16px',
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <div style={{
          backgroundColor: '#ebf5ff',
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: isMobile ? '8px' : '0'
        }}>
          <FileText size={24} color="#3b82f6" />
        </div>
        <div>
          <h2 style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0
          }}>
            Resume Editor
          </h2>
          <p style={{
            fontSize: isMobile ? '13px' : '14px',
            color: '#64748b',
            margin: 0
          }}>
            Review and edit your resume text before analysis
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          marginBottom: '8px', 
          display: 'flex', 
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '4px' : '0'
        }}>
          <label style={{ 
            fontSize: isMobile ? '13px' : '14px', 
            fontWeight: '500', 
            color: '#475569' 
          }}>
            Resume Content
          </label>
          <span style={{ 
            fontSize: '12px', 
            color: '#94a3b8',
            textAlign: isMobile ? 'left' : 'right'
          }}>
            {resumeText.length} characters
          </span>
        </div>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={{
            width: '100%',
            minHeight: isMobile ? '180px' : '240px',
            maxHeight: isMobile ? '300px' : '400px',
            padding: isMobile ? '12px' : '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            fontSize: isMobile ? '14px' : '15px',
            lineHeight: '1.6',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            resize: 'vertical',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            outline: 'none',
            boxSizing: 'border-box',
            overflowY: 'auto',
            WebkitAppearance: 'none',
            appearance: 'none'
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

      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: resumeText.length < 100 ? '#fff1f2' : '#f0fdf4',
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: isMobile ? '12px' : '16px',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            {resumeText.length < 100 ? (
              <AlertTriangle size={16} color="#e11d48" />
            ) : (
              <CheckCircle size={16} color="#16a34a" />
            )}
            <span style={{ 
              fontSize: isMobile ? '12px' : '13px', 
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
            padding: isMobile ? '10px 16px' : '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: loading || resumeText.length < 100 ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            width: isMobile ? '100%' : 'auto',
            fontSize: isMobile ? '14px' : '16px'
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
              <BarChart3 size={isMobile ? 16 : 18} />
              Analyze Resume
            </>
          )}
        </button>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div style={{ marginTop: '32px' }} ref={feedbackRef}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: isMobile ? '16px' : '24px',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '16px',
              flexDirection: isMobile ? 'column' : 'row',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              <div style={{
                backgroundColor: '#ecfdf5',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: isMobile ? '8px' : '0'
              }}>
                <Sparkles size={24} color="#059669" />
              </div>
              <div>
                <h2 style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  AI Feedback & Analysis
                </h2>
                <p style={{
                  fontSize: isMobile ? '13px' : '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  Expert recommendations to improve your resume
                </p>
              </div>
            </div>
            
            <div 
              dangerouslySetInnerHTML={{ __html: feedback }}
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '24px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                overflowX: 'auto',
                maxWidth: '100%',
                boxSizing: 'border-box',
                fontSize: isMobile ? '14px' : '15px',
                marginBottom: '20px'
              }}
              className="feedback-container"
            />
            
            {/* Re-analyze button */}
            <p style={{
              fontSize: isMobile ? '13px' : '14px',
              color: '#6b7280',
              textAlign: 'center',
              margin: '8px 0 12px 0'
            }}>
              Made changes to your resume? Click below to get updated feedback.
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '8px'
            }}>
              <button
                onClick={handleReAnalyze}
                disabled={loading || resumeText.length < 100}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: loading ? '#94a3b8' : '#059669',
                  color: 'white',
                  fontWeight: '600',
                  padding: isMobile ? '10px 16px' : '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  fontSize: isMobile ? '14px' : '16px'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#047857';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  }
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
                    <span>Re-analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? 16 : 18} height={isMobile ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                      <path d="M21 3v5h-5"></path>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                      <path d="M8 16H3v5"></path>
                    </svg>
                    <span>Re-analyze Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}