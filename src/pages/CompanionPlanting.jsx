import Title from "../compononts/Title";
import React, { useState, useRef, useEffect } from "react";
import { Camera, Scan, Leaf, Sparkles, X, Check, XCircle, HelpCircle } from "lucide-react";
import companionPlantsData from "../data/companionPlantsData.json";

const CompanionPlantingAR = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [plant1, setPlant1] = useState("");
  const [plant2, setPlant2] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [detectedPlants, setDetectedPlants] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Start Camera with better error handling
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setDetectedPlants([]);
      setResult(null);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Unable to access camera. Please check permissions.");
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setScanning(false);
  };

  // Capture and analyze plants
  const captureAndAnalyze = async () => {
    if (!cameraActive) return;
    
    setScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate plant detection progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 30;
        });
      }, 300);

      // Capture image from camera
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Simulate API call to plant detection
      setTimeout(() => {
        clearInterval(progressInterval);
        setScanProgress(100);
        
        // Mock detected plants (in real app, this would come from your plant detection API)
        const mockDetectedPlants = ['Tomato', 'Basil', 'Carrot', 'Rose'];
        const randomPlants = mockDetectedPlants
          .sort(() => 0.5 - Math.random())
          .slice(0, 2 + Math.floor(Math.random() * 2));
        
        setDetectedPlants(randomPlants);
        setScanning(false);
        
        // Auto-check compatibility if 2 plants detected
        if (randomPlants.length >= 2) {
          setTimeout(() => {
            checkCompatibility(randomPlants[0], randomPlants[1]);
          }, 1000);
        }
      }, 2000);
      
    } catch (error) {
      console.error("Analysis error:", error);
      setScanning(false);
    }
  };

  // Enhanced compatibility check
  const checkCompatibility = (p1 = plant1, p2 = plant2) => {
    if (!p1 || !p2) {
      alert("Please select both plants!");
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      let compatibilityResult;
      
      if (p1 === p2) {
        compatibilityResult = {
          message: `✅ Perfect! ${p1} grows well with itself!`,
          type: "good",
          description: "Plants of the same species naturally support each other's growth."
        };
      } else {
        const p1Data = companionPlantsData.find((p) => p.name === p1);
        const p2Data = companionPlantsData.find((p) => p.name === p2);

        if (!p1Data || !p2Data) {
          compatibilityResult = {
            message: `❓ Limited data available for ${p1} and ${p2}`,
            type: "neutral",
            description: "We recommend consulting additional gardening resources."
          };
        } else if (p1Data.goodCompanions.includes(p2)) {
          compatibilityResult = {
            message: `✅ Excellent Companions!`,
            type: "good",
            description: `${p1} and ${p2} support each other's growth and health.`,
            benefits: p1Data.benefits || [],
            plant1Data: p1Data,
            plant2Data: p2Data
          };
        } else if (p1Data.badCompanions.includes(p2)) {
          compatibilityResult = {
            message: `❌ Poor Companions`,
            type: "bad",
            description: `${p1} and ${p2} may compete for resources or inhibit growth.`,
            warnings: p1Data.warnings || [],
            plant1Data: p1Data,
            plant2Data: p2Data
          };
        } else {
          compatibilityResult = {
            message: `⚡ Neutral Companions`,
            type: "neutral",
            description: `${p1} and ${p2} can be planted together without significant benefits or issues.`,
            plant1Data: p1Data,
            plant2Data: p2Data
          };
        }
      }
      
      setResult(compatibilityResult);
      setLoading(false);
    }, 1500);
  };

  // Use detected plants
  const useDetectedPlant = (plantName, position) => {
    if (position === 1) {
      setPlant1(plantName);
    } else {
      setPlant2(plantName);
    }
    setManualMode(true);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <Title text1={"COMPANION"} text2={"PLANTING AR"} />
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Use your camera to detect plants and discover which combinations grow best together for healthier gardens!
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200 max-w-4xl mx-auto mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Smart Companion Planting</h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">Good Companions</span>
                  </div>
                  <p className="text-green-600">Plants that help each other grow better</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-700">Bad Companions</span>
                  </div>
                  <p className="text-red-600">Plants that compete or cause issues</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-700">AR Detection</span>
                  </div>
                  <p className="text-yellow-600">Use camera to automatically identify plants</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Camera & Detection */}
          <div className="space-y-6">
            
            {/* Camera Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-600" />
                AR Plant Detection
              </h3>
              
              {!cameraActive ? (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-12 border-4 border-dashed border-green-300">
                    <Camera className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Point your camera at plants to detect them automatically</p>
                  </div>
                  <button
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Camera className="w-5 h-5" />
                    Start AR Camera
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-4 border-green-500 bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-64 object-cover"
                    />
                    
                    {scanning && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p className="text-lg font-medium">Detecting Plants...</p>
                          <div className="w-48 bg-gray-600 rounded-full h-2 mt-4 mx-auto">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${scanProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <Scan className="w-4 h-4" />
                      Live Detection Active
                    </div>
                    
                    <button
                      onClick={stopCamera}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={captureAndAnalyze}
                    disabled={scanning}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Scan className="w-4 h-4" />
                    {scanning ? 'Scanning...' : 'Scan for Plants'}
                  </button>
                </div>
              )}
            </div>

            {/* Detected Plants */}
            {detectedPlants.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Detected Plants</h3>
                <div className="grid grid-cols-2 gap-3">
                  {detectedPlants.map((plant, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="font-medium text-green-800">{plant}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => useDetectedPlant(plant, 1)}
                          className="flex-1 bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          Plant 1
                        </button>
                        <button
                          onClick={() => useDetectedPlant(plant, 2)}
                          className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          Plant 2
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Manual Input & Results */}
          <div className="space-y-6">
            
            {/* Manual Mode */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Manual Plant Selection
              </h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌱 First Plant
                    </label>
                    <select
                      value={plant1}
                      onChange={(e) => setPlant1(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a plant...</option>
                      {companionPlantsData.map((plant) => (
                        <option key={plant.name} value={plant.name}>
                          {plant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌿 Second Plant
                    </label>
                    <select
                      value={plant2}
                      onChange={(e) => setPlant2(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a plant...</option>
                      {companionPlantsData.map((plant) => (
                        <option key={plant.name} value={plant.name}>
                          {plant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={() => checkCompatibility()}
                  disabled={!plant1 || !plant2 || loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Check Compatibility
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className={`rounded-2xl p-6 shadow-lg border ${
                result.type === "good" 
                  ? "bg-green-50 border-green-200" 
                  : result.type === "bad" 
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
              } animate-fade-in`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${
                    result.type === "good" 
                      ? "bg-green-100 text-green-600" 
                      : result.type === "bad" 
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {result.type === "good" ? <Check className="w-6 h-6" /> : 
                     result.type === "bad" ? <XCircle className="w-6 h-6" /> : 
                     <HelpCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{result.message}</h3>
                    <p className="text-sm opacity-75">{result.description}</p>
                  </div>
                </div>

                {/* Additional Details */}
                {result.plant1Data && result.plant2Data && (
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white rounded-xl p-4 border">
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        {plant1}'s Companions
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-green-600">Good Companions:</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.plant1Data.goodCompanions.slice(0, 5).map((companion) => (
                              <span key={companion} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                {companion}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-red-600">Avoid Planting With:</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.plant1Data.badCompanions.slice(0, 5).map((companion) => (
                              <span key={companion} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                                {companion}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border">
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        {plant2}'s Companions
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-green-600">Good Companions:</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.plant2Data.goodCompanions.slice(0, 5).map((companion) => (
                              <span key={companion} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                {companion}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-red-600">Avoid Planting With:</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.plant2Data.badCompanions.slice(0, 5).map((companion) => (
                              <span key={companion} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                                {companion}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CompanionPlantingAR;


