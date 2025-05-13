// components/AiResponseBox.jsx
import React, { useContext } from "react";
import { AiContext } from "../context/AiContext";

const AiResponseBox = () => {
  const { response, loading } = useContext(AiContext);

  if (loading) return <p className="text-center py-8 text-gray-500">Loading response...</p>;
  if (!response) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-gray-50 border border-gray-300 rounded-lg shadow-sm whitespace-pre-wrap text-gray-800">
      {response}
    </div>
  );
};

export default AiResponseBox;
