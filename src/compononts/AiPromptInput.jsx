// components/AiPromptInput.jsx
import React, { useContext, useState } from "react";
import { AiContext } from "../context/AiContext";
import { SendHorizonal } from "lucide-react";

const AiPromptInput = ({ position = "center" }) => {
  const [prompt, setPrompt] = useState("");
  const { fetchPlantationGuide, loading } = useContext(AiContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    fetchPlantationGuide(prompt);
    setPrompt("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${position === "center" ? "h-screen flex items-center justify-center" : "p-4"} `}
    >
      <div className="flex w-full max-w-3xl border border-black rounded-lg overflow-hidden">
        <input
          className="flex-1 px-4 py-2 text-black bg-gray-100 focus:outline-none"
          placeholder="Write your promt here (ie: i want to plant rose flower ..)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-white border-l border-black hover:bg-gray-200"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </form>
  );
};

export default AiPromptInput;
