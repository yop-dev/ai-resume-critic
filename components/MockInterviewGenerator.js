import { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

// Function to format interview questions with proper spacing and styling
const formatInterviewQuestions = (text) => {
  if (!text) return '';
  
  // Split the text into sections based on the section headers
  const sections = [];
  
  // Use regex to find all section headers and split the content
  const sectionMatches = text.split(/\*\*([^*]+)\*\*/);
  
  // Process the split results
  for (let i = 1; i < sectionMatches.length; i += 2) {
    const sectionTitle = sectionMatches[i];
    const sectionContent = sectionMatches[i + 1] || '';
    
    sections.push({
      title: sectionTitle,
      content: sectionContent
    });
  }
  
  // Process each section
  let processedHtml = '';
  
  sections.forEach((section, index) => {
    if (section.title) {
      // Add section header
      processedHtml += `<div style="margin:${index === 0 ? '0' : '32px'} 0 20px;padding-bottom:10px;border-bottom:2px solid #4f46e5;background-color:#f5f3ff;padding:12px;border-radius:8px;">
        <h3 style="color:#4f46e5;font-size:20px;margin:0;font-weight:700;display:flex;align-items:center;">
          <span style="display:inline-block;width:6px;height:24px;background-color:#4f46e5;margin-right:10px;border-radius:3px;"></span>
          ${section.title}
        </h3>
      </div>`;
    }
    
    // Process content if there is any
    if (section.content) {
      // Handle bullet points
      let content = section.content.replace(/• ([^•\n]+)/g, 
        '<div style="display:flex;margin:12px 0;align-items:flex-start;padding:8px 0;">' +
          '<div style="color:#4f46e5;margin-right:10px;font-size:18px;">•</div>' +
          '<div style="flex:1;color:#4b5563;">$1</div>' +
        '</div>'
      );
      
      // Handle numbered questions
      const questionRegex = /(\d+)\.\s+([^\n]+)/g;
      let questionMatch;
      let lastQuestionIndex = 0;
      let processedContent = '';
      
      // Create a short section name for the badge
      let shortSectionName = '';
      if (section.title) {
        // Handle special cases for section names
        if (section.title.includes('TECHNICAL')) {
          shortSectionName = 'TECH';
        } else if (section.title.includes('EXPERIENCE')) {
          shortSectionName = 'EXP';
        } else if (section.title.includes('BEHAVIORAL')) {
          shortSectionName = 'BEHAV';
        } else if (section.title.includes('SITUATIONAL')) {
          shortSectionName = 'SCENARIO';
        } else if (section.title.includes('CAREER')) {
          shortSectionName = 'CAREER';
        } else if (section.title.includes('COMPANY') || section.title.includes('INDUSTRY')) {
          shortSectionName = 'INDUSTRY';
        } else if (section.title.includes('CLOSING')) {
          shortSectionName = 'CLOSING';
        } else {
          // Default to first word if no special case
          shortSectionName = section.title.split(' ')[0];
        }
      }
      
      while ((questionMatch = questionRegex.exec(content)) !== null) {
        // Add text before this question
        processedContent += content.substring(lastQuestionIndex, questionMatch.index);
        
        // Extract question number and text
        const number = questionMatch[1];
        const questionText = questionMatch[2];
        
        // Create a styled question with section badge
        // Choose a different color for each section type
        let badgeColor, badgeBg;
        if (shortSectionName === 'TECH') {
          badgeColor = '#1e40af';
          badgeBg = '#dbeafe';
        } else if (shortSectionName === 'EXP') {
          badgeColor = '#065f46';
          badgeBg = '#d1fae5';
        } else if (shortSectionName === 'BEHAV') {
          badgeColor = '#9333ea';
          badgeBg = '#f3e8ff';
        } else if (shortSectionName === 'SCENARIO') {
          badgeColor = '#b45309';
          badgeBg = '#fef3c7';
        } else if (shortSectionName === 'CAREER') {
          badgeColor = '#be123c';
          badgeBg = '#fee2e2';
        } else if (shortSectionName === 'INDUSTRY') {
          badgeColor = '#0369a1';
          badgeBg = '#e0f2fe';
        } else if (shortSectionName === 'CLOSING') {
          badgeColor = '#4f46e5';
          badgeBg = '#e0e7ff';
        } else {
          badgeColor = '#4338ca';
          badgeBg = '#e0e7ff';
        }
        
        processedContent += `<div style="display:flex;margin:20px 0;align-items:flex-start;background-color:#f8fafc;padding:12px;border-radius:8px;border-left:3px solid ${badgeColor};">
          <div style="display:flex;flex-direction:column;align-items:center;margin-right:12px;min-width:40px;">
            <div style="color:#4f46e5;font-weight:700;font-size:16px;">${number}.</div>
            ${section.title ? `<div style="background-color:${badgeBg};color:${badgeColor};font-size:10px;padding:3px 6px;border-radius:10px;margin-top:4px;white-space:nowrap;font-weight:600;letter-spacing:0.5px;">${shortSectionName}</div>` : ''}
          </div>
          <div style="flex:1;">${questionText}</div>
        </div>`;
        
        lastQuestionIndex = questionMatch.index + questionMatch[0].length;
      }
      
      // Add any remaining content
      if (lastQuestionIndex < content.length) {
        processedContent += content.substring(lastQuestionIndex);
      }
      
      // If we processed questions, use the processed content
      if (processedContent) {
        content = processedContent;
      }
      
      // Add paragraph spacing
      content = content.replace(/\n\n/g, '<div style="height:16px"></div>');
      
      processedHtml += content;
    }
  });
  
  return processedHtml;
};

export default function MockInterviewGenerator({ 
  resumeText, 
  jobDescription, 
  setJobDescription, 
  interviewQuestions, 
  setInterviewQuestions 
}) {
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
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
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
                  __html: formatInterviewQuestions(interviewQuestions)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}