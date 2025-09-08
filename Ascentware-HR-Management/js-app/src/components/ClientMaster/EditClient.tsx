import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants";
import { getClientById, updateClient, Client } from "../../services/clientApi";
import SuccessModal from "../../common/SuccessModal";

function EditClient() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Omit<Client, "id">>({
    companyName: "",
    contactName: "",
    companyAddress: "",
    companyCountry: "",
    companyPinCode: "",
    companyEmail: "",
    companyMobileNo: "",
    logoUrl: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || id.trim() === "") {
      setError("Invalid client ID.");
      setLoading(false);
      return;
    }
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      const data = await getClientById(id!);
      setFormData({
        companyName: data.companyName || "",
        contactName: data.contactName || "",
        companyAddress: data.companyAddress || "",
        companyCountry: data.companyCountry || "",
        companyPinCode: data.companyPinCode || "",
        companyEmail: data.companyEmail || "",
        companyMobileNo: data.companyMobileNo || "",
        logoUrl: data.logoUrl || "",
      });
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load client. Please try again.";
      setError(message);
      console.error("Error fetching client:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || id.trim() === "") {
      setError("Invalid client ID.");
      return;
    }
    try {
      await updateClient(id, formData);
      setShowSuccess(true);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update client. Please try again.";
      setError(message);
      console.error("Error updating client:", err);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(ROUTES.CLIENT_LIST);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error && error === "Invalid client ID.") {
    return (
      <div className="min-h-screen bg-blue-400 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            aria-label="Go to Home"
          >
            Home
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full p-6 md:p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(ROUTES.CLIENT_LIST)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Client List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-400 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          aria-label="Go to Home"
        >
          Home
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full p-6 md:p-10 flex flex-col max-h-[90vh] overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
          Edit Client
        </h1>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label
              htmlFor="companyName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label
              htmlFor="contactName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Contact Name
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter contact name"
            />
          </div>
          <div>
            <label
              htmlFor="companyAddress"
              className="block text-gray-700 font-semibold mb-2"
            >
              Company Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="companyAddress"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter company address"
            />
          </div>
          <div>
            <label
              htmlFor="companyCountry"
              className="block text-gray-700 font-semibold mb-2"
            >
              Country
            </label>
            <input
              id="companyCountry"
              name="companyCountry"
              type="text"
              value={formData.companyCountry}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter country"
            />
          </div>
          <div>
            <label
              htmlFor="companyPinCode"
              className="block text-gray-700 font-semibold mb-2"
            >
              Pin Code
            </label>
            <input
              id="companyPinCode"
              name="companyPinCode"
              type="text"
              value={formData.companyPinCode}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter pin code"
            />
          </div>
          <div>
            <label
              htmlFor="companyEmail"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              id="companyEmail"
              name="companyEmail"
              type="email"
              value={formData.companyEmail}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label
              htmlFor="companyMobileNo"
              className="block text-gray-700 font-semibold mb-2"
            >
              Mobile No. <span className="text-red-500">*</span>
            </label>
            <input
              id="companyMobileNo"
              name="companyMobileNo"
              type="text"
              value={formData.companyMobileNo}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({ ...prev, companyMobileNo: onlyNums }));
              }}
              minLength={10}
              maxLength={15}
              pattern="\d{10,}"
              inputMode="numeric"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter mobile number"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter at least 10 digits
            </p>
          </div>
          <div>
            <label
              htmlFor="logoUrl"
              className="block text-gray-700 font-semibold mb-2"
            >
              Logo URL
            </label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="text"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="No logo provided"
            />
          </div>
          <div className="md:col-span-2 flex justify-center items-center">
            <button
              type="submit"
              className="w-full md:w-1/3 bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Update Client
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <SuccessModal
          title="Success!"
          message="Client updated successfully."
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}

export default EditClient;
