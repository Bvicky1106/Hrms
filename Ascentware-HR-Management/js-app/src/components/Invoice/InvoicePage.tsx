import { useEffect, useRef, useState } from "react";
import Ascentware from "../../assets/ascentware1.png";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { generatePdfBlob } from "../../utils/pdfUtils";
import axios from "axios";

interface Item {
  itemName: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  client: string;
  dueDate: string;
  invoiceCompanyAddress: string;
  invoiceCompanyName: string;
  invoiceConsultantName: string;
  thanksNote: string;
  invoiceTerms: string;
  items: Item[];
}

function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const storedData = localStorage.getItem("invoiceData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setInvoiceData({
        invoiceNo: parsedData.invoiceNo,
        invoiceDate: parsedData.invoiceDate,
        client: parsedData.client,
        dueDate: parsedData.dueDate,
        invoiceCompanyAddress: parsedData.invoiceCompanyAddress,
        invoiceCompanyName: parsedData.invoiceCompanyName,
        invoiceConsultantName: parsedData.invoiceConsultantName,
        thanksNote: parsedData.thanksNote,
        invoiceTerms: parsedData.invoiceTerms,
        items: parsedData.items.map((item: any) => ({
          itemName: item.itemName,
          description: item.description,
          qty: item.qty,
          rate: item.rate,
          amount: item.amount,
        })),
      });
    }
  }, []);

  if (!invoiceData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p style={{ fontSize: "1.125rem" }}>Loading invoice data...</p>
      </div>
    );
  }

  const grandTotal = invoiceData.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const handleGenerateAndSend = async () => {
    try {
      setIsSending(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!invoiceRef.current) {
        alert("Component not found!");
        return;
      }

      const blob = await generatePdfBlob(invoiceRef.current);

      const formData = new FormData();
      formData.append("invoiceNo", invoiceData.invoiceNo);
      formData.append("pdf", blob, "invoice.pdf");

      await axios.post("/api/mail/send-email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("PDF sent successfully!");
    } catch (error) {
      console.error("PDF generation/upload failed:", error);
      alert("Something went wrong.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{ backgroundColor: "#e5e7eb" }}
    >
      <div className="absolute top-4 right-4 print:hidden">
        <button
          onClick={() => navigate(ROUTES.INVOICE_TABLE)}
          className="py-2 px-4 rounded hover:bg-green-600"
          style={{ backgroundColor: "#22c55e", color: "#ffffff" }}
        >
          Back
        </button>
      </div>

      <div
        id="invoice-content"
        className="w-[850px] m-12 border-2 p-8 shadow-lg print-no-margin print-no-padding print-no-border print-no-shadow"
        style={{ backgroundColor: "#ffffff", borderColor: "#d1d5db" }}
        ref={invoiceRef}
      >
        {/* Header */}
        <div className="grid grid-cols-2 items-start mb-8">
          {/* Left Side: Logo */}
          <div className="relative h-32">
            <img
              src={Ascentware}
              alt="Ascentware Logo"
              className="absolute top-10 left-0 w-64"
            />
          </div>

          {/* Right Side: Invoice Info */}
          <div className="text-right font-sans">
            <h2 className="text-5xl mt-8  tracking-wide">INVOICE</h2>

            <p className=" -mt-1">
              Invoice#{" "}
              <span className="font-semibold">{invoiceData.invoiceNo}</span>
            </p>

            <p className="text-[15px]  mt-2">Balance Due</p>

            <p className=" -mt-1">₹{grandTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Company Address */}
        <div className="mb-8">
          <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
            Ascentware Pvt Ltd
          </h3>
          <p style={{ fontSize: "0.875rem" }}>No 184 , Periyar Pathai,</p>
          <p style={{ fontSize: "0.875rem" }}>Chennai, Tamil Nadu</p>
          <p style={{ fontSize: "0.875rem" }}>600094 India</p>
          <p style={{ fontSize: "0.875rem" }}>hr@ascentware.in</p>
          <p style={{ fontSize: "0.875rem" }}>www.ascentware.in</p>
        </div>

        {/* Bill To / Info */}
        <div className="grid grid-cols-2 gap-x-4 mb-8">
          <div className="pt-6">
            <p
              style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: 4 }}
            >
              Bill To
            </p>
            <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>
              {invoiceData.invoiceCompanyName}
            </p>
            <p style={{ fontSize: "0.875rem" }}>
              {invoiceData.invoiceCompanyAddress}
            </p>
          </div>
          <div
            className="flex flex-col justify-start text-right space-y-6 pt-6"
            style={{ fontSize: "0.875rem" }}
          >
            <p>
              Invoice Date:
              <span style={{ fontWeight: 500, marginLeft: "130px" }}>
                {invoiceData.invoiceDate}
              </span>
            </p>

            <p>
              Terms:{" "}
              <span style={{ fontWeight: 500, marginLeft: "162px" }}>
                {invoiceData.invoiceTerms}
              </span>
            </p>
            <p>
              Due Date:{" "}
              <span style={{ fontWeight: 500, marginLeft: "130px" }}>
                {invoiceData.dueDate}
              </span>
            </p>
          </div>
        </div>

        {/* Subject */}
        <p className="text-sm pt-2">Subject:</p>
        <div className="mb-8">
          <p style={{ fontSize: "0.875rem" }}>Invoice for the company month</p>
          <p style={{ fontSize: "0.875rem" }}>
            Consultant Name: {invoiceData.invoiceConsultantName}
          </p>
        </div>

        {/* Table */}
        <div style={{ breakInside: "avoid" }}>
          <table
            className="w-full mt-10 border-t border-b border-collapse table-fixed"
            style={{
              fontSize: "0.875rem",
              borderColor: "#d1d5db",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <thead style={{ backgroundColor: "#000", color: "#fff" }}>
              <tr>
                <th className="text-left w-6 p-2">#</th>
                <th className="text-left w-1/2 p-2">Item & Description</th>
                <th className="text-right w-24 p-2">Qty</th>
                <th className="text-right w-20 px-1 py-2">Rate</th>
                <th className="text-right w-20 px-1 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b h-12"
                  style={{ borderColor: "#d1d5db" }}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    {item.itemName} - {item.description}
                  </td>
                  <td className="px-1 text-right">{item.qty}</td>
                  <td className="px-1 text-right">₹{item.rate.toFixed(2)}</td>
                  <td className="px-1 text-right">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div
          className="mt-6 flex flex-col items-end space-y-1"
          style={{ breakInside: "avoid" }}
        >
          <div
            className="grid grid-cols-2 gap-x-4 w-64"
            style={{ color: "#6b7280", fontWeight: 500 }}
          >
            <span>Sub Total</span>
            <span className="text-right">₹{grandTotal.toFixed(2)}</span>
          </div>
          <div
            className="grid grid-cols-2 gap-x-4 w-64"
            style={{ fontWeight: 600, color: "#000" }}
          >
            <span className="ml-8">Total</span>
            <span className="text-right">₹{grandTotal.toFixed(2)}</span>
          </div>
          <div
            className="p-2 grid grid-cols-2 gap-x-4 w-64"
            style={{
              backgroundColor: "#f3f4f6",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#000",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <span className="-ml-4">Balance Due</span>
            <span className="text-right">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 text-sm">
          <p className="font-semibold">Notes</p>
          <p>{invoiceData.thanksNote}</p>
        </div>

        <div
          className={`mt-8 text-center print:hidden ${isSending ? "hidden" : ""}`}
        >
          <button
            onClick={() => window.print()}
            className="px-6 py-2 rounded transition"
            style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
          >
            Print this Invoice
          </button>
        </div>

        <div
          className={`mt-4 print:hidden text-center ${isSending ? "hidden" : ""}`}
        >
          <button
            disabled={isSending}
            onClick={handleGenerateAndSend}
            className="px-4 py-2 rounded"
            style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
          >
            Send to Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoicePage;
