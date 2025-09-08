import React from "react";

interface SuccessModalProps {
  title?: string;
  message?: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  title = "Success!",
  message = "Action completed successfully.",
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
