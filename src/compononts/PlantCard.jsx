// PlantCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlantCard({ name, image, onDelete }) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete?.(); // parent se delete function run hoga
    setShowDialog(false);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <img src={image} alt={name} className="w-40 h-40 object-cover rounded" />
        <p className="text-sm font-medium">{name}</p>

        {/* View Profile Button */}
        <button
          onClick={() => navigate("/PlantProfile")}
          className="bg-black text-white px-3 py-1 text-xs rounded-full"
        >
          View Profile
        </button>

        {/* Delete Plant Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="bg-gray-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded-full"
        >
          Delete Plant
        </button>
      </div>

      {/* Floating Delete Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Delete Plant</h2>
            <p className="text-sm text-gray-600 mb-6">
              Do you want to delete this plant?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="bg-black hover:bg-red-700 text-white px-4 py-2 rounded-full"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
