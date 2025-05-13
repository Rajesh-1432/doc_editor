import React, { useState, useRef, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import Sider from '../components/Sider';
import Editor from '../components/Editor';


export default function WordDocEditor() {
  // Initialize with a simple placeholder
  const [content, setContent] = useState('<p>Start typing your document here...</p>');
  const [headings, setHeadings] = useState([]);
  const editorRef = useRef(null);

  // Update headings when editor content changes
 useEffect(() => {
  const extractHeadings = () => {
    if (!editorRef.current) return;

    const headingElements = editorRef.current.querySelectorAll('h1, h2, h3, h4');

    const newHeadings = Array.from(headingElements).map((element, index) => {
      if (!element.id) {
        element.id = `heading-${index}`;
      }

      return {
        level: element.tagName.toLowerCase(),
        text: element.textContent || '(Untitled)',
        id: element.id
      };
    });

    setHeadings(newHeadings);
  };

  const timeout = setTimeout(() => {
    extractHeadings();
  }, 100); // Delay to ensure DOM has updated

  return () => clearTimeout(timeout);
}, [content]); // Re-run whenever content changes

const handleFileContentLoaded = (htmlContent) => {
  setContent(htmlContent);
  // No need to manually extract headings here now
};

  return (
    <div className="flex h-full">
      <Sider headings={headings} />
      <div className="flex flex-col flex-1">
        <Toolbar 
          editorRef={editorRef} 
          onFileContentLoaded={handleFileContentLoaded} 
            content={content}
        />
        <Editor content={content} setContent={setContent} editorRef={editorRef} />
      </div>
    </div>
  );
}


