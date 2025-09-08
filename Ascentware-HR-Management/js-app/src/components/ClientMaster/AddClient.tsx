// src/components/AddClient.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { createClient, Client } from "../../services/clientApi";
import SuccessModal from "../../common/SuccessModal";

function AddClient() {
  const [formData, setFormData] = useState<Client>({
    id: "",
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
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient(formData);
      setShowSuccess(true);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add client. Please try again."
      );
      console.error(err);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(ROUTES.CLIENT_LIST);
  };

  return (
    <div className="min-h-screen bg-blue-400 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Home
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full p-6 md:p-10 flex flex-col max-h-[90vh] overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
          Add Client
        </h1>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="companyName"
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
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="contactName"
            >
              Consultant Name
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter consultant name"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="companyAddress"
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
              className="w-full rounded-lg border px-4 py-2 resize-none"
              placeholder="Enter company address"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="companyCountry"
            >
              Country
            </label>
            <input
              id="companyCountry"
              name="companyCountry"
              type="text"
              value={formData.companyCountry}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter country"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="companyPinCode"
            >
              Pin Code
            </label>
            <input
              id="companyPinCode"
              name="companyPinCode"
              type="text"
              value={formData.companyPinCode}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter pin code"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="companyEmail"
            >
              Email
            </label>
            <input
              id="companyEmail"
              name="companyEmail"
              type="email"
              value={formData.companyEmail}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="companyMobileNo"
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
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter mobile number"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter at least 10 digits
            </p>
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="logoUrl"
            >
              Logo URL
            </label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="text"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter logo URL"
            />
          </div>

          <div className="md:col-span-2 flex justify-center items-center">
            <button
              type="submit"
              className="w-full md:w-1/3 bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <SuccessModal
          title="Success!"
          message="Client added successfully."
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}

export default AddClient;
