// Function to format resume feedback with a style similar to mock interview questions
export function formatResumeFeedback(text) {
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
      // Determine section color based on title
      let sectionColor = '#4f46e5'; // Default purple
      
      if (section.title.includes('OVERALL ASSESSMENT')) {
        sectionColor = '#2b6cb0'; // Blue
      } else if (section.title.includes('STRENGTHS')) {
        sectionColor = '#2c7a7b'; // Teal
      } else if (section.title.includes('CRITICAL') || section.title.includes('RED FLAGS')) {
        sectionColor = '#c05621'; // Orange
      } else if (section.title.includes('SPECIFIC RECOMMENDATIONS')) {
        sectionColor = '#6b46c1'; // Purple
      }
      
      // Add section header
      processedHtml += `<div style="margin:${index === 0 ? '0' : '32px'} 0 20px;padding-bottom:10px;border-bottom:2px solid ${sectionColor};background-color:#f5f3ff;padding:12px;border-radius:8px;">
        <h3 style="color:${sectionColor};font-size:20px;margin:0;font-weight:700;display:flex;align-items:center;">
          <span style="display:inline-block;width:6px;height:24px;background-color:${sectionColor};margin-right:10px;border-radius:3px;"></span>
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
      
      // Handle numbered lists
      const numberRegex = /(\d+)\.\s+([^\n]+)/g;
      let numberMatch;
      let lastNumberIndex = 0;
      let processedContent = '';
      
      // Determine section color for numbered items
      let itemColor = '#4f46e5'; // Default purple
      
      if (section.title.includes('OVERALL ASSESSMENT')) {
        itemColor = '#2b6cb0'; // Blue
      } else if (section.title.includes('STRENGTHS')) {
        itemColor = '#2c7a7b'; // Teal
      } else if (section.title.includes('CRITICAL') || section.title.includes('RED FLAGS')) {
        itemColor = '#c05621'; // Orange
      } else if (section.title.includes('SPECIFIC RECOMMENDATIONS')) {
        itemColor = '#6b46c1'; // Purple
      }
      
      while ((numberMatch = numberRegex.exec(content)) !== null) {
        // Add text before this number
        processedContent += content.substring(lastNumberIndex, numberMatch.index);
        
        // Extract number and text
        const number = numberMatch[1];
        const itemText = numberMatch[2];
        
        // Create a styled numbered item
        processedContent += `<div style="display:flex;margin:20px 0;align-items:flex-start;background-color:#f8fafc;padding:12px;border-radius:8px;border-left:3px solid ${itemColor};">
          <div style="margin-right:12px;min-width:28px;text-align:center;">
            <div style="color:${itemColor};font-weight:700;font-size:16px;">${number}.</div>
          </div>
          <div style="flex:1;color:#4b5563;">${itemText}</div>
        </div>`;
        
        lastNumberIndex = numberMatch.index + numberMatch[0].length;
      }
      
      // Add any remaining content
      if (lastNumberIndex < content.length) {
        processedContent += content.substring(lastNumberIndex);
      }
      
      // If we processed numbered items, use the processed content
      if (processedContent) {
        content = processedContent;
      }
      
      // Format subsection headers
      content = content.replace(/\*([^*:]+):\*/g, 
        '<div style="margin:20px 0 12px;font-weight:600;color:#1f2937;font-size:18px;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">$1:</div>'
      );
      
      // Add paragraph spacing
      content = content.replace(/\n\n/g, '<div style="height:16px"></div>');
      
      // Handle regular paragraphs
      if (!content.includes('<div') && content.trim()) {
        content = `<p style="margin:12px 0;color:#4b5563;line-height:1.6;">${content}</p>`;
      }
      
      processedHtml += content;
    }
  });
  
  return processedHtml;
}