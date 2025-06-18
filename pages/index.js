import { useState } from "react";
import { Upload, FileText, Sparkles, BarChart3 } from "lucide-react";

// Mock ResumePanel component since we don't have the original
const ResumePanel = ({ resumeText, setResumeText, onAnalyze, loading }) => (
  <div style={{
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '24px',
    marginBottom: '24px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <FileText size={20} color="#2563eb" />
      <h3 style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>Resume Preview</h3>
    </div>
    <div style={{ marginBottom: '16px' }}>
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        style={{
          width: '100%',
          height: '128px',
          padding: '12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          resize: 'none',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px'
        }}
        placeholder="Your resume text will appear here..."
      />
    </div>
    <button
      onClick={onAnalyze}
      disabled={loading}
      style={{
        width: '100%',
        background: loading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #7c3aed)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: '600',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '16px'
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid white',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Analyzing...
        </>
      ) : (
        <>
          <BarChart3 size={20} />
          Analyze Resume
        </>
      )}
    </button>
  </div>
);

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: base64 }),
        });
        if (!res.ok) throw new Error("Failed to extract text from PDF.");
        const data = await res.json();
        setResumeText(data.text);
      } catch (err) {
        alert(err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      if (!res.ok) throw new Error("Failed to analyze resume.");
      const data = await res.json();
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .upload-button:hover {
          background: linear-gradient(to right, #1d4ed8, #6d28d9) !important;
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .upload-area {
          transition: all 0.3s ease;
        }
        
        .upload-area:hover {
          border-color: #60a5fa;
          background-color: rgba(239, 246, 255, 0.5);
        }
        
        .upload-area.drag-over {
          border-color: #2563eb;
          background-color: rgba(219, 234, 254, 0.5);
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e8eaf6 100%)',
        padding: '16px'
      }}>
        <div style={{
          maxWidth: '1024px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px',
            paddingTop: '32px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                padding: '12px',
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <Sparkles size={32} color="white" />
              </div>
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              AI Resume Critic
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '18px',
              maxWidth: '512px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Get intelligent feedback on your resume with AI-powered analysis. Upload your PDF and discover areas for improvement.
            </p>
          </div>

          {/* Upload Section */}
          <div style={{ marginBottom: '32px' }}>
            <div
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              style={{
                position: 'relative',
                border: '2px dashed #d1d5db',
                borderRadius: '16px',
                padding: '32px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(to right, #dbeafe, #e9d5ff)',
                    borderRadius: '50%'
                  }}>
                    <Upload size={48} color="#2563eb" />
                  </div>
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Upload Your Resume
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '24px',
                  fontSize: '16px'
                }}>
                  Drag and drop your PDF file here, or click to browse
                </p>
                <label
                  className="upload-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontWeight: '600',
                    fontSize: '16px',
                    border: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Upload size={20} />
                  Choose PDF File
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Resume Panel */}
          {resumeText && (
            <div className="fade-in">
              <ResumePanel
                resumeText={resumeText}
                setResumeText={setResumeText}
                onAnalyze={analyzeResume}
                loading={loading}
              />
            </div>
          )}

          {/* Feedback Section */}
          {feedback && (
            <div className="fade-in" style={{ marginBottom: '32px' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    padding: '8px',
                    background: 'linear-gradient(to right, #dcfce7, #dbeafe)',
                    borderRadius: '8px'
                  }}>
                    <Sparkles size={20} color="#059669" />
                  </div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    AI Feedback & Analysis
                  </h2>
                </div>
                <div>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    color: '#374151',
                    lineHeight: '1.6',
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #2563eb',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    {feedback}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            paddingTop: '32px',
            paddingBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span>Powered by</span>
              <span style={{ fontWeight: '600', color: '#2563eb' }}>Ollama Mistral</span>
            </div>
            <p style={{ margin: 0 }}>
              &copy; {new Date().getFullYear()} AI Resume Critic. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}