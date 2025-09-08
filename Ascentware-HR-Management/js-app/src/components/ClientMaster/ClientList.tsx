import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { getClients, deleteClient, Client } from "../../services/clientApi";

function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      console.log("Clients from backend:", data);
      if (data.some((client) => !client.id || client.id.trim() === "")) {
        console.warn("Some clients have invalid IDs:", data);
      }
      setClients(data);
      if (data.length === 0) {
        setError("No clients found.");
      } else {
        setError(null);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load clients. Please try again.";
      setError(message);
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || id.trim() === "") {
      setError("Cannot delete: Invalid client ID.");
      console.error("Invalid client ID for delete:", id);
      return;
    }
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient(id);
        setClients(clients.filter((client) => client.id !== id));
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to delete client. Please try again.";
        setError(message);
        console.error("Error deleting client:", err);
      }
    }
  };

  const handleEdit = (id?: string) => {
    console.log("handleEdit called with ID:", id);
    if (!id || id.trim() === "") {
      console.error("Invalid client ID in handleEdit:", id);
      setError("Cannot edit: Invalid client ID.");
      return;
    }
    // Replace :id in the route with the actual id
    navigate(`/edit-client/${id}`);
  };

  const handleAddClient = () => {
    navigate(ROUTES.ADD_CLIENT);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-4">
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Client List</h1>
          <button
            onClick={handleAddClient}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Add Client
          </button>
        </div>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        {clients.length === 0 ? (
          <p className="text-center text-gray-600">No clients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Company Name</th>
                  <th className="py-2 px-4 border-b text-left">Contact Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Mobile No</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr
                    key={
                      client.id && client.id.trim()
                        ? client.id
                        : `fallback-${index}`
                    }
                    className="hover:bg-gray-50"
                  >
                    <td className="py-2 px-4 border-b">
                      {client.companyName || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {client.contactName || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {client.companyEmail || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {client.companyMobileNo || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEdit(client.id)}
                        className="px-3 py-1 rounded mr-2 bg-yellow-500 text-white hover:bg-yellow-600 transition"
                        disabled={!client.id || client.id.trim() === ""}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                        disabled={!client.id || client.id.trim() === ""}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientList;
