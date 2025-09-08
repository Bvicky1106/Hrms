import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import { fetchItemById, updateItem } from "../../services/itemApi";

function ItemEditMaster() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [itemName, setItemName] = useState(state?.item?.itemName || "");
  const [description, setDescription] = useState(
    state?.item?.description || ""
  );
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const initializeForm = async () => {
      if (state?.item) {
        setItemName(state.item.itemName || "");
        setDescription(state.item.description || "");
        return;
      }

      if (!id) {
        setError("Invalid item ID");
        navigate(ROUTES.ITEM_LIST);
        return;
      }

      try {
        const item = await fetchItemById(id);
        setItemName(item.itemName || "");
        setDescription(item.description || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
        navigate(ROUTES.ITEM_LIST);
      }
    };

    initializeForm();
  }, [id, navigate, state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!itemName.trim()) {
      setError("Item name is required.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!id) {
      setError("Invalid item ID");
      return;
    }

    try {
      await updateItem(id, { itemName, description });
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(ROUTES.ITEM_LIST);
  };

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.ITEM_LIST)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Edit Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="itemName"
              className="block mb-2 font-semibold text-gray-700"
            >
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-2 font-semibold text-gray-700"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Description"
              required
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 w-full transition"
          >
            Update Item
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
            <h2 className="text-blue-600 font-bold text-2xl mb-2">Success!</h2>
            <p className="text-gray-700 mb-6">Item updated successfully.</p>
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

export default ItemEditMaster;
