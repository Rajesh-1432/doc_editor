import React, { useEffect } from 'react';

export default function Editor({ content, setContent, editorRef }) {
  useEffect(() => {
    const currentRef = editorRef.current;

    const handleInput = () => {
      if (currentRef) {
        setContent(currentRef.innerHTML);
      }
    };

    if (currentRef) {
      currentRef.addEventListener('input', handleInput);

      if (currentRef.innerHTML !== content) {
        currentRef.innerHTML = content;
      }
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('input', handleInput);
      }
    };
  }, [editorRef, content]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #editor table {
        width: 100%;
        border-collapse: collapse;
      }
      #editor th,
      #editor td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
      }
      #editor th {
        background-color: #f4f4f4;
      }

      #editor ul, #editor ol {
        padding-left: 1.5rem;
      }

      #editor li {
        margin-bottom: 0.25rem;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div
        id="editor"
        ref={editorRef}
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{
          minHeight: '100vh',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          outline: 'none',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#000', // base color
          fontFamily: 'sans-serif',
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

