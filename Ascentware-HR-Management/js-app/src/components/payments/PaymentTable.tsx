import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { Payment } from "../../types/paymentTypes";

const PaymentTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const invoiceNoFromState = location.state?.invoiceNo || "";

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/payment");
        if (!response.ok) {
          throw new Error(`Failed to fetch payments: ${response.statusText}`);
        }
        const data: Payment[] = await response.json();
        setPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleReceipt = (payment: Payment) => {
    navigate(ROUTES.PAYMENT_RECIPT, { state: { payment } });
  };

  const handleAddPayment = (invoiceNo?: string) => {
    if (invoiceNo) {
      navigate(ROUTES.PAYMENT_ADD, {
        state: { invoiceNo },
      });
    } else {
      navigate(ROUTES.PAYMENT_ADD);
    }
  };

  // 🔍 Filter by invoiceNo if passed from InvoiceTable
  const filteredPayments = invoiceNoFromState
    ? payments.filter((p) => p.invoiceNo === invoiceNoFromState)
    : payments;

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-blue-300 p-6">
      <div className="max-w-4xl mx-auto flex justify-end mb-4 space-x-2">
        <button
          onClick={() => navigate(ROUTES.INVOICE_TABLE)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Invoice Table
        </button>
        <button
          onClick={() => handleAddPayment(invoiceNoFromState)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Add New Payment
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Modified title to show only when invoiceNoFromState exists */}
        {invoiceNoFromState && (
          <h2 className="text-2xl font-bold mb-6">
            Payments for Invoice #{invoiceNoFromState}
          </h2>
        )}

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && filteredPayments.length === 0 && (
          <p className="text-center">No payments found.</p>
        )}

        {!loading && !error && filteredPayments.length > 0 && (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Invoice No</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Method</th>
                  <th className="p-2 text-left">Ref No</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="p-2">{payment.invoiceNo}</td>
                    <td className="p-2">
                      {payment.paymentAmount != null
                        ? `₹${payment.paymentAmount.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="p-2">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">{payment.paymentMethod}</td>
                    <td className="p-2">{payment.referenceNo}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleReceipt(payment)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredPayments.length)} of{" "}
                {filteredPayments.length}
              </p>
              <div className="flex space-x-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentTable;
