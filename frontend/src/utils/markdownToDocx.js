import htmlDocx from 'html-docx-js';

export function exportAsDocx(htmlContent) {
  const converted = htmlDocx.asBlob(htmlContent);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(converted);
  link.download = 'document.docx';
  link.click();
}
