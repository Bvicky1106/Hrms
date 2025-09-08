import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants";
import SuccessModal from "../../common/SuccessModal";
import { Term } from "../../types/termTypes";

function TermEditMaster() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const storedTerms = localStorage.getItem("terms");
    if (storedTerms && id) {
      const parsed = JSON.parse(storedTerms) as Term[];
      const existing = parsed.find((t) => t.id === parseInt(id));
      if (existing) {
        setTerm(existing.term);
        setDescription(existing.description);
      } else {
        alert("Term not found.");
        navigate(ROUTES.TERM_LIST);
      }
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!term.trim()) {
      setError("Term is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    const storedTerms = localStorage.getItem("terms");
    if (storedTerms && id) {
      const parsed = JSON.parse(storedTerms) as Term[];
      const updatedTerms = parsed.map((t) =>
        t.id === parseInt(id)
          ? { ...t, term: term.trim(), description: description.trim() }
          : t
      );
      localStorage.setItem("terms", JSON.stringify(updatedTerms));
      setShowSuccess(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(ROUTES.TERM_LIST);
  };

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-4 relative">
      {/* Home button top right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Home
        </button>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Term</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block font-medium text-gray-700 mb-1"
              htmlFor="term"
            >
              Term <span className="text-red-500">*</span>
            </label>
            <input
              id="term"
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Enter term"
              required
            />
          </div>

          <div>
            <label
              className="block font-medium text-gray-700 mb-1"
              htmlFor="description"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Enter description"
              required
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.TERM_LIST)}
              className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Update Term
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          title="Success!"
          message="Term updated successfully."
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}

export default TermEditMaster;
