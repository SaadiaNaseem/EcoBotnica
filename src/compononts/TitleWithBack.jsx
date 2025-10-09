// components/TitleWithBack.jsx
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const TitleWithBack = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center mb-4">
      <button onClick={() => navigate(-1)} className="mr-2 text-gray-600">
        <FaArrowLeft />
      </button>
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
    </div>
  );
};

export default TitleWithBack;
