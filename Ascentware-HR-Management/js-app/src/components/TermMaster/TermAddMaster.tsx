import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import SuccessModal from "../../common/SuccessModal";

function TermAddMaster() {
  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedTerms = localStorage.getItem("terms");
    const terms = storedTerms ? JSON.parse(storedTerms) : [];

    const newTerm = {
      id: Date.now(),
      term,
      description,
    };

    localStorage.setItem("terms", JSON.stringify([...terms, newTerm]));
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-blue-400 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Add Term</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Term <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Enter term"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-4 py-2 resize-none"
              placeholder="Enter description"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Term
          </button>
        </form>
      </div>

      {showSuccess && (
        <SuccessModal
          title="Success!"
          message="Term added successfully."
          onClose={() => {
            setShowSuccess(false);
            navigate(ROUTES.TERM_LIST);
          }}
        />
      )}
    </div>
  );
}

export default TermAddMaster;
