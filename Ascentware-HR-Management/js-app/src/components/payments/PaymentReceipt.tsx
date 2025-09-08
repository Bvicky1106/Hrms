import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import Ascentware from "../../assets/ascentware1.png";
import { Payment } from "../../types/paymentTypes";

const PaymentReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payment = (location.state as { payment?: Payment })?.payment;

  const handlePrint = () => {
    window.print();
  };

  if (!payment) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-200 px-4">
        <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-lg text-center">
          <p className="text-red-500 text-lg font-medium">
            No payment data found.
          </p>
          <button
            onClick={() => navigate(ROUTES.PAYMENT_TABLE)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  const formattedPaymentDate = payment.paymentDate
    ? new Date(payment.paymentDate).toLocaleDateString("en-GB")
    : "N/A";

  return (
    <>
      {/* Inline Print Styles */}
      <style>
        {`@media print {
          body {
            margin: 0;
            padding: 0;
            background: #fff;
            border: black 2px solid;
            
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .min-h-screen {
            min-height: auto !important;
            padding: 0.5in !important;
            background: #fff !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:pb-2 {
            padding-bottom: 0.5rem !important;
          }
          .print\\:text-black {
            color: #000 !important;
          }
          .print\\:bg-white {
            background-color: #fff !important;
          }
          .shadow-lg, .shadow-md {
            box-shadow: none !important;
          }
          .rounded-lg {
            border-radius: 0 !important;
          }
          .w-full {
            width: 100% !important;
            max-width: 8.5in !important; /* Standard US Letter width */
          }
          .max-w-4xl {
            max-width: 8.5in !important;
          }
          img {
            max-width: 200px !important;
            height: auto !important;
          }
          .grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(0, 1fr)) !important;
          }
          .grid-cols-1 {
            grid-template-columns: 1fr !important;
          }
          .md\\:grid-cols-2 {
            grid-template-columns: 1fr 1fr !important;
          }
          .grid-cols-4 {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .col-span-1 {
            grid-column: span 1 / span 1 !important;
          }
          .col-span-3 {
            grid-column: span 3 / span 3 !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          // th, td {
          //   border: 1px solid #000 !important;
          //   padding: 0.5rem !important;
          // }
          thead tr {
            background-color: #9ca3af !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .amount-box {
            background-color: #d1fae5 !important;
            color: #065f46 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            padding: 1rem !important;
            border: 1px solid #000 !important;
          }
          @page {
            size: A4;
            margin: 0.5in;
          }
        }`}
      </style>

      <div className="min-h-screen flex justify-center items-center py-10 px-4 print:p-0 print:bg-white">
        <div className="absolute top-4 right-4 print:hidden">
          <button
            onClick={() => navigate(ROUTES.INVOICE_TABLE)}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Invoice Table
          </button>
        </div>

        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg print:shadow-none print:p-4 print:bg-white print:text-black">
          {/* Header */}
          <div className="border-b pb-6 mb-6 print:border-none print:pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start w-full">
              <img src={Ascentware} alt="Ascentware Logo" className="w-60" />
              <div className="text-sm text-right">
                <p className="font-semibold text-base">
                  ASCENTWARE PRIVATE LIMITED
                </p>
                <p>Chennai, Tamil Nadu 600034, India</p>
                <p>hr@ascentware.in</p>
                <p>www.ascentware.in</p>
              </div>
            </div>
          </div>

          {/* Payment Info & Amount */}
          <div className="grid grid-cols-4 gap-6 mt-32 mb-6">
            <div className="col-span-3 space-y-4 text-sm">
              <h2 className="text-center text-lg font-semibold underline mb-3 print:text-center">
                PAYMENT RECEIPT
              </h2>

              <p className="flex items-center gap-2">
                <span className="whitespace-nowrap">Payment Date:</span>
                <span className="flex-1 text-center border-b border-black pb-1">
                  {formattedPaymentDate}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <span className="whitespace-nowrap">Reference Number:</span>
                <span className="flex-1 text-center border-b border-black pb-1">
                  {payment.referenceNo}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <span className="whitespace-nowrap">Payment Mode:</span>
                <span className="flex-1 text-center border-b border-black pb-1">
                  Bank Transfer
                </span>
              </p>
            </div>

            {/* Amount */}
            <div className="col-span-1 flex items-center justify-center">
              <div
                className="h-52 w-full rounded-lg flex flex-col items-center justify-center text-center px-4 shadow-md amount-box"
                style={{
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <p className="text-lg font-bold">Amount Received:</p>
                <p className="text-2xl font-bold text-black mt-1">
                  €{payment.paymentAmount?.toFixed(2) || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Received From */}
          <div className="mb-6 mt-20 text-sm ">
            <p className="font-bold">Received From</p>
            <p className="font-semibold">ABC LIMITED</p>
            <p>1234, Corner Street, Brussels, Belgium</p>
          </div>

          {/* Payment For Table */}
          <div className="mb-6 mt-20">
            <h3 className="font-semibold mb-2 text-sm">Payment For</h3>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr
                    className="text-left border-b h-14 border-gray-500"
                    style={{
                      backgroundColor: "#9ca3af",
                      color: "#000000",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                    }}
                  >
                    <th className="p-2 w-1/5">#</th>
                    <th className="p-2 w-1/5">Invoice Number</th>
                    <th className="p-2 w-1/5">Invoice Date</th>
                    <th className="p-2 w-1/5">Invoice Amount</th>
                    <th className="p-2 w-1/5">Payment Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b h-14 border-gray-300">
                    <td className="p-2">1</td>
                    <td className="p-2">{payment.invoiceNo || "N/A"}</td>
                    <td className="p-2">{formattedPaymentDate}</td>
                    <td className="p-2">
                      €{payment.paymentAmount?.toFixed(2) || "N/A"}
                    </td>
                    <td className="p-2">
                      €{payment.paymentAmount?.toFixed(2) || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Note */}
          <div className="text-left mb-6">
            <p className="text-sm italic">Thanks for your business.</p>
          </div>

          {/* Print Button */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors print:hidden"
              style={{ display: "block", printColorAdjust: "exact" }}
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentReceipt;
