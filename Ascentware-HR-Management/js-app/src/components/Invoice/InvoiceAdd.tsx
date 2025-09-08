import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { Item, InvoiceData } from "../../types/invoiceTypes";
import axios from "axios";

// Define constants
const invoiceTerms = ["Net 30", "Net 45", "Net 90"];
const invoiceStatuses = ["New", "Completed"];

const currencies = [
  { code: "USD", symbol: "$", name: "Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "Pound", locale: "en-GB" },
  { code: "INR", symbol: "₹", name: "Rupees", locale: "en-IN" },
  { code: "JPY", symbol: "¥", name: "Yen", locale: "ja-JP" },
  { code: "KWD", symbol: "", name: "Dinar", locale: "ar-KW" },
];

const HARDCODED_COMPANY = {
  companyName: "Ascentware Pvt Ltd",
  companyAddress: "No 184, Periyar Pathai Chennai, Tamil Nadu,",
  companyMobileNo: "+1234567890",
  companyEmail: "hr@ascentware.in",
};

// Define types (assumed to be in ../../types/invoiceTypes)
interface Client {
  id: string;
  companyName: string;
  contactName: string;
  companyAddress: string;
  companyCountry: string;
  companyPinCode: string;
  companyEmail: string;
  companyMobileNo: string;
  LogoUrl: string;
}

// Define type for items from itemMaster API
interface ItemMaster {
  id: string;
  itemName: string;
  description: string;
}

export default function InvoiceAdd() {
  const navigate = useNavigate();

  // State declarations

  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("New");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");
  const [thanksNote, setThanksNote] = useState("Thank you for your business!");
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<ItemMaster[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [selectedCompany, setSelectedCompany] = useState<Client | null>(null);
  // New state for success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState<{
    visible: boolean;
    invoiceNo: string | null;
  }>({ visible: false, invoiceNo: null });

  const [errors, setErrors] = useState({
    invoiceDate: "",
    dueDate: "",
    companyName: "",
    term: "",
    status: "",
    itemName: "",
    qty: "",
    rate: "",
    currency: "",
    thanksNote: "",
    companyAddress: "",
    description: "",
  });
  const [invoiceNo, setInvoiceNo] = useState("");

  // Calculate due date when invoiceDate or term changes
  useEffect(() => {
    if (invoiceDate && term) {
      const days = parseInt(term.replace("Net ", "")) || 0;
      const date = new Date(invoiceDate);
      date.setDate(date.getDate() + days);
      const calculatedDueDate = date.toISOString().split("T")[0];
      setDueDate(calculatedDueDate);
      setErrors((prev) => ({ ...prev, dueDate: "" }));
    } else {
      setDueDate("");
    }
  }, [invoiceDate, term]);

  // Fetch clients and items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await fetch(
          "http://localhost:8080/api/companies"
        );
        if (!companiesResponse.ok) {
          throw new Error(
            `Failed to fetch companies: ${companiesResponse.status}`
          );
        }
        const companiesData: Client[] = await companiesResponse.json();
        const validCompanies = companiesData.filter((company) =>
          company.companyAddress?.trim()
        );
        if (validCompanies.length === 0) {
          setApiError("No companies with valid addresses found.");
        }
        setClients(validCompanies);

        const itemsResponse = await fetch(
          "http://localhost:8080/api/itemMaster"
        );
        if (!itemsResponse.ok) {
          throw new Error(`Failed to fetch items: ${itemsResponse.status}`);
        }
        const itemsData: ItemMaster[] = await itemsResponse.json();
        setProducts(itemsData);
      } catch (error) {
        console.error("Fetch error:", error);
        setApiError("Failed to load clients and items. Please try again.");
      }
    };
    fetchData();
  }, []);

  // Format currency
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

  // Handle adding an item
  const handleAddItem = () => {
    const itemNameValue = itemName.trim();
    const parsedQty = parseFloat(qty);
    const parsedRate = parseFloat(rate);

    const newErrors = {
      ...errors,
      itemName: itemNameValue ? "" : "Item name is required.",
      qty:
        qty && !isNaN(parsedQty) && parsedQty > 0
          ? ""
          : "Valid quantity is required.",
      rate:
        rate && !isNaN(parsedRate) && parsedRate >= 0
          ? ""
          : "Valid rate is required.",
    };

    if (
      !itemNameValue ||
      !qty ||
      !rate ||
      isNaN(parsedQty) ||
      isNaN(parsedRate) ||
      parsedQty <= 0 ||
      parsedRate < 0
    ) {
      setErrors(newErrors);
      setMessage("Please fill in all item fields with valid values.");
      return;
    }

    const newItem: Item = {
      id: Date.now(),
      itemName: itemNameValue,
      description: description || "",
      qty: parsedQty,
      rate: parsedRate,
      amount: parsedQty * parsedRate,
    };

    setItemsList([...itemsList, newItem]);
    setMessage("Item added successfully!");
    resetItemFields();
  };

  // Reset item fields
  const resetItemFields = () => {
    setItemName("");
    setDescription("");
    setQty("");
    setRate("");
    setErrors((prev) => ({ ...prev, itemName: "", qty: "", rate: "" }));
  };

  // Handle delete item
  const handleDeleteItem = (index: number) => {
    setConfirmDeleteIndex(index);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (confirmDeleteIndex !== null) {
      const updatedItems = itemsList.filter((_, i) => i !== confirmDeleteIndex);
      setItemsList(updatedItems);
      setConfirmDeleteIndex(null);
      setMessage("Item deleted successfully!");
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setConfirmDeleteIndex(null);
  };

  // Reset form
  const resetForm = () => {
    setInvoiceNo("");
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setDueDate("");
    setCompanyName("");
    setSelectedCompany(null);
    setTerm("");
    setStatus("New");
    setItemsList([]);
    setThanksNote("Thank you for your business!");
    setCurrency("USD");
    resetItemFields();
    setErrors({
      invoiceDate: "",
      dueDate: "",
      companyName: "",
      term: "",
      status: "",
      itemName: "",
      qty: "",
      rate: "",
      currency: "",
      thanksNote: "",
      companyAddress: "",
      description: "",
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = {
      invoiceDate: invoiceDate ? "" : "Invoice Date is required.",
      dueDate: dueDate ? "" : "Due Date is required.",
      companyName: companyName ? "" : "Company name is required.",
      term: term ? "" : "Terms are required.",
      status: status ? "" : "Status is required.",
      currency: currency ? "" : "Currency is required.",
      thanksNote: thanksNote.trim() ? "" : "Thanks note is required.",
      itemName: "",
      qty: "",
      rate: "",
      description: "",
      companyAddress: selectedCompany?.companyAddress?.trim()
        ? ""
        : "Company address is required.",
    };

    if (
      !invoiceDate ||
      !dueDate ||
      !companyName ||
      !term ||
      !status ||
      !currency ||
      !thanksNote.trim() ||
      itemsList.length === 0 ||
      !selectedCompany ||
      !selectedCompany.companyAddress?.trim()
    ) {
      setErrors(newErrors);
      setMessage(
        "Please fill in all required fields, add at least one item, and select a valid company with an address."
      );
      return;
    }

    const finalThanksNote = thanksNote.trim() || "Thank you for your business!";

    const invoiceData: InvoiceData = {
      invoiceDate,
      invoiceTerms: term,
      dueDate,
      invoiceCompanyName: selectedCompany.companyName,
      invoiceCompanyAddress: selectedCompany.companyAddress,
      invoiceCountry: selectedCompany.companyCountry,
      invoicePinCode: selectedCompany.companyPinCode,
      invoiceEmail: selectedCompany.companyEmail,
      invoiceMobileNo: selectedCompany.companyMobileNo,
      invoiceConsultantName: selectedCompany.contactName,
      invoiceCurrency: currency,
      InvoiceStatus: status,
      companyName: HARDCODED_COMPANY.companyName,
      companyAddress: HARDCODED_COMPANY.companyAddress,
      companyMobileNo: HARDCODED_COMPANY.companyMobileNo,
      companyEmail: HARDCODED_COMPANY.companyEmail,
      thanksNote: finalThanksNote,
      description: selectedCompany.companyName,
      items: itemsList.map((item) => ({
        itemName: item.itemName,
        description: item.description || undefined,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount,
      })),
      clientName: selectedCompany.contactName,
    };

    try {
      const response = await fetch("http://localhost:8080/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to submit invoice: ${response.status} ${errorText}`
        );
      }

      const savedInvoice = await response.json();
      // Show success dialog with the generated invoiceNo
      setShowSuccessDialog({
        visible: true,
        invoiceNo: savedInvoice.invoiceNo,
      });
      // Reset form but don't navigate yet
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("Failed to submit invoice. Please try again.");
    }
  };

  // Handle closing the success dialog and navigating
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog({ visible: false, invoiceNo: null });
    navigate(ROUTES.INVOICE_TABLE);
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
  };
  useEffect(() => {
    // Function to fetch invoice number
    const fetchInvoiceNo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/invoices/preview-invoice-no"
        );
        console.log("Fetched invoice number:", response.data); // Debugging log
        if (response.data) {
          setInvoiceNo(response.data); // Set plain string (e.g., "INV-123")
          setErrors((prev) => ({ ...prev, invoiceNo: "" })); // Clear any previous errors
        } else {
          console.warn("Empty invoice number response:", response.data);
          setErrors((prev) => ({
            ...prev,
            invoiceNo: "No invoice number provided by the server",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch invoice number:", error);
        setErrors((prev) => ({
          ...prev,
          invoiceNo: "Failed to load invoice number",
        }));
      }
    };

    // Fetch immediately on mount
    fetchInvoiceNo();

    // Set up interval to fetch every 2 seconds
    const intervalId = setInterval(fetchInvoiceNo, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Calculate total amount
  const totalAmount = itemsList.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300 p-4 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          aria-label="Go to Home"
        >
          Home
        </button>
      </div>
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate(ROUTES.INVOICE_TABLE)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          aria-label="Go to Invoice Table"
        >
          Invoice Table
        </button>
      </div>
      <div className="p-6 max-w-4xl w-full bg-white rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Invoice Add Form
        </h1>

        {apiError && <p className="text-red-600 text-center">{apiError}</p>}
        {message && (
          <p
            className={`text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700">Invoice No*</label>
            <input
              type="text"
              value={invoiceNo}
              readOnly
              className="border border-gray-300 rounded p-2 w-full bg-gray-100 cursor-not-allowed"
              aria-required="true"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Invoice Date*</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => {
                setInvoiceDate(e.target.value);
                setErrors((prev) => ({ ...prev, invoiceDate: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Invoice Date*</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => {
                setInvoiceDate(e.target.value);
                setErrors((prev) => ({ ...prev, invoiceDate: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            />
            {errors.invoiceDate && (
              <p className="text-red-600 text-sm mt-1">{errors.invoiceDate}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Due Date*</label>
            <input
              type="date"
              value={dueDate}
              readOnly
              className="border border-gray-300 rounded p-2 w-full bg-gray-100 cursor-not-allowed"
              aria-required="true"
            />
            {errors.dueDate && (
              <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Company Name*</label>
            <select
              value={companyName}
              onChange={(e) => {
                const selectedName = e.target.value;
                setCompanyName(selectedName);
                const company = clients.find(
                  (c) => c.companyName === selectedName
                );
                setSelectedCompany(company || null);
                setErrors((prev) => ({
                  ...prev,
                  companyName: "",
                  companyAddress: "",
                }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            >
              <option value="">Select Company</option>
              {clients.length === 0 ? (
                <option value="" disabled>
                  No companies available
                </option>
              ) : (
                clients.map((client) => (
                  <option key={client.id} value={client.companyName}>
                    {client.companyName}
                  </option>
                ))
              )}
            </select>
            {errors.companyName && (
              <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Company Address*</label>
            <input
              type="text"
              value={selectedCompany?.companyAddress || ""}
              readOnly
              className="border border-gray-300 rounded p-2 w-full bg-gray-100 cursor-not-allowed"
              aria-required="true"
            />
            {errors.companyAddress && (
              <p className="text-red-600 text-sm mt-1">
                {errors.companyAddress}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Terms*</label>
            <select
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setErrors((prev) => ({ ...prev, term: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            >
              <option value="">Select Terms</option>
              {invoiceTerms.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.term && (
              <p className="text-red-600 text-sm mt-1">{errors.term}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Status*</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setErrors((prev) => ({ ...prev, status: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            >
              <option value="">Select Status</option>
              {invoiceStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Currency*</label>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                setErrors((prev) => ({ ...prev, currency: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            >
              <option value="">Select Currency</option>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.symbol || c.code})
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-red-600 text-sm mt-1">{errors.currency}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Thanks Note*</label>
            <input
              type="text"
              value={thanksNote}
              onChange={(e) => {
                setThanksNote(e.target.value);
                setErrors((prev) => ({ ...prev, thanksNote: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            />
            {errors.thanksNote && (
              <p className="text-red-600 text-sm mt-1">{errors.thanksNote}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 items-end">
          <div className="col-span-2">
            <label className="block mb-1 text-gray-700">Item Name*</label>
            <select
              value={itemName}
              onChange={(e) => {
                const selectedItemName = e.target.value;
                setItemName(selectedItemName);
                const selectedItem = products.find(
                  (item) => item.itemName === selectedItemName
                );
                setDescription(selectedItem?.description || "");
                setErrors((prev) => ({ ...prev, itemName: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            >
              <option value="">Select Item</option>
              {products.length === 0 ? (
                <option value="" disabled>
                  No items available
                </option>
              ) : (
                products.map((item) => (
                  <option key={item.id} value={item.itemName}>
                    {item.itemName}
                  </option>
                ))
              )}
            </select>
            {errors.itemName && (
              <p className="text-red-600 text-sm mt-1">{errors.itemName}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Qty*</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                setErrors((prev) => ({ ...prev, qty: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              min="0.01"
              step="0.01"
              aria-required="true"
            />
            {errors.qty && (
              <p className="text-red-600 text-sm mt-1">{errors.qty}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Rate*</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => {
                setRate(e.target.value);
                setErrors((prev) => ({ ...prev, rate: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              min="0"
              step="0.01"
              aria-required="true"
            />
            {errors.rate && (
              <p className="text-red-600 text-sm mt-1">{errors.rate}</p>
            )}
          </div>

          <button
            onClick={handleAddItem}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-6"
          >
            Add Item
          </button>
        </div>

        <table className="w-full mt-4 border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2">Item Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {itemsList.map((item, index) => (
              <tr key={item.id} className="text-center border-t">
                <td className="p-2">{item.itemName}</td>
                <td className="p-2">{item.description || "-"}</td>
                <td className="p-2">{item.qty}</td>
                <td className="p-2">{formatCurrency(item.rate, currency)}</td>
                <td className="p-2">{formatCurrency(item.amount, currency)}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="text-red-600 hover:underline"
                    aria-label={`Delete item ${item.itemName}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right text-lg font-semibold mt-2">
          Total Amount: {formatCurrency(totalAmount, currency)}
        </div>

        <div className="flex justify-center gap-6 pt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>

          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p className="text-center mb-4 text-gray-800">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {message && !message.includes("successfully") && (
        <div className="fixed inset-0 flex items-center justify-center z-0">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p className="text-center text-gray-800 mb-4">{message}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setMessage(null)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessDialog.visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p className="text-center mb-4 text-gray-800">
              Invoice created successfully! Invoice Number:{" "}
              <strong>{showSuccessDialog.invoiceNo}</strong>
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleCloseSuccessDialog}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
