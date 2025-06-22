import React, { useState } from "react";
import { FileText, Send, Copy, CheckCircle, Download } from "lucide-react";

export default function CoverLetterGenerator({ 
  resumeText, 
  jobDescription, 
  setJobDescription, 
  coverLetter, 
  setCoverLetter 
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
  
  const downloadAsTextFile = () => {
    // Create a Blob with the text content
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    
    // Trigger a click on the anchor element
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Completely revamped downloadAsPdf function using pure text rendering
  const downloadAsPdf = async () => {
    try {
      // Dynamically import jsPDF for text-based PDF generation
      const { jsPDF } = await import('jspdf');
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set up document properties
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 25; // 25mm margins
      const contentWidth = pageWidth - (margin * 2);
      
      // Set font
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      // Current Y position tracker
      let yPos = margin;
      
      // Add the date
      doc.text(formatDate(new Date()), margin, yPos);
      yPos += 10;
      
      // Process the cover letter content
      const paragraphs = coverLetter
        .split(/\n\s*\n/)
        .filter(p => p.trim().length > 0);
      
      // Text wrapping and pagination function
      const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
        // Split the text into words
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const testLine = line + (line ? ' ' : '') + word;
          const testWidth = doc.getStringUnitWidth(testLine) * doc.internal.getFontSize() / doc.internal.scaleFactor;
          
          if (testWidth > maxWidth) {
            // Add the current line
            doc.text(line, x, currentY);
            line = word;
            currentY += lineHeight;
            
            // Check if we need a new page
            if (currentY > pageHeight - margin) {
              doc.addPage();
              currentY = margin;
            }
          } else {
            line = testLine;
          }
        }
        
        // Add the last line
        if (line) {
          doc.text(line, x, currentY);
          currentY += lineHeight;
        }
        
        return currentY;
      };
      
      // Process each paragraph
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        
        // Handle signature lines differently
        if (paragraph.includes('Sincerely') || 
            paragraph.includes('Regards') || 
            paragraph.includes('Best regards') || 
            paragraph.includes('Yours')) {
          yPos += 5; // Add extra space before signature
        }
        
        // Process the paragraph with line wrapping
        yPos = addWrappedText(paragraph, margin, yPos, contentWidth, 6);
        
        // Add space between paragraphs
        yPos += 5;
        
        // Check if we need a new page for the next paragraph
        if (i < paragraphs.length - 1 && yPos > pageHeight - margin - 15) {
          doc.addPage();
          yPos = margin;
        }
      }
      
      // Save the PDF
      doc.save('cover-letter.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };
  
  // Helper function to format the current date
  const formatDate = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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
          {/* Header section with responsive design for mobile */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '16px',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '16px'
          }}>
            {/* Title section */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '16px'
            }}>
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
            
            {/* Action buttons with improved mobile layout */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'flex-start'
            }}>
              {/* Regenerate button */}
              <button
                onClick={() => generateCoverLetter()}
                disabled={loading}
                title="Generate a new version of the cover letter with different wording and style"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: loading ? '#94a3b8' : '#8b5cf6',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  minWidth: '110px',
                  flexGrow: 1,
                  maxWidth: '150px'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#7c3aed';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#8b5cf6';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Regenerating...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                      <path d="M21 3v5h-5"></path>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                      <path d="M8 16H3v5"></path>
                    </svg>
                    <span>Regenerate</span>
                  </>
                )}
              </button>

              {/* Copy button */}
              <button
                onClick={copyToClipboard}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  minWidth: '90px',
                  flexGrow: 1,
                  maxWidth: '120px'
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
              
              {/* Download PDF button */}
              <button
                onClick={downloadAsPdf}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  minWidth: '130px',
                  flexGrow: 1,
                  maxWidth: '160px'
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
            boxSizing: 'border-box',
            wordBreak: 'break-word' // Helps with mobile display
          }}>
            <div style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#334155',
              margin: 0,
              maxWidth: '100%'
            }}>
              {coverLetter.split('\n\n').map((paragraph, index) => {
                // Check if this is a signature line
                const isSignature = paragraph.includes('Sincerely') || 
                                   paragraph.includes('Regards') || 
                                   paragraph.includes('Best regards') || 
                                   paragraph.includes('Yours');
                
                return (
                  <p key={index} style={{
                    marginBottom: isSignature ? '0' : '16px',
                    marginTop: isSignature ? '24px' : '0',
                    padding: '0',
                    textAlign: 'left'
                  }}>
                    {paragraph.split('\n').map((line, lineIndex) => (
                      <React.Fragment key={lineIndex}>
                        {line}
                        {lineIndex < paragraph.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}