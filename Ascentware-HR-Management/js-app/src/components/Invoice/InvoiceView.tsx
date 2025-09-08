import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

interface Item {
  itemName: string;
  description?: string;
  qty: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceTerms?: string;
  dueDate?: string;
  invoiceCompanyName?: string;
  invoiceCompanyAddress?: string;
  invoiceCountry?: string;
  invoicePinCode?: string;
  invoiceEmail?: string;
  invoiceMobileNo?: string;
  invoiceConsultantName?: string;
  invoiceCurrency?: string;
  invoiceStatus?: string;
  companyName: string;
  companyAddress?: string;
  companyMobileNo?: string;
  companyEmail?: string;
  thanksNote?: string;
  items: Item[];
}

const currencies = [
  { code: "USD", symbol: "$", name: "Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "Pound", locale: "en-GB" },
  { code: "INR", symbol: "₹", name: "Rupees", locale: "en-IN" },
  { code: "JPY", symbol: "¥", name: "Yen", locale: "ja-JP" },
  { code: "KWD", symbol: "", name: "Dinar", locale: "ar-KW" },
];

export default function InvoiceView() {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceData = location.state?.invoiceData as InvoiceData | undefined;

  // Redirect to invoice table if no invoice data is provided
  if (!invoiceData || !invoiceData.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="p-8 max-w-lg w-full bg-white rounded-xl shadow-md text-center space-y-4">
          <p className="text-xl text-red-600 font-medium">
            No invoice data found.
          </p>
          <button
            onClick={() => navigate(ROUTES.INVOICE_TABLE)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  // Format currency for rate and amount
  const formatCurrency = (amount: number, currencyCode: string) => {
    const selectedCurrency = currencies.find((c) => c.code === currencyCode);
    if (!selectedCurrency) return `${amount.toFixed(2)}`;

    const { symbol, locale } = selectedCurrency;
    const formatter = new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formattedAmount = formatter.format(amount);
    return selectedCurrency.code === "KWD"
      ? formattedAmount
      : `${symbol} ${formattedAmount}`;
  };

  // Calculate total amount
  const totalAmount = invoiceData.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="min-h-screen p-6 flex justify-center items-start bg-blue-300">
      <div className="relative max-w-5xl w-full bg-white rounded-xl shadow-md p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Invoice #{invoiceData.invoiceNo}
          </h1>
          <button
            onClick={() => navigate(ROUTES.INVOICE_TABLE)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Back to Invoice Table"
          >
            Back to Invoices
          </button>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Invoice No.", value: invoiceData.invoiceNo },
            { label: "Invoice Date", value: invoiceData.invoiceDate },
            { label: "Due Date", value: invoiceData.dueDate || "N/A" },
            {
              label: "Status",
              value: (
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium">
                  {invoiceData.invoiceStatus || "N/A"}
                </span>
              ),
            },
            {
              label: "Company Name",
              value: invoiceData.invoiceCompanyName || "N/A",
            },
            { label: "Terms", value: invoiceData.invoiceTerms || "N/A" },
            { label: "Currency", value: invoiceData.invoiceCurrency || "N/A" },
            {
              label: "Company Address",
              value: invoiceData.invoiceCompanyAddress || "N/A",
            },
            { label: "Country", value: invoiceData.invoiceCountry || "N/A" },
            { label: "Pin Code", value: invoiceData.invoicePinCode || "N/A" },
            { label: "Email", value: invoiceData.invoiceEmail || "N/A" },
            {
              label: "Mobile No.",
              value: invoiceData.invoiceMobileNo || "N/A",
            },
            {
              label: "Consultant Name",
              value: invoiceData.invoiceConsultantName || "N/A",
            },
            {
              label: "Your Company Name",
              value: invoiceData.companyName || "N/A",
            },
            {
              label: "Your Company Address",
              value: invoiceData.companyAddress || "N/A", // Fixed: Changed from invoiceCompanyAddress to companyAddress
            },
            {
              label: "Your Company Email",
              value: invoiceData.companyEmail || "N/A",
            },
            {
              label: "Your Company Mobile No.",
              value: invoiceData.companyMobileNo || "N/A",
            },
            {
              label: "Thanks Note",
              value: invoiceData.thanksNote || "N/A",
              colSpan: true,
            },
          ].map(({ label, value, colSpan }, index) => (
            <div key={index} className={colSpan ? "md:col-span-2" : ""}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}
              </label>
              <div className="p-3 bg-gray-200 rounded-lg text-gray-800">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Items Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {["Item Name", "Description", "Qty", "Rate", "Amount"].map(
                    (header, index) => (
                      <th
                        key={header}
                        className={`p-4 text-left text-sm font-semibold text-gray-700 ${
                          index > 1 ? "text-right" : ""
                        }`}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr
                    key={`item-${index}`}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-800">{item.itemName}</td>
                    <td className="p-4 text-gray-600">
                      {item.description || "-"}
                    </td>
                    <td className="p-4 text-right text-gray-800">{item.qty}</td>
                    <td className="p-4 text-right text-gray-800">
                      {formatCurrency(
                        item.rate,
                        invoiceData.invoiceCurrency || "USD"
                      )}
                    </td>
                    <td className="p-4 text-right text-gray-800">
                      {formatCurrency(
                        item.amount,
                        invoiceData.invoiceCurrency || "USD"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Amount */}
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-800">
            Total Amount:{" "}
            <span className="text-blue-600">
              {formatCurrency(
                totalAmount,
                invoiceData.invoiceCurrency || "USD"
              )}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(ROUTES.INVOICE_TABLE)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    </div>
  );
}
