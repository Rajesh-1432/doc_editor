import React, { useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  PaintBucket,
  Table,
  Underline,
  ChevronDown,
  FileText,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';

export default function Toolbar({ editorRef, onFileContentLoaded }) {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('3');
  const [fileName, setFileName] = useState('');
  const [fileURL, setFileURL] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [originalFileType, setOriginalFileType] = useState('html');

  const handleSaveChanges = () => {
    // Get the current content from the editor
    const content = editorRef.current ? editorRef.current.innerHTML : '';

    // Create a blob with the content
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    setFileURL(url);

    // Show notification
    setShowNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileURL(URL.createObjectURL(file));
    setIsFileUploaded(true);

    // Store the original file type for export
    if (file.name.toLowerCase().endsWith('.docx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setOriginalFileType('docx');
    } else if (file.name.toLowerCase().endsWith('.doc') ||
      file.type === 'application/msword') {
      setOriginalFileType('doc');
    } else if (file.type === 'text/html' || file.name.toLowerCase().endsWith('.html')) {
      setOriginalFileType('html');
    } else {
      setOriginalFileType('html'); // Default fallback
    }

    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Read .docx files using mammoth.js
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;

        mammoth.convertToHtml({ arrayBuffer })
          .then((result) => {
            const htmlContent = result.value;

            // Send the HTML content to parent component (WordDocEditor)
            if (onFileContentLoaded) {
              onFileContentLoaded(htmlContent);
            }
          })
          .catch((err) => {
            console.error('Error parsing DOCX file:', err);
            alert('Failed to parse DOCX file.');
          });
      };
      reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer for mammoth
    } else if (file.type === 'text/html') {
      // For HTML files, just read as text
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        onFileContentLoaded?.(content);
      };
      reader.readAsText(file);
    } else {
      alert('Unsupported file type!');
    }
  };

  // Helper function to ensure selection is maintained
  const ensureFocus = () => {
    if (!editorRef.current) return false;

    // Make sure the editor has focus
    if (document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }

    return true;
  };

  // Apply formatting command
  const applyFormat = (command, value = null) => {
    if (!ensureFocus()) return;

    try {
      document.execCommand(command, false, value);
    } catch (error) {
      console.error(`Error executing command: ${command}`, error);
    }
  };

  // Format text as heading
  const handleHeadingFormat = (tag) => {
    if (!ensureFocus()) return;

    try {
      // Remove any existing block format first for consistent behavior
      document.execCommand('formatBlock', false, '<div>');
      // Then apply the requested format
      document.execCommand('formatBlock', false, tag);
    } catch (error) {
      console.error(`Error formatting heading: ${tag}`, error);
    }
  };

  // Insert table
  const insertTable = () => {
    if (!ensureFocus()) return;

    try {
      const rows = 3;
      const cols = 3;

      let tableHTML = '<table border="1" style="width:100%; border-collapse: collapse;">';
      for (let i = 0; i < rows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
          tableHTML += '<td style="padding: 8px; min-width: 50px; height: 24px;"></td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table><p></p>';

      document.execCommand('insertHTML', false, tableHTML);
    } catch (error) {
      console.error('Error inserting table', error);
    }
  };

  // Change font family
  const handleFontChange = (font) => {
    setFontFamily(font);
    if (ensureFocus()) {
      document.execCommand('fontName', false, font);
    }
  };

  // Change font size
  const handleFontSize = (size) => {
    setFontSize(size);
    if (ensureFocus()) {
      document.execCommand('fontSize', false, size);
    }
  };

  // Create a Word-compatible document
  const createWordDocument = (content) => {
    // Process content to fix line breaks and ensure proper paragraph formatting
    let processedContent = content;

    // Ensure all block elements have proper MS Office class
    processedContent = processedContent.replace(/<p(?![^>]*class=["']MsoNormal["'])/gi, '<p class="MsoNormal"');
    processedContent = processedContent.replace(/<div(?![^>]*class=["']MsoNormal["'])/gi, '<div class="MsoNormal"');

    // Ensure empty paragraphs are preserved (important for line spacing in Word)
    processedContent = processedContent.replace(/<p[^>]*>\s*<\/p>/gi, '<p class="MsoNormal">&nbsp;</p>');

    // Ensure line breaks are properly represented
    processedContent = processedContent.replace(/<br>/gi, '<br clear="all">');

    // Create a properly formatted HTML for Word compatibility
    const wordCompatibleHTML = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Export Document</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:TrackMoves/>
            <w:TrackFormatting/>
            <w:PunctuationKerning/>
            <w:ValidateAgainstSchemas/>
            <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
            <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
            <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
            <w:DoNotPromoteQF/>
            <w:LidThemeOther>EN-US</w:LidThemeOther>
            <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
            <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
            <w:Compatibility>
              <w:BreakWrappedTables/>
              <w:SnapToGridInCell/>
              <w:WrapTextWithPunct/>
              <w:UseAsianBreakRules/>
              <w:DontGrowAutofit/>
              <w:SplitPgBreakAndParaMark/>
              <w:EnableOpenTypeKerning/>
              <w:DontFlipMirrorIndents/>
              <w:OverrideTableStyleHps/>
            </w:Compatibility>
            <w:DoNotOptimizeForBrowser/>
            <m:mathPr>
              <m:mathFont m:val="Cambria Math"/>
              <m:brkBin m:val="before"/>
              <m:brkBinSub m:val="&#45;-"/>
              <m:smallFrac m:val="off"/>
              <m:dispDef/>
              <m:lMargin m:val="0"/>
              <m:rMargin m:val="0"/>
              <m:defJc m:val="centerGroup"/>
              <m:wrapIndent m:val="1440"/>
              <m:intLim m:val="subSup"/>
              <m:naryLim m:val="undOvr"/>
            </m:mathPr>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          /* Add Word-compatible styles */
          body {
            font-family: "${fontFamily}", Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 1in;
          }
          /* Additional Word-specific styles */
          p.MsoNormal, li.MsoNormal, div.MsoNormal {
            margin: 0in;
            margin-bottom: .0001pt;
            font-size: 12.0pt;
            font-family: "${fontFamily}",sans-serif;
            line-height: 1.5;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 12.0pt;
            margin-bottom: 6.0pt;
            font-family: "${fontFamily}",sans-serif;
            font-weight: bold;
          }
          h1 { font-size: 16.0pt; }
          h2 { font-size: 14.0pt; }
          h3 { font-size: 13.0pt; }
          
          table {
            border-collapse: collapse;
            width: 100%;
          }
          td, th {
            border: 1pt solid windowtext;
            padding: 5pt;
          }
          
          /* Fix list formatting */
          ul, ol {
            margin-top: 0in;
            margin-bottom: 0in;
          }
          
          /* Preserve whitespace */
          .preserve-whitespace {
            white-space: pre-wrap;
          }
          
          /* Add spacing after paragraphs */
          p {
            margin-bottom: 10pt;
          }
          
          /* Fix line breaks */
          br {
            mso-data-placement: same-cell;
          }
        </style>
      </head>
      <body>
        ${processedContent}
      </body>
      </html>
    `;

    return wordCompatibleHTML;
  };



  // Handle export with the latest changes
  const handleExport = () => {
    // Get the current content from the editor
    const content = editorRef.current ? editorRef.current.innerHTML : '';

    if (originalFileType === 'docx') {
      try {
        // Create Word-compatible HTML
        const wordDoc = createWordDocument(content);

        // For true DOCX compatibility, use .doc extension but with the correct MIME type
        const blob = new Blob([wordDoc], {
          type: "application/vnd.ms-word;charset=utf-8"
        });

        // Define filename with .doc extension
        const exportFileName = fileName.replace(/\.[^/.]+$/, "") + ".doc";

        // Use saveAs from file-saver to download the file
        saveAs(blob, exportFileName);
      } catch (error) {
        console.error("Export error:", error);
        alert("An error occurred during export. Please try again.");
      }
    } else {
      // For HTML and other formats, export as regular HTML
      const blob = new Blob([content], { type: "text/html;charset=utf-8" });
      const exportFileName = fileName || "document.html";
      saveAs(blob, exportFileName);
    }
  };


  return (
    <div className='flex flex-col items-center justify-between' >
      <div className="flex flex-wrap gap-2 p-2 border-b bg-white shadow items-center relative">
        {fileName && (
          <span className="text-sm text-gray-700 truncate max-w-xs">
            {fileName}
          </span>
        )}
        <div className="relative" title="Upload File">
          <label className="bg-blue-600 text-white text-sm px-3 py-1 rounded cursor-pointer hover:bg-blue-700">
            Import
            <input
              type="file"
              accept=".doc,.docx,.txt,.html"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {isFileUploaded && (
          <button
            onClick={handleSaveChanges}
            className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        )}

        {isFileUploaded && (
          <div className="relative group">
            <button
              onClick={handleExport}
              className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
              title="Download File"
            >
              Export
            </button>
          </div>
        )}

        
      </div>
      <div className="flex flex-wrap gap-2 p-2 border-b bg-white shadow items-center relative">
        <div className="flex items-center gap-2 mr-2">
          <div className="relative group">
            <button className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100">
              Format <ChevronDown size={14} />
            </button>
            <div className="absolute hidden group-hover:block z-10 bg-white border rounded shadow-lg w-40">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleHeadingFormat('<h1>')}
              >
                <Heading1 size={16} /> Heading 1
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleHeadingFormat('<h2>')}
              >
                <Heading2 size={16} /> Heading 2
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleHeadingFormat('<h3>')}
              >
                <Heading3 size={16} /> Heading 3
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleHeadingFormat('<p>')}
              >
                <FileText size={16} /> Normal text
              </button>
            </div>
          </div>

          <select
            value={fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>

          <select
            value={fontSize}
            onChange={(e) => handleFontSize(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-16"
          >
            <option value="1">8pt</option>
            <option value="2">10pt</option>
            <option value="3">12pt</option>
            <option value="4">14pt</option>
            <option value="5">18pt</option>
            <option value="6">24pt</option>
            <option value="7">36pt</option>
          </select>
        </div>

        <div className="flex items-center gap-1 border-l pl-2">
          <button
            onClick={() => applyFormat('bold')}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => applyFormat('underline')}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 border-l pl-2">
          <button
            onClick={() => applyFormat('justifyLeft')}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => applyFormat('justifyCenter')}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => applyFormat('justifyRight')}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 border-l pl-2">
          <button
            onClick={() => applyFormat('insertUnorderedList')}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => applyFormat('insertOrderedList')}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 border-l pl-2">
          <button
            onClick={insertTable}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Insert Table"
          >
            <Table size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 border-l pl-2">
          <div className="relative" title="Text Color">
            <label className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded">
              <PaintBucket size={16} />
              <input
                type="color"
                className="w-4 h-4 p-0 border-none cursor-pointer"
                onChange={(e) => applyFormat('foreColor', e.target.value)}
              />
            </label>
          </div>
        </div>

      </div>



      {/* Notification popup */}
      {showNotification && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-md z-50">
          Changes saved successfully!
        </div>
      )}
    </div>
  );
}




















