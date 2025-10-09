import React, { useContext } from "react";
import { VisualAidContext } from "../context/VisualAidContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VisualAidPage = () => {
  const { images, loading, progress } = useContext(VisualAidContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft className="mr-2" /> Back to Guide
      </button>

      <h2 className="text-2xl font-semibold mb-4">Visual Aids</h2>

      {loading ? (
        <p className="text-gray-600">{progress}</p>
      ) : images.length > 0 ? (
        <div className="flex flex-col items-center space-y-4">
          <img
            src={images[0].imageUrl}
            alt="Plantation Visual Guide"
            className="rounded-lg w-[600px] shadow-lg"
          />
          <p className="text-gray-700 text-center mt-2 max-w-2xl">
            {images[0].prompt}
          </p>
        </div>
      ) : (
        <p>{progress || "No visuals available yet."}</p>
      )}
    </div>
  );
};

export default VisualAidPage;
