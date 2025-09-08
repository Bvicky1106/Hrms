import { useRef, useState } from "react";
import { generatePdfBlob } from "../../utils/pdfUtils";
import axios from "axios";

interface InvoicePdfProps {
  invoiceNo?: string;
}

const InvoicePdf = ({ invoiceNo = "INV-019" }: InvoicePdfProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [pdfUrl] = useState<string | null>(null);

  const handleGenerateAndSend = async () => {
    try {
      if (!invoiceRef.current) {
        alert("Component not found!");
        return;
      }

      const blob = await generatePdfBlob(invoiceRef.current);

      // // Optional: show preview before upload
      // const blobUrl = URL.createObjectURL(blob);
      // setPdfUrl(blobUrl);

      // Upload to backend
      const formData = new FormData();
      formData.append("invoiceNo", invoiceNo);
      formData.append("pdf", blob, "invoice.pdf");

      await axios.post("/api/mail/send-email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("PDF sent successfully!");
    } catch (error) {
      console.error("PDF generation/upload failed:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Invoice Preview</h2>

      <div
        ref={invoiceRef}
        className="border "
        style={{
          padding: "30px",

          width: "794px", // A4 width in px
          minHeight: "1120px", // A4 height in px
        }}
      >
        <h1>Invoice</h1>
        <p>Invoice No: {invoiceNo}</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
        <p>Customer: Bala</p>
        <p>Amount: ₹5,000</p>
      </div>

      <button onClick={handleGenerateAndSend} style={{ marginTop: "20px" }}>
        Generate & Send PDF
      </button>

      {pdfUrl && (
        <div style={{ marginTop: "20px" }}>
          <a
            href={pdfUrl}
            download={`${invoiceNo}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 Download PDF Preview
          </a>
        </div>
      )}
    </div>
  );
};

export default InvoicePdf;
