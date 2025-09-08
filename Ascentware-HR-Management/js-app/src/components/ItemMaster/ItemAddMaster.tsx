import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { createItem } from "../../services/itemApi";

function ItemAddMaster() {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createItem(formData);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(ROUTES.ITEM_LIST);
  };

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Add Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border px-4 py-2 resize-none"
              placeholder="Enter description"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Item
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-700 mb-6">Item added successfully.</p>
            <button
              onClick={handleSuccessClose}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemAddMaster;
