import { useState, useEffect } from "react";
import Head from "next/head";
import { Upload, FileText, Sparkles, BarChart3, FileEdit, ClipboardCheck, Linkedin, Github, Globe, MessageSquare } from "lucide-react";
import ResumePanel from "../components/ResumePanel";
import CoverLetterGenerator from "../components/CoverLetterGenerator";
import MockInterviewGenerator from "../components/MockInterviewGenerator";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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
  const [activeTab, setActiveTab] = useState("resume-critique"); // "resume-critique", "cover-letter", or "mock-interview"

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
        
        // Auto-scroll to the analyze button on mobile devices after a short delay
        setTimeout(() => {
          // Check if it's a mobile device (screen width less than 768px)
          if (window.innerWidth < 768) {
            // Create a function to scroll to the resume panel
            const scrollToResumePanel = () => {
              const resumePanel = document.querySelector('.resume-panel');
              if (resumePanel) {
                resumePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            };
            
            // Execute the scroll after a short delay to ensure the panel is rendered
            setTimeout(scrollToResumePanel, 500);
          }
        }, 300);
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
      <Head>
        <title>CareerLaunch AI</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Smart Resume Review & Cover Letter Generator" />
      </Head>
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

        .tab-button {
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          background-color: rgba(37, 99, 235, 0.1);
        }

        .tab-button.active {
          background-color: rgba(37, 99, 235, 0.1);
        }

        @media (max-width: 768px) {
          .tab-container {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .tab-container::-webkit-scrollbar {
            display: none;
          }
          
          .tab-button {
            flex-shrink: 0;
            white-space: nowrap;
          }
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e8eaf6 100%)',
        padding: '16px',
        position: 'relative'
      }}>
        
        <div style={{
          maxWidth: '1024px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px',
            paddingTop: '32px'
          }}>
            <h1 style={{
              fontSize: isMobile ? '36px' : '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 16px 0',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div className="logo-container" style={{ display: 'inline-flex' }}>
                <img 
                  src="/logo.png" 
                  alt="CareerLaunch AI Logo" 
                  className="transparent-logo"
                  style={{
                    height: isMobile ? '60px' : '80px',
                    width: 'auto',
                    verticalAlign: 'middle'
                  }}
                />
              </div>
              CareerLaunch AI
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Get intelligent feedback on your resume with AI-powered analysis or generate personalized cover letters that highlight your matching skills. Upload your PDF to get started.
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

          {/* Tab Navigation */}
          {resumeText && (
            <div className="fade-in" style={{ marginBottom: '24px' }}>
              <div 
                className="tab-container"
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '12px 12px 0 0',
                  padding: isMobile ? '8px' : '12px',
                  gap: isMobile ? '4px' : '8px',
                  overflowX: isMobile ? 'auto' : 'visible',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <button
                  className={`tab-button ${activeTab === "resume-critique" ? 'active' : ''}`}
                  onClick={() => setActiveTab("resume-critique")}
                  style={{
                    padding: isMobile ? '10px 12px' : '12px 20px',
                    fontWeight: activeTab === "resume-critique" ? '600' : '500',
                    color: activeTab === "resume-critique" ? '#2563eb' : '#6b7280',
                    borderBottom: activeTab === "resume-critique" ? '2px solid #2563eb' : '2px solid transparent',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '14px' : '16px',
                    borderRadius: '8px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content'
                  }}
                >
                  <BarChart3 size={isMobile ? 16 : 18} />
                  <span>{isMobile ? 'Critique' : 'Resume Critique'}</span>
                </button>
                <button
                  className={`tab-button ${activeTab === "cover-letter" ? 'active' : ''}`}
                  onClick={() => setActiveTab("cover-letter")}
                  style={{
                    padding: isMobile ? '10px 12px' : '12px 20px',
                    fontWeight: activeTab === "cover-letter" ? '600' : '500',
                    color: activeTab === "cover-letter" ? '#2563eb' : '#6b7280',
                    borderBottom: activeTab === "cover-letter" ? '2px solid #2563eb' : '2px solid transparent',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '14px' : '16px',
                    borderRadius: '8px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content'
                  }}
                >
                  <FileEdit size={isMobile ? 16 : 18} />
                  <span>{isMobile ? 'Cover Letter' : 'Cover Letter Generator'}</span>
                </button>
                <button
                  className={`tab-button ${activeTab === "mock-interview" ? 'active' : ''}`}
                  onClick={() => setActiveTab("mock-interview")}
                  style={{
                    padding: isMobile ? '10px 12px' : '12px 20px',
                    fontWeight: activeTab === "mock-interview" ? '600' : '500',
                    color: activeTab === "mock-interview" ? '#2563eb' : '#6b7280',
                    borderBottom: activeTab === "mock-interview" ? '2px solid #2563eb' : '2px solid transparent',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '14px' : '16px',
                    borderRadius: '8px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content'
                  }}
                >
                  <MessageSquare size={isMobile ? 16 : 18} />
                  <span>{isMobile ? 'Interview' : 'Mock Interview'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Resume Panel */}
          {resumeText && activeTab === "resume-critique" && (
            <div className="fade-in resume-panel">
              <ResumePanel
                resumeText={resumeText}
                setResumeText={setResumeText}
                onAnalyze={analyzeResume}
                loading={loading}
              />
            </div>
          )}
          
          {/* Cover Letter Generator */}
          {resumeText && activeTab === "cover-letter" && (
            <div className="fade-in">
              <CoverLetterGenerator resumeText={resumeText} />
            </div>
          )}

          {/* Mock Interview Generator */}
          {resumeText && activeTab === "mock-interview" && (
            <div className="fade-in">
              <MockInterviewGenerator resumeText={resumeText} />
            </div>
          )}

          {/* Feedback Section */}
          {feedback && activeTab === "resume-critique" && (
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
                    margin: 0,
                    overflowX: 'auto',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {feedback}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {/* Contact Me Section */}
          <section style={{
            marginTop: '40px',
            padding: isMobile ? '16px 8px' : '24px 16px',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe, #dbeafe, #e0f2fe)',
            backgroundSize: '400% 400%',
            animation: 'subtleShift 15s ease infinite',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(to right, #2563eb, #7c3aed)'
            }}></div>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.05,
              pointerEvents: 'none'
            }}></div>
            <div style={{
              marginBottom: isMobile ? '12px' : '16px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <h2 style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '600',
                color: '#2563eb',
                margin: '0 0 4px 0',
                letterSpacing: '0.5px'
              }}>Made By</h2>
              
              <h3 style={{
                fontSize: isMobile ? '15px' : '17px',
                fontWeight: '600',
                color: '#111827',
                margin: '0',
                letterSpacing: '0.3px'
              }}>Joner De Silva</h3>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: isMobile ? '12px' : '16px',
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%'
            }}>
              {/* LinkedIn Link */}
              <a 
                href="https://www.linkedin.com/in/joner-de-silva-861575203/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="social-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: isMobile ? '14px' : '16px',
                  backgroundColor: '#0077b5',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                  width: 'auto',
                  justifyContent: 'center'
                }}
                onClick={(e) => {
                  // Try to open LinkedIn app on mobile
                  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    const linkedInAppUrl = "linkedin://profile/joner-de-silva-861575203";
                    const webUrl = "https://www.linkedin.com/in/joner-de-silva-861575203/";
                    
                    // Create a hidden iframe to try opening the app
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                    
                    // Set a timeout to redirect to web URL if app doesn't open
                    setTimeout(() => {
                      window.location.href = webUrl;
                    }, 500);
                    
                    // Try to open the app
                    iframe.src = linkedInAppUrl;
                    
                    // Prevent default link behavior
                    e.preventDefault();
                  }
                }}
              >
                <Linkedin size={isMobile ? 16 : 18} style={{ flexShrink: 0 }} />
                <span>LinkedIn</span>
              </a>
              
              {/* GitHub Link */}
              <a 
                href="https://github.com/yop-dev" 
                target="_blank" 
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="social-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: isMobile ? '14px' : '16px',
                  backgroundColor: '#24292e',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                  width: 'auto',
                  justifyContent: 'center'
                }}
              >
                <Github size={isMobile ? 16 : 18} style={{ flexShrink: 0 }} />
                <span>GitHub</span>
              </a>
              
              {/* Portfolio Link */}
              <a 
                href="https://portfolio-theta-two-19.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Personal Website"
                className="social-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: isMobile ? '14px' : '16px',
                  backgroundColor: '#4f46e5',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                  width: 'auto',
                  justifyContent: 'center'
                }}
              >
                <Globe size={isMobile ? 16 : 18} style={{ flexShrink: 0 }} />
                <span>Portfolio</span>
              </a>
            </div>
          </section>

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
              <span style={{ fontWeight: '600', color: '#2563eb' }}>Groq llama3-8b-8192</span>
            </div>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BarChart3 size={14} color="#4b5563" /> Resume Analysis
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileEdit size={14} color="#4b5563" /> Cover Letter Generation
              </span>
            </div>
            <p style={{ margin: 0 }}>
              &copy; {new Date().getFullYear()} CareerLaunch AI. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}