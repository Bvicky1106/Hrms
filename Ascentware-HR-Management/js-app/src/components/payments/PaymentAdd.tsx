import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import { PaymentForm } from "../../types/paymentTypes";

const PaymentAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract invoiceNo from navigation state
  const invoiceNo = (location.state as { invoiceNo?: string })?.invoiceNo;

  const [form, setForm] = useState<PaymentForm>({
    invoiceNo: invoiceNo || "",
    paymentAmount: "",
    paymentDate: "",
    paymentMethod: "",
    referenceNo: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoiceNo) {
      setForm((prev) => ({ ...prev, invoiceNo }));
    }
  }, [invoiceNo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNo: form.invoiceNo,
          paymentAmount: parseFloat(form.paymentAmount),
          paymentDate: form.paymentDate,
          paymentMethod: form.paymentMethod,
          referenceNo: form.referenceNo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add payment: ${response.statusText}`);
      }

      alert("Payment added successfully!");

      // ✅ Navigate with invoiceNo passed in state
      navigate(ROUTES.PAYMENT_TABLE, {
        state: { invoiceNo: form.invoiceNo },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300 p-4 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Home
        </button>
      </div>
      <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Add Payment</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="invoiceNo" className="block mb-1 font-medium">
              Invoice No
            </label>
            <input
              type="text"
              id="invoiceNo"
              name="invoiceNo"
              value={form.invoiceNo}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded bg-gray-100"
              placeholder="Enter invoice number"
              disabled={loading || !!invoiceNo}
              readOnly={!!invoiceNo}
            />
          </div>
          <div>
            <label htmlFor="paymentAmount" className="block mb-1 font-medium">
              Payment Amount
            </label>
            <input
              type="number"
              id="paymentAmount"
              name="paymentAmount"
              value={form.paymentAmount}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter payment amount"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="paymentDate" className="block mb-1 font-medium">
              Payment Date
            </label>
            <input
              type="date"
              id="paymentDate"
              name="paymentDate"
              value={form.paymentDate}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block mb-1 font-medium">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
              disabled={loading}
            >
              <option value="" disabled>
                Select payment method
              </option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
          <div>
            <label htmlFor="referenceNo" className="block mb-1 font-medium">
              Reference No
            </label>
            <input
              type="text"
              id="referenceNo"
              name="referenceNo"
              value={form.referenceNo}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter reference number"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentAdd;
