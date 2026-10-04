import { jsPDF } from "jspdf";

export const generateCertificate = async (participant: { name: string; institution: string }) => {
  // We use jsPDF to generate a simple certificate on the client-side
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  });

  // Certificate Dimensions
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Draw Background (Apple Design - subtle gradients or clean white with borders)
  doc.setFillColor(250, 252, 255);
  doc.rect(0, 0, width, height, "F");

  // Draw Border
  doc.setDrawColor(200, 210, 225);
  doc.setLineWidth(4);
  doc.rect(20, 20, width - 40, height - 40, "D");

  // Certificate Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(30, 41, 59);
  doc.text("Certificate of Attendance", width / 2, 180, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(100, 116, 139);
  doc.text("This is to certify that", width / 2, 230, { align: "center" });

  // Participant Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(15, 23, 42);
  doc.text(participant.name, width / 2, 290, { align: "center" });

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `has successfully attended the event representing ${participant.institution}.`,
    width / 2,
    340,
    { align: "center" }
  );

  // Date & Signature
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`Date: ${date}`, 100, 450);
  
  doc.text("Authorized Signature", width - 250, 450);
  doc.setLineWidth(1);
  doc.line(width - 250, 430, width - 100, 430);

  // Save the PDF
  doc.save(`Certificate_${participant.name.replace(/\s+/g, "_")}.pdf`);
};
