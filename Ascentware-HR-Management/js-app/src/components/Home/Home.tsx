// src/pages/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-blue-300 p-6 flex flex-col items-center justify-center">
      {/* Invoice button - top right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate("/invoice-table")}
          className="bg-white rounded-xl shadow-md px-5 py-4 flex flex-col items-center justify-center
            hover:bg-green-100 hover:shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <span className="text-lg font-semibold text-green-600 mb-1">
            Invoice
          </span>
          <span className="text-sm text-gray-500 text-center">
            Create and view invoices
          </span>
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
        {/* Client Master */}
        <button
          onClick={() => navigate("/clients")}
          className="bg-white rounded-xl shadow-md px-6 py-8 flex flex-col items-center text-center
            hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <span
            data-testid="home-title"
            className="text-xl font-semibold text-blue-600 mb-2"
          >
            Client Master
          </span>
          <span className="text-sm text-gray-500">
            Manage client information
          </span>
        </button>

        {/* Term Master */}
        <button
          onClick={() => navigate("/term-list")}
          className="bg-white rounded-xl shadow-md px-6 py-8 flex flex-col items-center text-center
            hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <span className="text-xl font-semibold text-blue-600 mb-2">
            Term Master
          </span>
          <span className="text-sm text-gray-500">Manage term information</span>
        </button>

        {/* Item Master */}
        <button
          onClick={() => navigate("/items")}
          className="bg-white rounded-xl shadow-md px-6 py-8 flex flex-col items-center text-center
            hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <span className="text-xl font-semibold text-blue-600 mb-2">
            Item Master
          </span>
          <span className="text-sm text-gray-500">Manage item information</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
