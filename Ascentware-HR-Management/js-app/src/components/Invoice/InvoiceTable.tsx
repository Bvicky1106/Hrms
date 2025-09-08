import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
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
  ThanksNote?: string;
  items: Item[];
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  is_delete?: string;
}

export default function InvoiceTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const refreshInvoices = async () => {
    try {
      const response = await axios.get<InvoiceData[]>(
        "http://localhost:8080/api/invoices"
      );
      const invoicesData = response.data;

      // Filter out invoices where is_delete is "1"
      const activeInvoices = invoicesData.filter(
        (invoice) => invoice.is_delete !== "1"
      );

      const invoicesWithAmounts = await Promise.all(
        activeInvoices.map(async (invoice) => {
          try {
            const amountResponse = await axios.get<{
              totalAmount: number;
              paidAmount: number;
              pendingAmount: number;
            }>(`http://localhost:8080/api/invoices/${invoice.id}/with-amounts`);
            console.log(
              `Invoice ${invoice.invoiceNo} - Total: ${amountResponse.data.totalAmount}, Paid: ${amountResponse.data.paidAmount}, Pending: ${amountResponse.data.pendingAmount}`
            );
            return {
              ...invoice,
              totalAmount: amountResponse.data.totalAmount,
              paidAmount: amountResponse.data.paidAmount,
              pendingAmount: amountResponse.data.pendingAmount,
            };
          } catch (error) {
            console.error(
              `Error fetching amounts for invoice ${invoice.id}:`,
              error
            );
            return {
              ...invoice,
              totalAmount: 0,
              paidAmount: 0,
              pendingAmount: 0,
            };
          }
        })
      );

      setInvoices(invoicesWithAmounts);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    }
  };

  useEffect(() => {
    const state = location.state as {
      refresh?: boolean;
      successMessage?: string;
      error?: string;
    };
    if (state?.error) {
      console.warn("Error from invoice edit:", state.error);
    }
    if (state?.successMessage) {
      setSuccessMessage(state.successMessage);
      const timer = setTimeout(() => setSuccessMessage(null), 1000);
      return () => clearTimeout(timer);
    }
    refreshInvoices();
  }, [location.state]);

  const handleEdit = (invoice: InvoiceData) => {
    navigate(ROUTES.INVOICE_EDIT, { state: { invoiceData: invoice } });
  };

  const handlePrint = (invoice: InvoiceData) => {
    localStorage.setItem("invoiceData", JSON.stringify(invoice));
    navigate(ROUTES.INVOICE_PAGE);
  };

  const handleDelete = async (id: string) => {
    try {
      // Call the PATCH endpoint to set is_delete to "1"
      await axios.patch(
        `http://localhost:8080/api/invoices/${id}/is-delete?isDelete=1`
      );
      setSuccessMessage("Invoice marked as deleted successfully.");

      // Update the local state to reflect is_delete="1" for the invoice
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === id ? { ...invoice, is_delete: "1" } : invoice
        )
      );

      // Refresh the table after a 2-second delay
      const timer = setTimeout(() => {
        refreshInvoices();
        setCurrentPage(1); // Reset to first page after refresh
      }, 2000);

      // Cleanup timer on component unmount or next delete
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error marking invoice as deleted:", error);
      setSuccessMessage(null);
    }
  };

  const handlePayment = (invoiceNo: string) => {
    navigate(ROUTES.PAYMENT_TABLE, { state: { invoiceNo } });
  };

  const handleView = (invoice: InvoiceData) => {
    navigate(ROUTES.INVOICE_VIEW, { state: { invoiceData: invoice } });
  };

  const toggleDropdown = (invoiceId: string, event: React.MouseEvent) => {
    event.preventDefault();
    setOpenDropdown(openDropdown === invoiceId ? null : invoiceId);
  };

  const getPaymentStatus = (pendingAmount: number | undefined) => {
    return pendingAmount !== undefined && pendingAmount <= 0
      ? "Completed"
      : "Not Completed";
  };

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (invoices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-300 p-4">
        <div className="p-6 max-w-4xl w-full bg-white rounded-lg shadow-lg text-center">
          <p className="mb-4 text-lg">No invoice data found.</p>
          <button
            onClick={() => navigate(ROUTES.INVOICE_ADD)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300 p-4 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Home
        </button>
      </div>

      <div className="p-6 max-w-8xl w-full bg-white rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center">All Invoices</h1>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded text-center">
            {successMessage}
          </div>
        )}

        <div className="text-right">
          <button
            onClick={() => navigate(ROUTES.INVOICE_ADD)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Invoice
          </button>
        </div>

        <div className="w-full">
          <table className="w-full border border-gray-300 text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border border-gray-300">Sl No.</th>
                <th className="p-3 border border-gray-300">Invoice No</th>
                <th className="p-3 border border-gray-300">Invoice Date</th>
                <th className="p-3 border border-gray-300">Company Name</th>
                <th className="p-3 border border-gray-300">Due Date</th>
                <th className="p-3 border border-gray-300">Status</th>
                <th className="p-3 border border-gray-300">Invoice Amount</th>
                <th className="p-3 border border-gray-300">Pending Amount</th>
                <th className="p-3 border border-gray-300">Payment Amount</th>
                <th className="p-3 border border-gray-300">Payment Status</th>
                <th className="p-3 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.map((invoice, index) => (
                <tr
                  key={invoice.id}
                  className={`border-t border-gray-300 ${
                    invoice.is_delete === "1" ? "bg-red-100 opacity-75" : ""
                  }`}
                >
                  <td className="p-2 border border-gray-300">
                    {(currentPage - 1) * invoicesPerPage + index + 1}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {invoice.invoiceNo}
                    {invoice.is_delete === "1" && (
                      <span className="ml-2 text-xs text-red-600 font-medium">
                        (Deleted)
                      </span>
                    )}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {invoice.invoiceDate}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {invoice.invoiceCompanyName}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {invoice.dueDate}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        invoice.invoiceStatus === "Paid"
                          ? "bg-green-200 text-green-800"
                          : invoice.invoiceStatus === "Unpaid"
                            ? "bg-yellow-200 text-yellow-800"
                            : invoice.invoiceStatus === "Overdue"
                              ? "bg-red-200 text-red-800"
                              : invoice.invoiceStatus === "Completed"
                                ? "bg-green-200 text-green-800"
                                : "bg-gray-200 text-blue-800"
                      }`}
                    >
                      {invoice.invoiceStatus || "N/A"}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    {invoice.totalAmount ?? "N/A"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {invoice.pendingAmount ?? "N/A"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {invoice.paidAmount ?? "N/A"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        getPaymentStatus(invoice.pendingAmount) === "Completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {getPaymentStatus(invoice.pendingAmount)}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300 relative">
                    <button
                      onClick={(event) => toggleDropdown(invoice.id, event)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Actions
                    </button>
                    {openDropdown === invoice.id && (
                      <div className="absolute z-20 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg right-0">
                        <button
                          onClick={() => {
                            handleView(invoice);
                            toggleDropdown(invoice.id, {
                              preventDefault: () => {},
                            } as React.MouseEvent);
                          }}
                          className="block w-full text-left px-4 py-2 text-indigo-600 hover:bg-indigo-100"
                        >
                          View
                        </button>
                        {invoice.pendingAmount !== undefined &&
                          invoice.pendingAmount > 0 &&
                          invoice.invoiceStatus !== "Completed" && (
                            <>
                              <button
                                onClick={() => {
                                  handleEdit(invoice);
                                  toggleDropdown(invoice.id, {
                                    preventDefault: () => {},
                                  } as React.MouseEvent);
                                }}
                                className="block w-full text-left px-4 py-2 text-yellow-600 hover:bg-yellow-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(invoice.id);
                                  toggleDropdown(invoice.id, {
                                    preventDefault: () => {},
                                  } as React.MouseEvent);
                                }}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        <button
                          onClick={() => {
                            handlePrint(invoice);
                            toggleDropdown(invoice.id, {
                              preventDefault: () => {},
                            } as React.MouseEvent);
                          }}
                          className="block w-full text-left px-4 py-2 text-green-600 hover:bg-green-100"
                        >
                          Print
                        </button>
                        <button
                          onClick={() => {
                            handlePayment(invoice.invoiceNo);
                            toggleDropdown(invoice.id, {
                              preventDefault: () => {},
                            } as React.MouseEvent);
                          }}
                          className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100"
                        >
                          Payment
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
