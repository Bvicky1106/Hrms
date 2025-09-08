import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import SuccessModal from "../../common/SuccessModal";
import { Term } from "../../types/termTypes";

function TermListMaster() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [termToDelete, setTermToDelete] = useState<Term | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const termsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const storedTerms = localStorage.getItem("terms");
    if (storedTerms) {
      setTerms(JSON.parse(storedTerms));
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedTerms = terms.filter((term) => term.id !== id);
    setTerms(updatedTerms);
    localStorage.setItem("terms", JSON.stringify(updatedTerms));
    setShowConfirmDialog(false);
    setTermToDelete(null);
    setSuccessMessage("Term deleted successfully.");
    setShowSuccess(true);
  };

  const indexOfLast = currentPage * termsPerPage;
  const indexOfFirst = indexOfLast - termsPerPage;
  const currentTerms = terms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(terms.length / termsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

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

      <div className="p-6 max-w-4xl w-full bg-white rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold mb-6">Term List</h1>
        <button
          onClick={() => navigate(ROUTES.TERM_ADD)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add New Term
        </button>

        {terms.length === 0 ? (
          <p className="text-gray-500">No terms available.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTerms.map((term) => (
                    <tr key={term.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{term.term}</td>
                      <td className="py-2 px-4">{term.description}</td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                ROUTES.TERM_EDIT.replace(
                                  ":id",
                                  term.id.toString()
                                )
                              )
                            }
                            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setTermToDelete(term);
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

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`px-3 py-1 rounded ${
                      num === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {num}
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

        {/* Confirmation Dialog */}
        {showConfirmDialog && termToDelete && (
          <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Confirm Deletion
              </h2>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{termToDelete.term}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setTermToDelete(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  No
                </button>
                <button
                  onClick={() => handleDelete(termToDelete.id)}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <SuccessModal
            title="Deleted"
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </div>
  );
}

export default TermListMaster;
