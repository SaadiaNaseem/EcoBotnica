// Add this to PlantCard.jsx
import { useNavigate } from "react-router-dom";

export default function PlantCard({ name, image }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={image} alt={name} className="w-40 h-40 object-cover rounded" />
      <p className="text-sm font-medium">{name}</p>
      <button
        onClick={() => navigate("/PlantProfile")}
        className="bg-black text-white px-3 py-1 text-xs rounded-full"
      >
        View Profile
      </button>
    </div>
  );
}