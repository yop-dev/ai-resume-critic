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
  
  // Define the consistent text color to use throughout
  const textColor = '#4b5563';
  
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
      
      // Add section header with mobile-friendly styling
      processedHtml += `<div style="margin:${index === 0 ? '0' : '24px'} 0 16px;padding-bottom:8px;border-bottom:2px solid ${sectionColor};background-color:#f5f3ff;padding:10px;border-radius:8px;">
        <h3 style="color:${sectionColor};font-size:clamp(16px, 5vw, 20px);margin:0;font-weight:700;display:flex;align-items:center;">
          <span style="display:inline-block;width:4px;height:20px;background-color:${sectionColor};margin-right:8px;border-radius:2px;"></span>
          ${section.title}
        </h3>
      </div>`;
    }
    
    // Process content if there is any
    if (section.content) {
      // Ensure consistent text color for all sections
      let sectionContent = section.content;
      
      // Special handling for sections that often have black text
      if (section.title.includes('OVERALL ASSESSMENT') || 
          section.title.includes('FORMATTING & PRESENTATION') || 
          section.title.includes('CONTENT OPTIMIZATION') || 
          section.title.includes('RED FLAGS')) {
        // Wrap the entire content in a span with the correct color
        sectionContent = `<div style="color:#4b5563;font-weight:normal;">${sectionContent}</div>`;
      }
      // Handle bullet points with mobile-friendly sizing and consistent text styling
      let content = sectionContent.replace(/• ([^•\n]+)/g, 
        '<div style="display:flex;margin:10px 0;align-items:flex-start;padding:6px 0;">' +
          '<div style="color:#4f46e5;margin-right:8px;font-size:clamp(16px, 4vw, 18px);font-weight:600;">•</div>' +
          '<div style="flex:1;color:#4b5563;font-size:clamp(13px, 4vw, 15px);font-weight:normal;">$1</div>' +
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
        
        // Create a styled numbered item with mobile-friendly sizing and consistent text styling
        processedContent += `<div style="display:flex;margin:16px 0;align-items:flex-start;background-color:#f8fafc;padding:clamp(8px, 3vw, 12px);border-radius:8px;border-left:3px solid ${itemColor};">
          <div style="margin-right:8px;min-width:24px;text-align:center;">
            <div style="color:${itemColor};font-weight:600;font-size:clamp(14px, 4vw, 16px);">${number}.</div>
          </div>
          <div style="flex:1;color:#4b5563;font-size:clamp(13px, 4vw, 15px);font-weight:normal;">${itemText}</div>
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
      
      // Special handling for sections that need better formatting
      if (section.title.includes('SECTION-BY-SECTION ANALYSIS') || 
          section.title.includes('FORMATTING & PRESENTATION') || 
          section.title.includes('CONTENT OPTIMIZATION') ||
          section.title.includes('SPECIFIC RECOMMENDATIONS')) {
        
        // First, handle subsection headers
        content = content.replace(/\*([^*:]+):\*/g, (match, subsection) => {
          return `<div style="margin:18px 0 10px;font-weight:600;color:#1f2937;font-size:clamp(15px, 4vw, 18px);border-bottom:1px solid #e2e8f0;padding-bottom:6px;">${subsection}:</div>`;
        });
        
        // Then, split the content by subsection headers to process each subsection separately
        const subsectionRegex = /<div style="margin:18px 0 10px[^>]+>([^<]+):<\/div>/g;
        let lastIndex = 0;
        let processedSubsections = '';
        let match;
        
        while ((match = subsectionRegex.exec(content)) !== null) {
          const fullMatch = match[0];
          const subsectionTitle = match[1];
          const startIndex = match.index;
          
          // Add content before this subsection header
          if (startIndex > lastIndex) {
            processedSubsections += content.substring(lastIndex, startIndex);
          }
          
          // Add the subsection header
          processedSubsections += fullMatch;
          
          // Find the next subsection header or the end of content
          const nextMatch = subsectionRegex.exec(content);
          subsectionRegex.lastIndex = match.index + match[0].length; // Reset regex to continue from after current match
          
          const endIndex = nextMatch ? nextMatch.index : content.length;
          
          // Extract and process the subsection content
          let subsectionContent = content.substring(startIndex + fullMatch.length, endIndex);
          
          // Format the subsection content as bullet points
          if (subsectionContent.trim()) {
            // Check if this is the SPECIFIC RECOMMENDATIONS section which often has numbered points
            const isNumberedSection = section.title.includes('SPECIFIC RECOMMENDATIONS');
            
            // Split by periods or line breaks to create bullet points
            const points = subsectionContent
              .replace(/\.\s+/g, '.\n')  // Add line breaks after periods
              .split(/\n+/)              // Split by line breaks
              .filter(point => point.trim().length > 0);  // Remove empty lines
            
            if (points.length > 0) {
              processedSubsections += '<ul style="list-style-type:none;padding-left:0;margin-top:8px;">';
              
              points.forEach((point, idx) => {
                if (point.trim()) {
                  // Check if the point starts with a number (for SPECIFIC RECOMMENDATIONS)
                  const numberMatch = point.match(/^(\d+)\.\s+(.*)/);
                  
                  if (isNumberedSection && numberMatch) {
                    // This is a numbered point
                    const number = numberMatch[1];
                    const text = numberMatch[2];
                    
                    processedSubsections += `
                      <li style="display:flex;margin:12px 0;align-items:flex-start;background-color:#f8fafc;padding:clamp(8px, 3vw, 12px);border-radius:8px;border-left:3px solid #6b46c1;">
                        <span style="color:#6b46c1;font-weight:600;margin-right:8px;min-width:24px;text-align:center;font-size:clamp(14px, 4vw, 16px);">${number}.</span>
                        <span style="flex:1;color:#4b5563;font-size:clamp(13px, 4vw, 15px);font-weight:normal;">${text.trim()}</span>
                      </li>`;
                  } else {
                    // Regular bullet point
                    processedSubsections += `
                      <li style="display:flex;margin:8px 0;align-items:flex-start;">
                        <span style="color:#4f46e5;margin-right:8px;font-weight:600;">•</span>
                        <span style="flex:1;color:#4b5563;font-size:clamp(13px, 4vw, 15px);font-weight:normal;">${point.trim()}</span>
                      </li>`;
                  }
                }
              });
              
              processedSubsections += '</ul>';
            }
          }
          
          lastIndex = endIndex;
        }
        
        // Add any remaining content
        if (lastIndex < content.length) {
          processedSubsections += content.substring(lastIndex);
        }
        
        content = processedSubsections;
      } else {
        // For other sections, just format subsection headers normally
        content = content.replace(/\*([^*:]+):\*/g, 
          '<div style="margin:18px 0 10px;font-weight:600;color:#1f2937;font-size:clamp(15px, 4vw, 18px);border-bottom:1px solid #e2e8f0;padding-bottom:6px;">$1:</div>'
        );
      }
      
      // Add paragraph spacing
      content = content.replace(/\n\n/g, '<div style="height:16px"></div>');
      
      // Handle regular paragraphs with mobile-friendly sizing and consistent text styling
      if (!content.includes('<div') && content.trim()) {
        content = `<p style="margin:10px 0;color:#4b5563;line-height:1.6;font-size:clamp(13px, 4vw, 15px);font-weight:normal;">${content}</p>`;
      }
      
      processedHtml += content;
    }
  });
  
  return processedHtml;
}