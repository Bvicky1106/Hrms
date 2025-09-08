import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

interface Item {
  id?: number;
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

// Define type for items from itemMaster API
interface ItemMaster {
  id: string;
  itemName: string;
  description: string;
}

const termsOptions = ["Net 30", "Net 45", "Net 90"];
const statusOptions = ["New", "Completed"];

const currencies = [
  { code: "USD", symbol: "$", name: "Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "Pound", locale: "en-GB" },
  { code: "INR", symbol: "₹", name: "Rupees", locale: "en-IN" },
  { code: "JPY", symbol: "¥", name: "Yen", locale: "ja-JP" },
  { code: "KWD", symbol: "", name: "Dinar", locale: "ar-KW" },
];

export default function InvoiceEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceData = location.state?.invoiceData as InvoiceData | undefined;

  const [invoiceNo] = useState(invoiceData?.invoiceNo || "");
  const [invoiceDate, setInvoiceDate] = useState(
    invoiceData?.invoiceDate || new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(invoiceData?.dueDate || "");
  const [invoiceStatus, setInvoiceStatus] = useState(
    invoiceData?.invoiceStatus || "New"
  );
  const [companyName, setCompanyName] = useState(
    invoiceData?.invoiceCompanyName || invoiceData?.companyName || ""
  );
  const [invoiceTerms, setInvoiceTerms] = useState(
    invoiceData?.invoiceTerms || ""
  );
  const [invoiceCurrency, setInvoiceCurrency] = useState(
    invoiceData?.invoiceCurrency || "USD"
  );
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");
  const [itemsList, setItemsList] = useState<Item[]>(invoiceData?.items || []);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [clients, setClients] = useState<
    {
      id: string;
      companyName: string;
      contactName: string;
      companyAddress: string;
      companyCountry: string;
      companyPinCode: string;
      companyEmail: string;
      companyMobileNo: string;
      LogoUrl: string;
    }[]
  >([]);
  const [products, setProducts] = useState<ItemMaster[]>([]); // Updated to store ItemMaster objects
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    companyName: string;
    contactName: string;
    companyAddress: string;
    companyCountry: string;
    companyPinCode: string;
    companyEmail: string;
    companyMobileNo: string;
    LogoUrl: string;
  } | null>(null);
  const [selectedCompanyAddress, setSelectedCompanyAddress] = useState<string>(
    invoiceData?.invoiceCompanyAddress || ""
  );

  const [errors, setErrors] = useState({
    invoiceDate: "",
    dueDate: "",
    invoiceStatus: "",
    companyName: "",
    invoiceTerms: "",
    itemName: "",
    qty: "",
    rate: "",
    invoiceCurrency: "",
  });

  // Calculate due date when invoiceDate or invoiceTerms change
  useEffect(() => {
    if (invoiceDate && invoiceTerms) {
      const days = parseInt(invoiceTerms.replace("Net ", "")) || 0;
      const date = new Date(invoiceDate);
      date.setDate(date.getDate() + days);
      const calculatedDueDate = date.toISOString().split("T")[0];
      setDueDate(calculatedDueDate);
      setErrors((prev) => ({ ...prev, dueDate: "" }));
    } else {
      setDueDate("");
    }
  }, [invoiceDate, invoiceTerms]);

  // Fetch companies and items
  useEffect(() => {
    console.log("Received invoiceData:", invoiceData);
    if (!invoiceData || !invoiceData.id) {
      setMessage("No valid invoice data provided for editing.");
      setTimeout(() => navigate(ROUTES.INVOICE_TABLE), 2000);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch companies
        const companiesResponse = await fetch(
          "http://localhost:8080/api/companies"
        );
        if (!companiesResponse.ok) {
          throw new Error(
            `Failed to fetch companies: ${companiesResponse.status}`
          );
        }
        const companiesData: {
          id: string;
          companyName: string;
          contactName: string;
          companyAddress: string;
          companyCountry: string;
          companyPinCode: string;
          companyEmail: string;
          companyMobileNo: string;
          LogoUrl: string;
        }[] = await companiesResponse.json();
        console.log("Companies API Response:", companiesData);
        setClients(companiesData);

        // Set initial selectedCompany based on invoiceData.companyName
        const company = companiesData.find(
          (c) => c.companyName === invoiceData.invoiceCompanyName
        );
        if (company) {
          setSelectedCompany(company);
          setSelectedCompanyAddress(company.companyAddress ?? "");
          console.log("Initial selectedCompany:", company);
          console.log(
            "Initial selectedCompanyAddress:",
            company.companyAddress
          );
        } else {
          console.warn(
            "No matching company found for invoiceCompanyName:",
            invoiceData.invoiceCompanyName
          );
        }

        // Fetch items from itemMaster API
        const itemsResponse = await fetch(
          "http://localhost:8080/api/itemMaster"
        );
        if (!itemsResponse.ok) {
          throw new Error(`Failed to fetch items: ${itemsResponse.status}`);
        }
        const itemsData: ItemMaster[] = await itemsResponse.json();
        console.log("Items API Response:", itemsData);
        setProducts(itemsData);
      } catch (error) {
        console.error("Fetch error:", error);
        setApiError("Failed to load companies and items. Please try again.");
      }
    };
    fetchData();
  }, [invoiceData, navigate]);

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

