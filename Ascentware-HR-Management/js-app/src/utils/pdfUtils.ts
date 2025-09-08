import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generate optimized PDF Blob under ~2MB
 */
export async function generatePdfBlob(element: HTMLElement): Promise<Blob> {
  // Capture the element as a canvas
  const canvas = await html2canvas(element, {
    scale: 2, // lower scale = smaller file
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/jpeg"); // use JPEG + quality

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
  // const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

  const blob = pdf.output("blob");

  return blob;
}
