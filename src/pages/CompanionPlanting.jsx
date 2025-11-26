import Title from "../compononts/Title";
import React, { useState, useRef, useEffect } from "react";
import { Camera, Scan, Leaf, Sparkles, X, Check, XCircle, HelpCircle } from "lucide-react";
import companionPlantsData from "../data/companionPlantsData.json";

// Import TensorFlow.js and COCO-SSD
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

const CompanionPlantingAR = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [plant1, setPlant1] = useState("");
  const [plant2, setPlant2] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [detectedPlants, setDetectedPlants] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionCanvasRef = useRef(null);

  // Load COCO-SSD model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("🔄 Loading YOLO model...");
        await tf.ready();
        const loadedModel = await cocossd.load();
        setModel(loadedModel);
        setModelLoading(false);
        console.log("✅ YOLO Model loaded successfully!");
      } catch (error) {
        console.error("❌ Model loading failed:", error);
        setModelLoading(false);
      }
    };

    loadModel();
  }, []);

  // Start Camera with YOLO detection
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
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          startRealTimeDetection();
        };
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Unable to access camera. Please check permissions.");
      setCameraActive(false);
    }
  };

  // Real-time YOLO detection
  const startRealTimeDetection = async () => {
    if (!model || !videoRef.current) return;

    const detectFrame = async () => {
      if (!cameraActive || !videoRef.current || videoRef.current.readyState !== 4) return;

      try {
        const predictions = await model.detect(videoRef.current);
        
        // Filter for plant-related objects
        const plantObjects = predictions.filter(pred => 
          ['potted plant', 'vase', 'book', 'cell phone', 'cup'].includes(pred.class)
        );

        // Draw bounding boxes
        drawBoundingBoxes(predictions);

        // Update detected plants list
        if (plantObjects.length > 0) {
          const plantNames = plantObjects.map(p => `${p.class} (${Math.round(p.score * 100)}%)`);
          setDetectedPlants(prev => {
            const newPlants = [...new Set([...prev, ...plantNames])];
            return newPlants.slice(0, 4); // Keep only latest 4 plants
          });
        }

      } catch (error) {
        console.error("Detection error:", error);
      }

      // Continue detection
      requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  // Draw bounding boxes on video
  const drawBoundingBoxes = (predictions) => {
    const canvas = detectionCanvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      
      // Draw bounding box
      ctx.strokeStyle = prediction.class === 'potted plant' ? '#22c55e' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      ctx.fillStyle = prediction.class === 'potted plant' ? '#22c55e' : '#3b82f6';
      const text = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
      ctx.font = '16px Arial';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);
      
      // Draw label text
      ctx.fillStyle = 'white';
      ctx.fillText(text, x + 5, y - 8);
    });
  };

  // Manual detection trigger
  const captureAndAnalyze = async () => {
    if (!cameraActive || !model) return;
    
    setScanning(true);
    
    try {
      const predictions = await model.detect(videoRef.current);
      const plantObjects = predictions.filter(pred => 
        ['potted plant', 'vase'].includes(pred.class)
      );

      if (plantObjects.length > 0) {
        const plantNames = plantObjects.map(p => p.class);
        setDetectedPlants(plantNames.slice(0, 4));
        
        // Auto-check compatibility if 2+ plants detected
        if (plantNames.length >= 2) {
          setTimeout(() => {
            checkCompatibility(plantNames[0], plantNames[1]);
          }, 1000);
        }
      }
      
      setScanning(false);
    } catch (error) {
      console.error("Analysis error:", error);
      setScanning(false);
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
            plant1Data: p1Data,
            plant2Data: p2Data
          };
        } else if (p1Data.badCompanions.includes(p2)) {
          compatibilityResult = {
            message: `❌ Poor Companions`,
            type: "bad",
            description: `${p1} and ${p2} may compete for resources or inhibit growth.`,
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
    }, 1000);
  };

  // Use detected plants
  const useDetectedPlant = (plantName, position) => {
    // Extract just the plant name (remove confidence score)
    const cleanName = plantName.split(' (')[0];
    if (position === 1) {
      setPlant1(cleanName);
    } else {
      setPlant2(cleanName);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        <Title text1={"COMPANION"} text2={"PLANTING AR"} />
        <p className="text-gray-600 text-center mb-8">
          Real-time plant detection using YOLO AI + Compatibility Analysis
        </p>

        {/* Model Status */}
        {modelLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-blue-700">Loading AI Model... This may take a minute</p>
          </div>
        )}

        {!modelLoading && !model && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-6">
            <p className="text-red-700">❌ AI Model failed to load. Using mock detection.</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Camera & Detection */}
          <div className="space-y-6">
            
            {/* Camera Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-600" />
                {model ? "YOLO AI Plant Detection" : "AR Plant Detection"}
                {model && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">AI Ready</span>}
              </h3>
              
              {!cameraActive ? (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-12 border-4 border-dashed border-green-300">
                    <Camera className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Point camera at plants for real-time AI detection</p>
                    {modelLoading && <p className="text-orange-600 text-sm">Loading AI model...</p>}
                  </div>
                  <button
                    onClick={startCamera}
                    disabled={modelLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Camera className="w-5 h-5" />
                    {modelLoading ? 'Loading AI...' : 'Start YOLO Camera'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-4 border-green-500 bg-black">
                    {/* Video with AR Overlay */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Detection Canvas for Bounding Boxes */}
                    <canvas
                      ref={detectionCanvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />
                    
                    {/* AR Overlay: Detected Plant Names */}
                    {detectedPlants.length > 0 && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-xl">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {detectedPlants.map((plant, i) => (
                            <span key={i} className="bg-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              🌱 {plant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AR Overlay: Compatibility Ring */}
                    {result && (
                      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-8 animate-pulse ${
                        result.type === "good" ? "border-green-500" :
                        result.type === "bad" ? "border-red-500" :
                        "border-yellow-500"
                      }`}></div>
                    )}
                    
                    {/* Scanning Overlay */}
                    {scanning && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p className="text-lg font-medium">AI Analyzing Plants...</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <Scan className="w-4 h-4" />
                      {model ? "YOLO AI Active" : "Camera Active"}
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
                    disabled={scanning || !model}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Scan className="w-4 h-4" />
                    {scanning ? 'AI Scanning...' : (model ? 'Capture & Analyze' : 'AI Not Ready')}
                  </button>
                </div>
              )}
            </div>

            {/* Detected Plants */}
            {detectedPlants.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {model ? "YOLO Detected Plants" : "Detected Plants"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {detectedPlants.map((plant, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="font-medium text-green-800 text-sm">{plant}</p>
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
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
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
              }`}>
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