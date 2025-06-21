import { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function MockInterviewGenerator({ resumeText }) {
  const [jobDescription, setJobDescription] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateMockInterview = async () => {
    if (!resumeText) {
      setError('Please upload your resume first.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-mock-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resumeText, 
          jobDescription 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate mock interview questions');
      }

      setInterviewQuestions(data.questions);
    } catch (err) {
      console.error('Error generating mock interview:', err);
      setError(err.message || 'Failed to generate mock interview questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '8px',
            background: 'linear-gradient(to right, #dbeafe, #ede9fe)',
            borderRadius: '8px'
          }}>
            <MessageSquare size={20} color="#4f46e5" />
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>
            Mock Interview Generator
          </h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#4b5563', marginBottom: '16px' }}>
            Generate realistic interview questions based on your resume and the job description you're applying for.
          </p>
          
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#4b5563'
          }}>
            Job Description (optional)
          </label>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <textarea
              placeholder="Paste the job description here to get more targeted interview questions..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                minHeight: '120px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button
            onClick={generateMockInterview}
            disabled={loading || !resumeText}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: loading ? '#9ca3af' : 'linear-gradient(to right, #4f46e5, #7c3aed)',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            className="upload-button"
          >
            {loading ? (
              <>
                <div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Mock Interview
              </>
            )}
          </button>
          
          {error && (
            <p style={{ color: '#ef4444', marginTop: '8px', fontSize: '14px' }}>
              {error}
            </p>
          )}
        </div>

        {interviewQuestions && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={16} color="#4f46e5" />
              Interview Questions
            </h3>
            
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div 
                className="interview-questions-content"
                style={{
                  color: '#374151',
                  lineHeight: '1.6',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '15px',
                  margin: 0,
                  overflowX: 'auto',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: interviewQuestions
                    // Convert section headers to styled HTML
                    .replace(/\*\*([^*]+)\*\*/g, 
                      '<div style="margin:24px 0 16px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">' +
                        '<h3 style="color:#4f46e5;font-size:18px;margin:0;font-weight:600;display:flex;align-items:center;">' +
                          '<span style="display:inline-block;width:4px;height:18px;background-color:#4f46e5;margin-right:8px;border-radius:2px;"></span>' +
                          '$1' +
                        '</h3>' +
                      '</div>'
                    )
                    // Style bullet points
                    .replace(/• ([^•\n]+)/g, 
                      '<div style="display:flex;margin:10px 0;align-items:flex-start;">' +
                        '<div style="color:#4f46e5;margin-right:8px;font-size:18px;">•</div>' +
                        '<div style="flex:1;">$1</div>' +
                      '</div>'
                    )
                    // Add paragraph spacing
                    .replace(/\n\n/g, '<div style="height:16px"></div>')
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}