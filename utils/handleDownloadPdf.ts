import jsPDF from "jspdf";
// @ts-expect-error: No types available for 'dom-to-image-more'
import domtoimage from "dom-to-image-more";

export const handleDownloadPDF = async (elementId: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  try {
    // Get PNG data URL of the DOM node
    const dataUrl = await domtoimage.toPng(input, {
      bgcolor: "#ffffff",
      cacheBust: true,
      style: {
        backgroundColor: "#ffffff",
      },
    });

    // Create an image and wait for it to load to get dimensions
    const img = new window.Image();
    img.src = dataUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate image size to fit A4 page, preserving aspect ratio
    let imgWidth = pageWidth;
    let imgHeight = (img.height * pageWidth) / img.width;

    // If height is too much, resize further
    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (img.width * pageHeight) / img.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);

    const timestamp = new Date().toISOString().split("T")[0];
    pdf.save(`PR-Analytics-${timestamp}.pdf`);
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("PDF generation failed. Please try again.");
  }
};
