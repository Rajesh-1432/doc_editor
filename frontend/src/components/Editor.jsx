import React, { useEffect, useState, useCallback } from 'react';

export default function Editor({ content, setContent, editorRef, setHeadings }) {
  // State to track page dimensions
  const [pageStyle, setPageStyle] = useState({
    width: '8.5in',
    minHeight: '11in',
  });

  // Function to extract and process headings from content
  const extractHeadings = useCallback(() => {
    if (!editorRef.current) return [];
    
    const headingElements = editorRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headings = [];
    
    headingElements.forEach((element, index) => {
      // Generate a unique ID if none exists
      if (!element.id) {
        const headingText = element.textContent.trim();
        // Create a URL-friendly ID based on heading text
        let id = headingText
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with dashes
          .replace(/-+/g, '-'); // Replace multiple dashes with single dash
        
        // Add a suffix to ensure uniqueness
        id = `heading-${id}-${index}`;
        element.id = id;
      }
      
      headings.push({
        id: element.id,
        level: element.tagName.toLowerCase(),
        text: element.textContent.trim()
      });
    });
    
    return headings;
  }, [editorRef]);

  // Effect to update headings when content changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newHeadings = extractHeadings();
      setHeadings(newHeadings);
    });
    
    if (editorRef.current) {
      observer.observe(editorRef.current, { 
        childList: true, 
        subtree: true,
        characterData: true,
        attributes: true
      });
    }
    
    return () => observer.disconnect();
  }, [editorRef, extractHeadings, setHeadings]);

  // Effect to handle content updates and sync with state
  useEffect(() => {
    const currentRef = editorRef.current;
    
    const handleInput = () => {
      if (currentRef) {
        setContent(currentRef.innerHTML);
        
        // Update headings when content changes
        const newHeadings = extractHeadings();
        setHeadings(newHeadings);
      }
    };
    
    if (currentRef) {
      currentRef.addEventListener('input', handleInput);
      
      // Only update innerHTML if content has changed to avoid cursor jumping
      if (currentRef.innerHTML !== content) {
        currentRef.innerHTML = content;
        
        // Extract headings after content is set
        setTimeout(() => {
          const newHeadings = extractHeadings();
          setHeadings(newHeadings);
        }, 100);
      }
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('input', handleInput);
      }
    };
  }, [editorRef, content, setContent, extractHeadings, setHeadings]);
  
  // Effect to add comprehensive styling for imported documents
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Document Page Styling */
      #editor {
        background-color: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        margin: 0 auto;
        padding: 1in;
        font-family: 'Calibri', 'Arial', sans-serif;
        line-height: 1.5;
        color: #000;
        position: relative;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
      
      /* Scrolling behavior */
      #editor h1, #editor h2, #editor h3, #editor h4, #editor h5, #editor h6 {
        scroll-margin-top: 2rem;
      }
      
      /* Table Styling */
      #editor table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        page-break-inside: avoid;
        table-layout: fixed;
      }
      
      #editor th,
      #editor td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
        vertical-align: top;
        position: relative;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      #editor th {
        background-color: #f4f4f4;
        font-weight: bold;
      }
      
      /* Table of Contents */
      #editor .toc a {
        color: #0563C1;
        text-decoration: none;
      }
      
      #editor .toc a:hover {
        text-decoration: underline;
      }
      
      /* List Styling */
      #editor ul, #editor ol {
        padding-left: 2rem;
        margin: 1rem 0;
      }
      
      #editor ul {
        list-style-type: disc;
      }
      
      #editor ul ul {
        list-style-type: circle;
      }
      
      #editor ul ul ul {
        list-style-type: square;
      }
      
      #editor ol {
        list-style-type: decimal;
      }
      
      #editor ol ol {
        list-style-type: lower-alpha;
      }
      
      #editor ol ol ol {
        list-style-type: lower-roman;
      }
      
      #editor li {
        margin-bottom: 0.25rem;
      }
      
      /* Paragraph and Heading Styling */
      #editor p {
        margin-bottom: 1rem;
        line-height: 1.5;
      }
      
      #editor h1, #editor h2, #editor h3, #editor h4, #editor h5, #editor h6 {
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        line-height: 1.2;
        font-weight: bold;
        page-break-after: avoid;
      }
      
      #editor h1 {
        font-size: 1.5rem;
      }
      
      #editor h2 {
        font-size: 1.3rem;
      }
      
      #editor h3 {
        font-size: 1.17rem;
      }
      
      /* Alignment Classes */
      #editor .align-left {
        text-align: left;
      }
      
      #editor .align-center {
        text-align: center;
      }
      
      #editor .align-right {
        text-align: right;
      }
      
      #editor .align-justify {
        text-align: justify;
      }
      
      /* Indentation */
      #editor .indent-1 {
        margin-left: 1rem;
      }
      
      #editor .indent-2 {
        margin-left: 2rem;
      }
      
      #editor .indent-3 {
        margin-left: 3rem;
      }
      
      /* Images */
      #editor img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      
      /* Links */
      #editor a {
        color: #0563C1;
        text-decoration: none;
      }
      
      #editor a:hover {
        text-decoration: underline;
      }
      
      /* Font styling */
      #editor .bold, #editor strong, #editor b {
        font-weight: bold;
      }
      
      #editor .italic, #editor em, #editor i {
        font-style: italic;
      }
      
      #editor .underline {
        text-decoration: underline;
      }
      
      /* Blockquotes */
      #editor blockquote {
        border-left: 4px solid #ccc;
        margin: 1rem 0;
        padding-left: 1rem;
        color: #555;
        font-style: italic;
      }
      
      /* Special Formats */
      #editor .page-break {
        page-break-before: always;
      }
      
      /* Tables with specific layout */
      #editor table.layout-table {
        border: none;
        width: 100%;
      }
      
      #editor table.layout-table td {
        border: none;
        padding: 5px;
        vertical-align: top;
      }
      
      /* Fix for Word specific styles */
      #editor [style*="mso-"] {
        font-family: 'Calibri', 'Arial', sans-serif !important;
      }
      
      /* Table borders fixing */
      #editor table[border="1"] {
        border-collapse: collapse;
      }
      
      #editor table[border="1"] td {
        border: 1px solid #000;
      }
      
      /* Normal word styling */
      #editor .MsoNormal {
        margin-bottom: 8pt;
      }
      
      /* Headers */
      #editor .MsoHeading1 {
        font-size: 16pt;
        font-weight: bold;
      }
      
      #editor .MsoHeading2 {
        font-size: 14pt;
        font-weight: bold;
      }
      
      #editor .MsoHeading3 {
        font-size: 12pt;
        font-weight: bold;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Effect to post-process the imported content
  useEffect(() => {
    if (editorRef.current && content) {
      // Process after a short delay to ensure content is rendered
      setTimeout(() => {
        const editor = editorRef.current;
        
        // Fix table layouts
        const tables = editor.querySelectorAll('table');
        tables.forEach(table => {
          // Ensure tables have proper width
          if (!table.style.width) {
            table.style.width = '100%';
          }
          
          // Ensure table borders are visible
          if (!table.getAttribute('border')) {
            table.setAttribute('border', '1');
          }
          
          // Process table cells to ensure they have proper styling
          const cells = table.querySelectorAll('td, th');
          cells.forEach(cell => {
            // Fix borders
            cell.style.border = '1px solid #ccc';
            
            // Fix cell padding
            if (!cell.style.padding) {
              cell.style.padding = '8px';
            }
            
            // Handle alignment
            if (cell.align) {
              cell.classList.add(`align-${cell.align}`);
            }
          });
        });
        
        // Fix links
        const links = editor.querySelectorAll('a');
        links.forEach(link => {
          // Ensure href is preserved
          if (link.getAttribute('href')) {
            // Fix links styled by Word
            link.style.color = '#0563C1';
            link.style.textDecoration = 'none';
          }
        });
        
        // Fix images
        const images = editor.querySelectorAll('img');
        images.forEach(img => {
          // Ensure images have alt text
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Document image');
          }
          
          // Handle Word image dimensions
          if (img.style.width && img.style.width.includes('in')) {
            // Convert inch dimensions to pixels (roughly 96px per inch)
            const widthInInches = parseFloat(img.style.width);
            const heightInInches = parseFloat(img.style.height || '0');
            
            if (!isNaN(widthInInches)) {
              img.style.width = `${widthInInches * 96}px`;
            }
            
            if (!isNaN(heightInInches)) {
              img.style.height = `${heightInInches * 96}px`;
            }
          }
        });
        
        // Find and fix content alignment
        const paragraphs = editor.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6');
        paragraphs.forEach(p => {
          // Process alignment from inline styles
          const style = p.getAttribute('style') || '';
          
          if (style.includes('text-align:center') || style.includes('text-align: center')) {
            p.classList.add('align-center');
          } else if (style.includes('text-align:right') || style.includes('text-align: right')) {
            p.classList.add('align-right');
          } else if (style.includes('text-align:justify') || style.includes('text-align: justify')) {
            p.classList.add('align-justify');
          }
          
          // Process Word specific alignment
          if (p.classList.contains('MsoTitle') || p.classList.contains('MsoSubtitle')) {
            p.classList.add('align-center');
          }
        });
        
        // Detect and fix Table of Contents
        const tocLinks = editor.querySelectorAll('a[href^="#"]');
        if (tocLinks.length > 0) {
          // Find potential TOC container
          let tocSection = null;
          
          // Look for TOC header
          const headers = editor.querySelectorAll('h1, h2, h3, p');
          for (const header of headers) {
            if (header.textContent.toLowerCase().includes('table of contents') || 
                header.textContent.toLowerCase().includes('toc')) {
              tocSection = header.parentElement;
              break;
            }
          }
          
          if (tocSection) {
            tocSection.classList.add('toc');
            
            // Process TOC links
            const tocItems = tocSection.querySelectorAll('a[href^="#"]');
            tocItems.forEach(item => {
              item.style.color = '#0563C1';
              item.style.textDecoration = 'none';
              
              // Extract the target ID from the href
              const targetId = item.getAttribute('href').substring(1);
              
              // Find the corresponding heading
              const targetHeading = editor.querySelector(`#${targetId}`);
              if (!targetHeading) {
                // If the target heading doesn't exist, create an ID for an appropriate heading
                const headingText = item.textContent.trim();
                const potentialHeadings = Array.from(editor.querySelectorAll('h1, h2, h3, h4, h5, h6'))
                  .filter(h => h.textContent.trim() === headingText);
                
                if (potentialHeadings.length > 0) {
                  // Use the first matching heading
                  const heading = potentialHeadings[0];
                  const newId = targetId || `heading-${headingText.toLowerCase().replace(/[^\w]+/g, '-')}`;
                  heading.id = newId;
                  
                  // Update the link href
                  item.setAttribute('href', `#${newId}`);
                }
              }
            });
          }
        }
        
        // Process headings to ensure they have IDs for navigation
        const headings = editor.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
          if (!heading.id) {
            const headingText = heading.textContent.trim();
            const id = `heading-${headingText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${index}`;
            heading.id = id;
          }
        });
        
        // Detect page size from document
        // Look for common page sizes in document by analyzing content width
        const contentWidth = editor.scrollWidth;
        let detectedPageSize = 'letter'; // Default to letter size
        
        if (contentWidth > 800) {
          detectedPageSize = 'letter'; // 8.5" x 11"
        } else if (contentWidth > 600) {
          detectedPageSize = 'a4'; // 8.27" x 11.69"
        }
        
        // Set page dimensions based on detected size
        if (detectedPageSize === 'letter') {
          setPageStyle({
            width: '8.5in',
            minHeight: '11in',
          });
        } else if (detectedPageSize === 'a4') {
          setPageStyle({
            width: '8.27in',
            minHeight: '11.69in',
          });
        }
        
        // Update headings after processing
        const newHeadings = extractHeadings();
        setHeadings(newHeadings);
      }, 200);
    }
  }, [content, editorRef, extractHeadings, setHeadings]);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div
        id="editor"
        ref={editorRef}
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{
          width: pageStyle.width,
          minHeight: pageStyle.minHeight,
          backgroundColor: 'white',
          padding: '1in',
          borderRadius: '0.5rem',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          outline: 'none',
          fontSize: '12pt',
          lineHeight: '1.5',
          color: '#000',
          fontFamily: 'Calibri, Arial, sans-serif',
          margin: '0 auto',
        }}
        onPaste={(e) => {
          // Preserve formatting when pasting
          if (e.clipboardData && e.clipboardData.types.includes('text/html')) {
            const rawHtml = e.clipboardData.getData('text/html');
            
            // Skip this custom handling if it looks like Word content
            if (!rawHtml.includes('urn:schemas-microsoft-com:office:word')) {
              e.preventDefault();
              
              // Create temporary element to sanitize clipboard content
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = rawHtml;
              
              // Clean up some problematic styles but preserve structure
              const elements = tempDiv.querySelectorAll('*');
              elements.forEach(el => {
                // Remove potentially problematic attributes
                if (el.style && el.style.fontFamily) {
                  el.style.fontFamily = 'inherit';
                }
              });
              
              // Insert at cursor position using execCommand
              document.execCommand('insertHTML', false, tempDiv.innerHTML);
              
              // Update headings after paste
              setTimeout(() => {
                const newHeadings = extractHeadings();
                setHeadings(newHeadings);
              }, 100);
            }
          }
        }}
      />
    </div>
  );
}

// import React, { useEffect } from 'react';

// export default function Editor({ content, setContent, editorRef }) {
  

// useEffect(() => {
//   const currentRef = editorRef.current;

//   const handleInput = () => {
//     if (currentRef) {
//       setContent(currentRef.innerHTML);
//     }
//   };

//   if (currentRef) {
//     currentRef.addEventListener('input', handleInput);

//     // Update editor content only if it's different from the new content
//     if (currentRef.innerHTML !== content) {
//       currentRef.innerHTML = content;
//     }
//   }

//   return () => {
//     if (currentRef) {
//       currentRef.removeEventListener('input', handleInput);
//     }
//   };
// }, [editorRef, content]); // <-- Add 'content' here


//   return (
//     <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
//       <div
//         id="editor"
//         ref={editorRef}
//         contentEditable="true"
//         suppressContentEditableWarning={true}
//         className="prose max-w-4xl mx-auto min-h-screen bg-white shadow-md rounded-lg p-8 outline-none"
//         style={{
//           resize: 'none',
//         }}
//       />
//     </div>
//   );
// }

