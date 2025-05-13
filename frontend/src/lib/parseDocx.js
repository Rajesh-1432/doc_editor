import mammoth from 'mammoth';

export async function parseDocxFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value; // HTML string
  } catch (err) {
    console.error("Error reading DOCX file:", err);
    return "<p>Failed to load document.</p>";
  }
}

