// Renders a DOM element (a mounted CV template) to a multi-page A4 PDF and
// triggers a browser download. Mirrors CV_Builder's own handleDownloadCV logic.
export async function exportElementToPdf(element, filename) {
  if (!element) {
    throw new Error("Nothing to export: element not found.");
  }

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#ffffff",
    width: element.scrollWidth,
    height: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const totalPages = Math.ceil(imgHeight / pageHeight);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, -(page * pageHeight), imgWidth, imgHeight);
  }

  pdf.save(filename);
}
