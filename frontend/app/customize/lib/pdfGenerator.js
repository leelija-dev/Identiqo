// app/customize/lib/pdfGenerator.js
export async function generatePDF(frontCanvas, backCanvas, orientation) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    orientation: orientation === 'portrait' ? 'portrait' : 'landscape',
    unit: 'px',
    format: [frontCanvas.width, frontCanvas.height],
  });
  pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, frontCanvas.width, frontCanvas.height);
  pdf.addPage([backCanvas.width, backCanvas.height]);
  pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, backCanvas.width, backCanvas.height);
  return pdf;
}