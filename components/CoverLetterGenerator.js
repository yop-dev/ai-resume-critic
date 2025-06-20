import React, { useState, useEffect } from "react";
import { FileText, Send, Copy, CheckCircle, Download } from "lucide-react";

export default function CoverLetterGenerator({ resumeText }) {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [html2pdf, setHtml2pdf] = useState(null);
  
  useEffect(() => {
    // Dynamically import html2pdf.js on the client side
    import('html2pdf.js').then(module => {
      setHtml2pdf(() => module.default);
    });
  }, []);

  const generateCoverLetter = async () => {
    if (!resumeText || !jobDescription) {
      alert("Please provide both resume and job description");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate cover letter");
      }

      const data = await res.json();
      setCoverLetter(data.coverLetter);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const downloadAsPdf = () => {
    if (!html2pdf) {
      alert("PDF generator is still loading. Please try again in a moment.");
      return;
    }
    
    // Create a styled HTML element with the cover letter content
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <h1 style="font-size: 24px; color: #2563eb; margin-bottom: 20px;">Cover Letter</h1>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 30px;">
          ${new Date().toLocaleDateString()}
        </div>
        <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
          ${coverLetter.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
    
    // PDF generation options
    const options = {
      margin: 10,
      filename: 'cover-letter.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate and download the PDF
    html2pdf().from(element).set(options).save();
  };

  return (
    <div style={{ marginBottom: '24px' }}>
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
            backgroundColor: '#f3e8ff',
            borderRadius: '12px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={24} color="#8b5cf6" />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0
            }}>
              Job Description
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0
            }}>
              Paste the job description to generate a tailored cover letter
            </p>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
              Job Details
            </label>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {jobDescription.length} characters
            </span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            style={{
              width: '100%',
              minHeight: '200px',
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
              e.target.style.borderColor = '#d8b4fe';
              e.target.style.boxShadow = '0 0 0 3px rgba(216, 180, 254, 0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <button
          onClick={generateCoverLetter}
          disabled={loading || !resumeText || !jobDescription}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '8px',
            backgroundColor: loading || !resumeText || !jobDescription ? '#94a3b8' : '#8b5cf6',
            backgroundImage: loading || !resumeText || !jobDescription ? 'none' : 'linear-gradient(to right, #8b5cf6, #6d28d9)',
            color: 'white',
            fontWeight: '600',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: loading || !resumeText || !jobDescription ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseOver={(e) => {
            if (!loading && resumeText && jobDescription) {
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
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span>Generating Cover Letter...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Generate Cover Letter</span>
            </>
          )}
        </button>
      </div>

      {coverLetter && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '24px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                backgroundColor: '#ecfdf5',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={24} color="#10b981" />
              </div>
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Your Cover Letter
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  Tailored based on your resume and the job description
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={copyToClipboard}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e2e8f0';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f1f5f9';
                }}
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} color="#10b981" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} color="#64748b" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <button
                onClick={downloadAsPdf}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#0ea5e9',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#0284c7';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#0ea5e9';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
              >
                <Download size={16} color="white" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981',
            overflowX: 'auto',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#334155',
              margin: 0,
              overflowX: 'auto',
              maxWidth: '100%'
            }}>
              {coverLetter}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}