  const handleAddOrUpdateItem = () => {
    const itemValue = itemName.trim();
    const parsedQty = parseFloat(qty);
    const parsedRate = parseFloat(rate);

    const newErrors = {
      ...errors,
      itemName: itemValue ? "" : "Item name is required.",
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
      !itemValue ||
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
      id:
        editingItemIndex !== null && itemsList[editingItemIndex]?.id
          ? itemsList[editingItemIndex].id
          : itemsList.length > 0
            ? Math.max(...itemsList.map((i) => i.id || 0)) + 1
            : 1,
      itemName: itemValue,
      description: description || "",
      qty: parsedQty,
      rate: parsedRate,
      amount: parsedQty * parsedRate,
    };

    if (editingItemIndex !== null) {
      // Update existing item
      const updatedItems = itemsList.map((item, index) =>
        index === editingItemIndex ? newItem : item
      );
      setItemsList(updatedItems);
      setMessage("Item updated successfully!");
    } else {
      // Add new item
      setItemsList([...itemsList, newItem]);
      setMessage("Item added successfully!");
    }

    resetItemFields();
  };

  const handleEditItem = (index: number) => {
    const item = itemsList[index];
    setItemName(item.itemName);
    setDescription(item.description || "");
    setQty(item.qty.toString());
    setRate(item.rate.toString());
    setEditingItemIndex(index);
  };

  const resetItemFields = () => {
    setItemName("");
    setDescription("");
    setQty("");
    setRate("");
    setEditingItemIndex(null);
    setErrors((prev) => ({ ...prev, itemName: "", qty: "", rate: "" }));
  };

  const handleDeleteItem = (index: number) => {
    setConfirmDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (confirmDeleteIndex !== null) {
      setItemsList(itemsList.filter((_, i) => i !== confirmDeleteIndex));
      setConfirmDeleteIndex(null);
      setMessage("Item deleted successfully!");
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteIndex(null);
  };

  const handleSubmit = async () => {
    const newErrors = {
      invoiceDate: invoiceDate ? "" : "Invoice Date is required.",
      dueDate: dueDate ? "" : "Due Date is required.",
      invoiceStatus: invoiceStatus ? "" : "Status is required.",
      companyName: companyName ? "" : "Company name is required.",
      invoiceTerms: invoiceTerms ? "" : "Terms are required.",
      invoiceCurrency: invoiceCurrency ? "" : "Currency is required.",
      itemName: "",
      qty: "",
      rate: "",
    };

    if (
      !invoiceDate ||
      !dueDate ||
      !invoiceStatus ||
      !companyName ||
      !invoiceTerms ||
      !invoiceCurrency ||
      itemsList.length === 0
    ) {
      setErrors(newErrors);
      setMessage(
        "Please fill in all required fields and add at least one item."
      );
      return;
    }

    if (!invoiceData || !invoiceData.id) {
      console.error("Invoice data is missing.", { invoiceData });
      navigate(ROUTES.INVOICE_TABLE);
      return;
    }

    // Resynchronize selectedCompany
    let finalCompany = selectedCompany;
    let finalAddress = selectedCompanyAddress;
    if (!finalCompany && companyName) {
      const company = clients.find((c) => c.companyName === companyName);
      if (company) {
        finalCompany = company;
        finalAddress = company.companyAddress ?? "";
        setSelectedCompany(company);
        setSelectedCompanyAddress(finalAddress);
        console.log("Synchronized - finalCompany:", company);
        console.log("Synchronized - finalAddress:", finalAddress);
      } else {
        console.warn("No company found for companyName:", companyName);
      }
    }

    const updatedInvoice: InvoiceData = {
      id: invoiceData.id,
      invoiceNo,
      invoiceDate,
      invoiceTerms,
      dueDate,
      invoiceStatus,
      invoiceCompanyName: finalCompany?.companyName || companyName,
      invoiceCompanyAddress: finalCompany?.companyAddress ?? finalAddress ?? "",
      invoiceCountry:
        finalCompany?.companyCountry || invoiceData.invoiceCountry,
      invoicePinCode:
        finalCompany?.companyPinCode || invoiceData.invoicePinCode,
      invoiceEmail: finalCompany?.companyEmail || invoiceData.invoiceEmail,
      invoiceMobileNo:
        finalCompany?.companyMobileNo || invoiceData.invoiceMobileNo,
      invoiceConsultantName:
        finalCompany?.contactName || invoiceData.invoiceConsultantName,
      invoiceCurrency,
      companyName: invoiceData.companyName,
      companyAddress: invoiceData.companyAddress,
      companyMobileNo: invoiceData.companyMobileNo,
      companyEmail: invoiceData.companyEmail,
      thanksNote: invoiceData.thanksNote,
      items: itemsList,
    };

    console.log(
      "Sending updated invoice:",
      JSON.stringify(updatedInvoice, null, 2)
    );
    console.log(
      "invoiceCompanyAddress in updatedInvoice:",
      updatedInvoice.invoiceCompanyAddress
    );

    try {
      const response = await fetch(
        `http://localhost:8080/api/invoices/${invoiceData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInvoice),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to update invoice: ${errorText}`, {
          status: response.status,
          url: response.url,
          payload: JSON.stringify(updatedInvoice, null, 2),
        });
        navigate(ROUTES.INVOICE_TABLE, {
          state: { error: `Server error (status: ${response.status})` },
        });
        return;
      }

      console.log("Invoice updated successfully, navigating to table");
      navigate(ROUTES.INVOICE_TABLE, { state: { refresh: true } });
    } catch (error) {
      console.error("Update error:", error, {
        payload: JSON.stringify(updatedInvoice, null, 2),
      });
      navigate(ROUTES.INVOICE_TABLE, {
        state: { error: "Network or unexpected error" },
      });
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.INVOICE_TABLE);
  };

