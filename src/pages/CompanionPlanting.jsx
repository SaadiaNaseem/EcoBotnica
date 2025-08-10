import Title from "../compononts/Title";
import React, { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react"; // for camera icon
import companionPlantsData from "../data/companionPlantsData.json";

const CompanionPlantingAR = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [plant1, setPlant1] = useState("");
  const [plant2, setPlant2] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);

  // Start Camera
  const startCamera = async () => {
    setCameraActive(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Handle Plant Compatibility Check
  const checkCompatibility = () => {
    if (!plant1 || !plant2) {
      alert("Please select both plants!");
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      if (plant1 === plant2) {
        setResult({
          message: "✅ Yes, ${plant1} with itself is naturally compatible!",
          type: "good",
        });
      } else {
        const p1Data = companionPlantsData.find((p) => p.name === plant1);
        const p2Data = companionPlantsData.find((p) => p.name === plant2);

        if (p1Data.goodCompanions.includes(plant2)) {
          setResult({
            message: "✅ Yes, ${plant1} & ${plant2} are Good Companions!",
            type: "good",
            plant1Data: p1Data,
            plant2Data: p2Data,
          });
        } else if (p1Data.badCompanions.includes(plant2)) {
          setResult({
            message: "❌ No, ${plant1} & ${plant2} are Bad Companions!",
            type: "bad",
            plant1Data: p1Data,
            plant2Data: p2Data,
          });
        } else {
          setResult({
            message: "🤔 Not Listed! No clear data about ${plant1} & ${plant2}.",
            type: "neutral",
            plant1Data: p1Data,
            plant2Data: p2Data,
          });
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="py-6">
      <div className="text-2xl mb-4">
        <Title text1={"COMPANION"} text2={"PLANTING"} />
      </div>

      {/* Info Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto shadow-md mb-5 transition hover:shadow-lg">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          What is Companion Planting?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Companion planting is the practice of growing different plants together to help
          each other grow better. Some plants improve soil nutrients, while others repel
          harmful pests. Our AR feature helps you easily see which plants are{" "}
          <span className="font-semibold text-green-600">good companions (Green)</span> and
          which are <span className="font-semibold text-red-600">bad companions (Red)</span>.
        </p>
      </div>

      {/* Camera Section */}
      <div className="flex flex-col items-center">
        {!cameraActive ? (
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
          >
            <Camera size={16} /> Start Camera
          </button>
        ) : (
          <div className="relative border-4 border-green-500 rounded-lg overflow-hidden w-full max-w-lg h-64 shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover animate-pulse"
            ></video>

            <div className="absolute top-2 left-2 bg-white bg-opacity-70 px-3 py-1 rounded text-sm text-green-700 font-medium animate-bounce">
              🔍 Detecting Plant...
            </div>

            <button
              onClick={stopCamera}
              className="absolute bottom-2 right-2 flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
            >
              Stop Camera
            </button>
          </div>
        )}
      </div>

      {/* Manual Mode Button */}
      {!manualMode && (
        <div className="mt-4 text-center flex flex-col items-center">
          <button
            onClick={() => setManualMode(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
          >
            🌱 Plant Not Detected? Select Manually
          </button>

        </div>
      )}

      {/* Manual Mode */}
      {manualMode && (
        <div className="mt-5 max-w-md mx-auto bg-white border rounded-lg p-4 shadow-md">
          <h3 className="text-green-700 font-semibold text-lg mb-2">Select Plants:</h3>
          <div className="flex gap-2">
            <select
              className="w-1/2 border rounded p-2"
              value={plant1}
              onChange={(e) => setPlant1(e.target.value)}
            >
              <option value="">-- Plant 1 --</option>
              {companionPlantsData.map((plant) => (
                <option key={plant.name} value={plant.name}>
                  {plant.name}
                </option>
              ))}
            </select>
            <select
              className="w-1/2 border rounded p-2"
              value={plant2}
              onChange={(e) => setPlant2(e.target.value)}
            >
              <option value="">-- Plant 2 --</option>
              {companionPlantsData.map((plant) => (
                <option key={plant.name} value={plant.name}>
                  {plant.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={checkCompatibility}
            className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
          >
            ✅ Check Compatibility
          </button>

          {/* Loading Animation */}
          {loading && (
            <div className="mt-3 text-center text-gray-600 animate-pulse">
              Checking compatibility...
            </div>
          )}

          {/* Result */}
          {result && !loading && (
           <div
  className={`mt-4 p-3 rounded text-center font-semibold ${
    result.type === "good"
      ? "bg-green-100 text-green-700"
      : result.type === "bad"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>

              {result.message}
            </div>
          )}

          {/* Good & Bad Companions */}
          {result && !loading && result.plant1Data && (
            <div className="mt-4">
              <h4 className="font-semibold text-green-700">
                🌱 {plant1}'s Good Companions:
              </h4>
              <ul className="list-disc ml-5 text-green-600">
                {result.plant1Data.goodCompanions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <h4 className="font-semibold text-red-700 mt-3">
                🚫 {plant1}'s Bad Companions:
              </h4>
              <ul className="list-disc ml-5 text-red-600">
                {result.plant1Data.badCompanions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          {result && !loading && result.plant2Data && (
            <div className="mt-4">
              <h4 className="font-semibold text-green-700">
                🌱 {plant2}'s Good Companions:
              </h4>
              <ul className="list-disc ml-5 text-green-600">
                {result.plant2Data.goodCompanions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <h4 className="font-semibold text-red-700 mt-3">
                🚫 {plant2}'s Bad Companions:
              </h4>
              <ul className="list-disc ml-5 text-red-600">
                {result.plant2Data.badCompanions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanionPlantingAR;