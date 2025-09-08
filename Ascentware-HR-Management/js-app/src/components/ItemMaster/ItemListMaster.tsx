import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { fetchItems, deleteItem, Item } from "../../services/itemApi";

function ItemListMaster() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItems();
        console.log("Fetched Items:", data); // <== check this
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch items");
      }
    };
    loadItems();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setShowConfirmDialog(false);
      setItemToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  const handleEdit = (item: Item) => {
    navigate(ROUTES.ITEM_EDIT.replace(":id", item.id), {
      state: { item },
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Home
        </button>
      </div>

      <div className="p-6 max-w-4xl w-full bg-white rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold mb-6">Item List</h1>

        <button
          onClick={() => navigate(ROUTES.ITEM_ADD)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add New Item
        </button>

        {error && <p className="text-red-600">{error}</p>}

        {items.length === 0 ? (
          <p className="text-gray-500">No items available.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{item.itemName}</td>
                      <td className="py-2 px-4">{item.description}</td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setItemToDelete(item);
                              setShowConfirmDialog(true);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-3 py-1 rounded ${
                      number === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {showConfirmDialog && itemToDelete && (
          <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Confirm Deletion
              </h2>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{itemToDelete.itemName}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  No
                </button>
                <button
                  onClick={() => handleDelete(itemToDelete.id)}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemListMaster;