  const totalAmount = itemsList.reduce((sum, item) => sum + item.amount, 0);

  if (!invoiceData || !invoiceData.id) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300 p-4 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.INVOICE_ADD)}
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
          aria-label="Go to Add Invoice"
        >
          Add Invoice
        </button>
      </div>
      <div className="p-6 max-w-4xl w-full bg-white rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Edit Invoice #{invoiceNo}
        </h1>

        {apiError && <p className="text-red-600 text-center">{apiError}</p>}
        {message && (
          <p
            className={`text-center ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700">Invoice No.</label>
            <input
              type="text"
              value={invoiceNo}
              readOnly
              className="border border-gray-300 rounded p-2 w-full bg-gray-200 cursor-not-allowed"
              aria-required="true"
              aria-readonly="true"
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
            <label className="block mb-1 text-gray-700">Status*</label>
            <select
              value={invoiceStatus}
              onChange={(e) => {
                setInvoiceStatus(e.target.value);
                setErrors((prev) => ({ ...prev, invoiceStatus: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            >
              <option value="">Select Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.invoiceStatus && (
              <p className="text-red-600 text-sm mt-1">
                {errors.invoiceStatus}
              </p>
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
                const address = company?.companyAddress ?? "";
                setSelectedCompanyAddress(address);
                console.log("Dropdown onChange - Selected Company:", company);
                console.log(
                  "Dropdown onChange - Selected Company Address:",
                  company?.companyAddress
                );
                console.log(
                  "Dropdown onChange - Set selectedCompanyAddress:",
                  address
                );
                setErrors((prev) => ({ ...prev, companyName: "" }));
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
            <label className="block mb-1 text-gray-700">Terms*</label>
            <select
              value={invoiceTerms}
              onChange={(e) => {
                setInvoiceTerms(e.target.value);
                setErrors((prev) => ({ ...prev, invoiceTerms: "" }));
              }}
              className="border border-gray-300 rounded p-2 w-full"
              aria-required="true"
            >
              <option value="">Select Terms</option>
              {termsOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.invoiceTerms && (
              <p className="text-red-600 text-sm mt-1">{errors.invoiceTerms}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Currency*</label>
            <select
              value={invoiceCurrency}
              onChange={(e) => {
                setInvoiceCurrency(e.target.value);
                setErrors((prev) => ({ ...prev, invoiceCurrency: "" }));
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
            {errors.invoiceCurrency && (
              <p className="text-red-600 text-sm mt-1">
                {errors.invoiceCurrency}
              </p>
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

          <div className="flex gap-2">
            <button
              onClick={handleAddOrUpdateItem}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingItemIndex !== null ? "Update Item" : "Add Item"}
            </button>
            {editingItemIndex !== null && (
              <button
                onClick={resetItemFields}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <table className="min-w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Item Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Rate</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemsList.map((itemObj, index) => (
              <tr key={itemObj.id || index} className="text-center border-t">
                <td className="p-2">{itemObj.itemName}</td>
                <td className="p-2">{itemObj.description || "-"}</td>
                <td className="p-2">{itemObj.qty}</td>
                <td className="p-2">
                  {formatCurrency(itemObj.rate, invoiceCurrency)}
                </td>
                <td className="p-2">
                  {formatCurrency(itemObj.amount, invoiceCurrency)}
                </td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEditItem(index)}
                    className="text-blue-600 hover:underline"
                    aria-label={`Edit item ${itemObj.itemName}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="text-red-600 hover:underline"
                    aria-label={`Delete item ${itemObj.itemName}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right text-base font-semibold mt-2">
          Total Amount: {formatCurrency(totalAmount, invoiceCurrency)}
        </div>

        <div className="flex justify-center gap-6 pt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Changes
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <p className="text-center text-gray-700 mb-4">
              Are you certain you want to delete this item?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <p className="text-center text-gray-700 mb-4">{message}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setMessage(null)}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                aria-label="Close Modal"
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
