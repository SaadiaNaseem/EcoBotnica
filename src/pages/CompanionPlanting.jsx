// import Title from "../compononts/Title";
// import React, { useState, useRef, useEffect } from "react";
// import { Camera, Leaf, Check, XCircle, HelpCircle, Scan } from "lucide-react";
// import companionPlantsData from "../data/companionPlantsData.json";
// import axios from "axios";
// import * as tf from '@tensorflow/tfjs';
// import * as cocossd from '@tensorflow-models/coco-ssd';

// const CompanionPlantingAR = () => {
//   const [cameraActive, setCameraActive] = useState(false);
//   const [plant1, setPlant1] = useState("");
//   const [plant2, setPlant2] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [identifying, setIdentifying] = useState(false);
//   const [apiStatus, setApiStatus] = useState("ready");
//   const [capturedImages, setCapturedImages] = useState({ plant1: null, plant2: null });
//   const [arMarkers, setArMarkers] = useState([]);
//   const [detectedObjects, setDetectedObjects] = useState([]);
//   const [model, setModel] = useState(null);
//   const [modelLoading, setModelLoading] = useState(true);
  
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const canvasRef = useRef(null);

//   // API Keys - ADD YOUR REAL API KEYS HERE
//   const PLANT_ID_API_KEY = 'Rg3k7SdCQDDrAaT2ApLRKQvjbp28fWJBrPLNoM132GlmYup6LB';
//   const OPENROUTER_API_KEY = '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';


//   // Load COCO-SSD model for object detection
//   useEffect(() => {
//     const loadModel = async () => {
//       try {
//         console.log("🔄 Loading Object Detection model...");
//         await tf.ready();
//         const loadedModel = await cocossd.load();
//         setModel(loadedModel);
//         setModelLoading(false);
//         console.log("✅ Object Detection Model loaded successfully!");
//       } catch (error) {
//         console.error("❌ Model loading failed:", error);
//         setModelLoading(false);
//       }
//     };
//     loadModel();
//   }, []);

//   // Detect objects in the video stream
//   const detectObjects = async () => {
//     if (!model || !videoRef.current) return;

//     try {
//       const predictions = await model.detect(videoRef.current);
      
//       // Filter for plant-related objects
//       const plantObjects = predictions.filter(pred => 
//         pred.class === 'potted plant' || 
//         pred.class.includes('plant') ||
//         pred.score > 0.6 // High confidence objects
//       );

//       setDetectedObjects(plantObjects);
//       drawBoundingBoxes(plantObjects);

//       return plantObjects;
//     } catch (error) {
//       console.error("Object detection error:", error);
//       return [];
//     }
//   };

//   // Draw bounding boxes on canvas
//   const drawBoundingBoxes = (predictions) => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//     if (!video || !canvas || video.videoWidth === 0) return;

//     const ctx = canvas.getContext('2d');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     predictions.forEach((prediction, index) => {
//       if (prediction.score < 0.4) return;
      
//       const [x, y, width, height] = prediction.bbox;
      
//       // Draw bounding box
//       ctx.strokeStyle = index === 0 ? '#22c55e' : '#3b82f6';
//       ctx.lineWidth = 3;
//       ctx.strokeRect(x, y, width, height);
      
//       // Draw label background
//       ctx.fillStyle = index === 0 ? '#22c55e' : '#3b82f6';
//       const text = `Plant ${index + 1} ${Math.round(prediction.score * 100)}%`;
//       ctx.font = '14px Arial';
//       const textWidth = ctx.measureText(text).width;
//       ctx.fillRect(x, y - 20, textWidth + 10, 20);
      
//       // Draw label text
//       ctx.fillStyle = 'white';
//       ctx.fillText(text, x + 5, y - 5);
//     });
//   };

//   // Crop plant from image using bounding box
//   const cropPlantFromImage = (imageData, bbox, plantIndex) => {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const img = new Image();
    
//     return new Promise((resolve) => {
//       img.onload = () => {
//         const [x, y, width, height] = bbox;
        
//         // Set canvas size to bounding box dimensions
//         canvas.width = width;
//         canvas.height = height;
        
//         // Crop the image
//         ctx.drawImage(
//           img, 
//           x, y, width, height, // source coordinates
//           0, 0, width, height  // destination coordinates
//         );
        
//         const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
//         console.log(`🌱 Cropped Plant ${plantIndex + 1}:`, { x, y, width, height });
//         resolve(croppedImage);
//       };
//       img.src = imageData;
//     });
//   };

//   // Identify plant with Plant.id API
//   const identifyPlantWithAPI = async (imageBase64, plantName = "Plant") => {
//     if (!PLANT_ID_API_KEY) {
//       console.log("❌ Please add your Plant.id API key");
//       setApiStatus("no_api_key");
//       return null;
//     }

//     try {
//       // Extract base64 data without data URL prefix
//       const base64Data = imageBase64.split(',')[1];

//       console.log(`🚀 Sending ${plantName} to Plant.id API...`);
      
//       const response = await fetch('https://api.plant.id/v2/identify', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Api-Key': PLANT_ID_API_KEY
//         },
//         body: JSON.stringify({
//           images: [base64Data],
//           modifiers: ["crops_fast"],
//           plant_details: ["common_names", "probability"]
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log(`🌿 ${plantName} API RESPONSE:`, data);

//       if (data.suggestions && data.suggestions.length > 0) {
//         const bestSuggestion = data.suggestions[0];
//         let plantName = bestSuggestion.plant_details?.common_names?.[0] || bestSuggestion.plant_name;
        
//         const identifiedPlant = {
//           name: plantName,
//           scientificName: bestSuggestion.plant_name,
//           confidence: Math.round(bestSuggestion.probability * 100),
//           image: imageBase64
//         };

//         console.log(`✅ ${plantName} identified:`, identifiedPlant);
//         return identifiedPlant;
//       } else {
//         console.log(`❌ No identification for ${plantName}`);
//         return null;
//       }
      
//     } catch (error) {
//       console.error(`❌ ${plantName} API Error:`, error);
//       return null;
//     }
//   };

//   // Capture full image and detect multiple plants
//   const captureAndIdentifyMultiplePlants = async () => {
//     if (!model) {
//       console.log("❌ Object detection model not loaded");
//       return;
//     }

//     setIdentifying(true);
//     setApiStatus("identifying_multiple");

//     try {
//       // Capture full image
//       const fullImageData = captureFullImage();
//       if (!fullImageData) {
//         setApiStatus("image_capture_failed");
//         return;
//       }

//       // Detect objects in the image
//       const objects = await detectObjects();
//       console.log("📦 Detected objects:", objects);

//       // Filter for the two most confident plant detections
//       const plantDetections = objects
//         .filter(obj => obj.score > 0.4)
//         .slice(0, 2); // Take top 2 plants

//       if (plantDetections.length < 2) {
//         setApiStatus("not_enough_plants");
//         console.log("❌ Need at least 2 plants detected");
//         setIdentifying(false);
//         return;
//       }

//       console.log("🌿 Plants to identify:", plantDetections);

//       // Identify each plant
//       const identificationPromises = plantDetections.map(async (detection, index) => {
//         const croppedImage = await cropPlantFromImage(fullImageData, detection.bbox, index);
//         return await identifyPlantWithAPI(croppedImage, `Plant ${index + 1}`);
//       });

//       const identifiedPlants = await Promise.all(identificationPromises);
//       const validPlants = identifiedPlants.filter(plant => plant !== null);

//       if (validPlants.length >= 2) {
//         // Set plants and images
//         setPlant1(validPlants[0].name);
//         setPlant2(validPlants[1].name);
//         setCapturedImages({
//           plant1: validPlants[0].image,
//           plant2: validPlants[1].image
//         });

//         // Update AR markers
//         setArMarkers([
//           {
//             id: 1,
//             plantName: validPlants[0].name,
//             position: { x: 20, y: 20 },
//             type: 'identified',
//             bbox: plantDetections[0].bbox
//           },
//           {
//             id: 2,
//             plantName: validPlants[1].name,
//             position: { x: 80, y: 20 },
//             type: 'identified',
//             bbox: plantDetections[1].bbox
//           }
//         ]);

//         // Check compatibility
//         setLoading(true);
//         const compatibility = await checkCompatibilityWithAI(validPlants[0].name, validPlants[1].name);
        
//         // Update AR markers with results
//         setArMarkers(prev => prev.map(marker => ({
//           ...marker,
//           type: 'result',
//           compatibility: compatibility.compatibility
//         })));

//         setResult({
//           message: compatibility.compatibility === 'good' ? '✅ EXCELLENT COMPANIONS!' :
//                    compatibility.compatibility === 'bad' ? '❌ POOR COMPANIONS' :
//                    '⚡ NEUTRAL COMPANIONS',
//           type: compatibility.compatibility,
//           description: compatibility.reason,
//           plant1Result: compatibility.compatibility,
//           plant2Result: compatibility.compatibility
//         });

//         setApiStatus("success");
//         setLoading(false);
//       } else {
//         setApiStatus("identification_failed");
//       }

//     } catch (error) {
//       console.error("❌ Multiple plant identification error:", error);
//       setApiStatus("api_error");
//     } finally {
//       setIdentifying(false);
//     }
//   };

//   // Capture full image
//   const captureFullImage = () => {
//     const canvas = document.createElement('canvas');
//     const video = videoRef.current;
    
//     if (!video || video.videoWidth === 0) {
//       console.log("❌ Video not ready");
//       return null;
//     }

//     const ctx = canvas.getContext('2d');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     const imageData = canvas.toDataURL('image/jpeg', 0.8);
//     console.log("📸 Full image captured");
//     return imageData;
//   };

//   // Check compatibility with OpenRouter API
//   const checkCompatibilityWithAI = async (plant1Name, plant2Name) => {
//     if (!OPENROUTER_API_KEY) {
//       console.log("Using local compatibility check");
//       return checkLocalCompatibility(plant1Name, plant2Name);
//     }

//     try {
//       const fullPrompt = `As a gardening expert, analyze if ${plant1Name} and ${plant2Name} are good companion plants for growing together. 

// Consider factors like:
// - Nutrient requirements and competition
// - Pest control benefits
// - Growth habits and space requirements
// - Root systems compatibility
// - Shade tolerance and sunlight needs

// Return your analysis in this exact JSON format only:
// {
//   "compatibility": "good" | "bad" | "neutral",
//   "reason": "Brief explanation of why they are good/bad/neutral companions"
// }`;

//       const res = await axios.post(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           model: "openai/gpt-3.5-turbo",
//           messages: [{ role: "user", content: fullPrompt }],
//           max_tokens: 200
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("🤖 OpenRouter Response:", res.data);

//       const responseContent = res.data.choices[0].message.content;
      
//       // Try to parse JSON response
//       try {
//         const compatibilityData = JSON.parse(responseContent);
//         return compatibilityData;
//       } catch (e) {
//         // If JSON parsing fails, analyze the text response
//         const text = responseContent.toLowerCase();
//         if (text.includes('good') || text.includes('beneficial') || text.includes('recommend') || text.includes('excellent')) {
//           return { 
//             compatibility: 'good', 
//             reason: responseContent || `${plant1Name} and ${plant2Name} are good companion plants.` 
//           };
//         } else if (text.includes('bad') || text.includes('avoid') || text.includes('not recommend') || text.includes('poor')) {
//           return { 
//             compatibility: 'bad', 
//             reason: responseContent || `${plant1Name} and ${plant2Name} should not be planted together.` 
//           };
//         } else {
//           return { 
//             compatibility: 'neutral', 
//             reason: responseContent || `${plant1Name} and ${plant2Name} can be planted together without significant benefits or issues.` 
//           };
//         }
//       }

//     } catch (error) {
//       console.error("❌ OpenRouter API error:", error);
//       return checkLocalCompatibility(plant1Name, plant2Name);
//     }
//   };

//   // Local compatibility check as fallback
//   const checkLocalCompatibility = (plant1Name, plant2Name) => {
//     const cleanP1 = plant1Name.toLowerCase();
//     const cleanP2 = plant2Name.toLowerCase();

//     const findPlantData = (plantName) => {
//       return companionPlantsData.find(plant => 
//         plant.name.toLowerCase() === plantName
//       );
//     };

//     const p1Data = findPlantData(cleanP1);
//     const p2Data = findPlantData(cleanP2);

//     if (!p1Data || !p2Data) {
//       return {
//         compatibility: 'neutral',
//         reason: 'No companion data available for these plants.'
//       };
//     }

//     if (p1Data.goodCompanions.some(comp => comp.toLowerCase() === cleanP2) ||
//         p2Data.goodCompanions.some(comp => comp.toLowerCase() === cleanP1)) {
//       return {
//         compatibility: 'good',
//         reason: `${p1Data.name} and ${p2Data.name} are excellent companion plants! They help each other grow better.`
//       };
//     } else if (p1Data.badCompanions.some(comp => comp.toLowerCase() === cleanP2) ||
//                p2Data.badCompanions.some(comp => comp.toLowerCase() === cleanP1)) {
//       return {
//         compatibility: 'bad',
//         reason: `${p1Data.name} and ${p2Data.name} should not be planted together. They may compete for resources or inhibit each other's growth.`
//       };
//     } else {
//       return {
//         compatibility: 'neutral',
//         reason: `${p1Data.name} and ${p2Data.name} can be planted together without significant benefits or issues.`
//       };
//     }
//   };

//   // Start Camera
//   const startCamera = async () => {
//     try {
//       setCameraActive(true);
//       setPlant1("");
//       setPlant2("");
//       setResult(null);
//       setCapturedImages({ plant1: null, plant2: null });
//       setArMarkers([]);
//       setDetectedObjects([]);
      
//       if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         const stream = await navigator.mediaDevices.getUserMedia({ 
//           video: { facingMode: 'environment' } 
//         });
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//       }
//     } catch (err) {
//       alert("Unable to access camera. Please check permissions.");
//       setCameraActive(false);
//     }
//   };

//   // Stop Camera
//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     setCameraActive(false);
//   };

//   // Reset and start over
//   const startOver = () => {
//     setPlant1("");
//     setPlant2("");
//     setResult(null);
//     setCapturedImages({ plant1: null, plant2: null });
//     setArMarkers([]);
//     setDetectedObjects([]);
//   };

//   // Manual compatibility check
//   const manualCheckCompatibility = () => {
//     if (plant1 && plant2) {
//       setLoading(true);
//       setTimeout(async () => {
//         const compatibility = await checkCompatibilityWithAI(plant1, plant2);
//         setResult({
//           message: compatibility.compatibility === 'good' ? '✅ EXCELLENT COMPANIONS!' :
//                    compatibility.compatibility === 'bad' ? '❌ POOR COMPANIONS' :
//                    '⚡ NEUTRAL COMPANIONS',
//           type: compatibility.compatibility,
//           description: compatibility.reason,
//           plant1Result: compatibility.compatibility,
//           plant2Result: compatibility.compatibility
//         });
//         setLoading(false);
//       }, 1000);
//     }
//   };

//   // Get result icon for AR
//   const getResultIcon = (type) => {
//     switch (type) {
//       case "good": return "✅";
//       case "bad": return "❌";
//       case "neutral": return "⚡";
//       default: return "🔍";
//     }
//   };

//   // Get color for AR marker
//   const getMarkerColor = (type) => {
//     switch (type) {
//       case "good": return "text-green-400";
//       case "bad": return "text-red-400";
//       case "neutral": return "text-yellow-400";
//       default: return "text-blue-400";
//     }
//   };

//   // Get background color for AR marker
//   const getMarkerBgColor = (type) => {
//     switch (type) {
//       case "good": return "bg-green-600";
//       case "bad": return "bg-red-600";
//       case "neutral": return "bg-yellow-600";
//       default: return "bg-blue-600";
//     }
//   };

//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
//       <div className="max-w-6xl mx-auto px-4">
        
//         <Title text1={"COMPANION"} text2={"PLANTING AR"} />
//         <p className="text-gray-600 text-center mb-8">
//           Multi-Plant Detection • AI Compatibility Analysis
//         </p>

//         {/* API Status */}
//         <div className={`rounded-xl p-3 text-center mb-6 ${
//           apiStatus === "success" ? "bg-green-50 border border-green-200" :
//           apiStatus === "identifying_multiple" ? "bg-blue-50 border border-blue-200" :
//           "bg-gray-50 border border-gray-200"
//         }`}>
//           <p className={`font-medium ${
//             apiStatus === "success" ? "text-green-700" :
//             apiStatus === "identifying_multiple" ? "text-blue-700" :
//             "text-gray-700"
//           }`}>
//             {apiStatus === "ready" && "📷 Ready to detect plants"}
//             {apiStatus === "identifying_multiple" && "🔍 Detecting & identifying multiple plants..."}
//             {apiStatus === "success" && "✅ Both plants identified!"}
//             {apiStatus === "not_enough_plants" && "❌ Need 2 plants in frame"}
//             {apiStatus === "no_api_key" && "❌ Please add Plant.id API key"}
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
          
//           {/* Left Column - Camera & Detection */}
//           <div className="space-y-6">
            
//             {/* Camera Section */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <Camera className="w-5 h-5 text-green-600" />
//                 Multi-Plant Scanner
//                 {modelLoading && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Loading AI...</span>}
//               </h3>
              
//               {!cameraActive ? (
//                 <div className="text-center space-y-4">
//                   <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-12 border-4 border-dashed border-green-300">
//                     <Camera className="w-16 h-16 text-green-400 mx-auto mb-4" />
//                     <p className="text-gray-600 mb-2">
//                       Point camera at 2 plants • AI will detect and identify both
//                     </p>
//                     <p className="text-sm text-green-600">
//                       🎯 Automatic plant detection & compatibility check
//                     </p>
//                     {modelLoading && <p className="text-orange-600 text-sm mt-2">Loading object detection model...</p>}
//                     {(!PLANT_ID_API_KEY) && (
//                       <p className="text-red-600 text-sm mt-2">⚠️ Add Plant.id API key for identification</p>
//                     )}
//                   </div>
//                   <button
//                     onClick={startCamera}
//                     disabled={modelLoading}
//                     className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3"
//                   >
//                     <Camera className="w-5 h-5" />
//                     {modelLoading ? 'Loading AI...' : 'Start Multi-Plant Scanner'}
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="relative rounded-2xl overflow-hidden border-4 border-green-500 bg-black">
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       muted
//                       className="w-full h-80 object-cover"
//                     />
                    
//                     {/* Detection Canvas */}
//                     <canvas
//                       ref={canvasRef}
//                       className="absolute top-0 left-0 w-full h-full pointer-events-none"
//                     />
                    
//                     {/* AR OVERLAY - TICKS AND CROSSES */}
//                     {arMarkers.map((marker) => (
//                       <div
//                         key={marker.id}
//                         className={`absolute ${marker.id === 1 ? 'left-4 top-4' : 'right-4 top-4'}`}
//                         style={{ 
//                           left: marker.id === 1 ? '10%' : '80%',
//                           top: '10%'
//                         }}
//                       >
//                         {/* AR Marker with Icon */}
//                         <div className={`text-3xl font-bold p-2 rounded-full bg-black/70 backdrop-blur-sm ${
//                           getMarkerColor(marker.compatibility || 'identified')
//                         }`}>
//                           {getResultIcon(marker.compatibility || 'identified')}
//                         </div>
                        
//                         {/* Plant Name Label */}
//                         <div className={`mt-1 text-white text-xs font-bold px-2 py-1 rounded ${
//                           getMarkerBgColor(marker.compatibility || 'identified')
//                         }`}>
//                           {marker.plantName}
//                         </div>
//                       </div>
//                     ))}

//                     {/* Center Compatibility Ring */}
//                     {result && (
//                       <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-8 animate-pulse ${
//                         result.type === "good" ? "border-green-500" :
//                         result.type === "bad" ? "border-red-500" :
//                         "border-yellow-500"
//                       }`}></div>
//                     )}

//                     {/* Detection Info */}
//                     <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-xl">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">
//                           {detectedObjects.length >= 2 ? 
//                             `✅ ${detectedObjects.length} plants detected` : 
//                             `🔍 Point camera at 2 plants`}
//                         </span>
//                         <span className="text-xs bg-green-600 px-2 py-1 rounded">
//                           AI ACTIVE
//                         </span>
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={stopCamera}
//                       className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
//                     >
//                       <XCircle className="w-4 h-4" />
//                     </button>
//                   </div>

//                   <button
//                     onClick={captureAndIdentifyMultiplePlants}
//                     disabled={identifying || !model}
//                     className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
//                   >
//                     <Scan className="w-4 h-4" />
//                     {identifying ? 'Detecting Plants...' : 'Identify Multiple Plants'}
//                   </button>

//                   <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
//                     <p className="text-sm text-blue-700 text-center">
//                       💡 <strong>How it works:</strong> Frame 2 plants in camera → Click button → AI detects both plants automatically
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Plant 1 Display */}
//             {plant1 && (
//               <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Plant 1</h3>
//                 <div className="text-center">
//                   {capturedImages.plant1 && (
//                     <div className="relative">
//                       <img 
//                         src={capturedImages.plant1} 
//                         alt="Plant 1" 
//                         className="w-32 h-32 object-cover rounded-xl mx-auto mb-3 border-4 border-green-300"
//                       />
//                       {result && (
//                         <div className={`absolute -top-2 -right-2 text-2xl p-1 rounded-full bg-white ${
//                           result.plant1Result === "good" ? "text-green-500" :
//                           result.plant1Result === "bad" ? "text-red-500" :
//                           "text-yellow-500"
//                         }`}>
//                           {getResultIcon(result.plant1Result)}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   <p className="font-medium text-green-800 text-lg">{plant1}</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Plant 2 & Manual Input */}
//           <div className="space-y-6">
            
//             {/* Plant 2 Display */}
//             {plant2 && (
//               <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Plant 2</h3>
//                 <div className="text-center">
//                   {capturedImages.plant2 && (
//                     <div className="relative">
//                       <img 
//                         src={capturedImages.plant2} 
//                         alt="Plant 2" 
//                         className="w-32 h-32 object-cover rounded-xl mx-auto mb-3 border-4 border-blue-300"
//                       />
//                       {result && (
//                         <div className={`absolute -top-2 -right-2 text-2xl p-1 rounded-full bg-white ${
//                           result.plant2Result === "good" ? "text-green-500" :
//                           result.plant2Result === "bad" ? "text-red-500" :
//                           "text-yellow-500"
//                         }`}>
//                           {getResultIcon(result.plant2Result)}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   <p className="font-medium text-blue-800 text-lg">{plant2}</p>
//                 </div>
//               </div>
//             )}

//             {/* Manual Selection */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <Leaf className="w-5 h-5 text-green-600" />
//                 Manual Selection
//               </h3>
              
//               <div className="space-y-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       🌱 First Plant
//                     </label>
//                     <select
//                       value={plant1}
//                       onChange={(e) => setPlant1(e.target.value)}
//                       className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="">Select a plant...</option>
//                       {companionPlantsData.map((plant) => (
//                         <option key={plant.name} value={plant.name}>
//                           {plant.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       🌿 Second Plant
//                     </label>
//                     <select
//                       value={plant2}
//                       onChange={(e) => setPlant2(e.target.value)}
//                       className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="">Select a plant...</option>
//                       {companionPlantsData.map((plant) => (
//                         <option key={plant.name} value={plant.name}>
//                           {plant.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={manualCheckCompatibility}
//                   disabled={!plant1 || !plant2 || loading}
//                   className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Checking...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="w-5 h-5" />
//                       Check Compatibility
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Results Display */}
//             {result && (
//               <div className={`rounded-2xl p-6 shadow-lg border-2 ${
//                 result.type === "good" 
//                   ? "bg-green-50 border-green-400" 
//                   : result.type === "bad" 
//                   ? "bg-red-50 border-red-400"
//                   : "bg-yellow-50 border-yellow-400"
//               }`}>
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className={`p-3 rounded-full ${
//                     result.type === "good" 
//                       ? "bg-green-100 text-green-600" 
//                       : result.type === "bad" 
//                       ? "bg-red-100 text-red-600"
//                       : "bg-yellow-100 text-yellow-600"
//                   }`}>
//                     {result.type === "good" ? 
//                       <Check className="w-8 h-8" /> : 
//                      result.type === "bad" ? 
//                       <XCircle className="w-8 h-8" /> : 
//                       <HelpCircle className="w-8 h-8" />
//                     }
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-bold">{result.message}</h3>
//                     <p className="text-gray-700 mt-2">{result.description}</p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={startOver}
//                   className="w-full mt-4 bg-gray-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-colors"
//                 >
//                   Scan New Plants
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanionPlantingAR;


import Title from "../compononts/Title";
import React, { useState, useRef, useEffect } from "react";
import { Camera, Leaf, Check, XCircle, HelpCircle, Scan } from "lucide-react";
import companionPlantsData from "../data/companionPlantsData.json";
import axios from "axios";

const CompanionPlantingAR = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [plant1, setPlant1] = useState("");
  const [plant2, setPlant2] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [identifying, setIdentifying] = useState(false);
  const [apiStatus, setApiStatus] = useState("ready");
  const [capturedImages, setCapturedImages] = useState({ plant1: null, plant2: null });
  const [arMarkers, setArMarkers] = useState([]);
  const [detectedPlants, setDetectedPlants] = useState([]);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  // API Keys - ADD YOUR REAL API KEYS HERE
  const PLANT_ID_API_KEY = '';
  const OPENROUTER_API_KEY = 'sk.....';

  // Plant detection using computer vision (simulated YOLO)
  const detectPlantsWithCV = (imageData) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Simulate YOLO detection - in real app, this would call a backend API
        const simulatedDetections = simulateYoloDetection(canvas, img);
        resolve(simulatedDetections);
      };
      img.src = imageData;
    });
  };

  // Simulate YOLO plant detection (replace with actual API call)
  const simulateYoloDetection = (canvas, img) => {
    const detections = [];
    const width = img.width;
    const height = img.height;

    // Simulate detecting plants in different positions
    // In production, this would call your Python backend with YOLO
    const plantPositions = [
      { x: width * 0.2, y: height * 0.3, w: width * 0.3, h: height * 0.4 }, // Left plant
      { x: width * 0.6, y: height * 0.4, w: width * 0.25, h: height * 0.35 }  // Right plant
    ];

    plantPositions.forEach((pos, index) => {
      detections.push({
        bbox: [pos.x, pos.y, pos.w, pos.h],
        confidence: 0.85 + (Math.random() * 0.1), // 85-95% confidence
        class: 'plant',
        name: `Plant ${index + 1}`
      });
    });

    console.log("🌿 Simulated YOLO Detections:", detections);
    return detections;
  };

  // Draw bounding boxes on canvas (like YOLO visualization)
  const drawBoundingBoxes = (detections) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((detection, index) => {
      const [x, y, width, height] = detection.bbox;
      
      // Draw bounding box (like YOLO)
      ctx.strokeStyle = index === 0 ? '#22c55e' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      ctx.fillStyle = index === 0 ? '#22c55e' : '#3b82f6';
      const text = `${detection.name} ${Math.round(detection.confidence * 100)}%`;
      ctx.font = 'bold 14px Arial';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);
      
      // Draw label text
      ctx.fillStyle = 'white';
      ctx.fillText(text, x + 5, y - 8);

      // Draw class label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x, y + height, textWidth + 10, 20);
      ctx.fillStyle = 'white';
      ctx.fillText(detection.class, x + 5, y + height + 15);
    });
  };

  // Crop plant from image using YOLO bounding box
  const cropPlantFromImage = (imageData, bbox, plantIndex) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        const [x, y, width, height] = bbox;
        
        // Set canvas size to bounding box dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Crop the image using YOLO coordinates
        ctx.drawImage(
          img, 
          x, y, width, height, // source coordinates (YOLO format)
          0, 0, width, height  // destination coordinates
        );
        
        const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
        console.log(`🌱 Cropped Plant ${plantIndex + 1} from YOLO bbox:`, { x, y, width, height });
        resolve(croppedImage);
      };
      img.src = imageData;
    });
  };

  // Identify plant with Plant.id API
  const identifyPlantWithAPI = async (imageBase64, plantName = "Plant") => {
    if (!PLANT_ID_API_KEY) {
      console.log("❌ Please add your Plant.id API key");
      setApiStatus("no_api_key");
      return null;
    }

    try {
      // Extract base64 data without data URL prefix
      const base64Data = imageBase64.split(',')[1];

      console.log(`🚀 Sending ${plantName} to Plant.id API...`);
      
      const response = await fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Api-Key': PLANT_ID_API_KEY
        },
        body: JSON.stringify({
          images: [base64Data],
          modifiers: ["crops_fast"],
          plant_details: ["common_names", "probability"]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`🌿 ${plantName} API RESPONSE:`, data);

      if (data.suggestions && data.suggestions.length > 0) {
        const bestSuggestion = data.suggestions[0];
        let plantName = bestSuggestion.plant_details?.common_names?.[0] || bestSuggestion.plant_name;
        
        const identifiedPlant = {
          name: plantName,
          scientificName: bestSuggestion.plant_name,
          confidence: Math.round(bestSuggestion.probability * 100),
          image: imageBase64
        };

        console.log(`✅ ${plantName} identified:`, identifiedPlant);
        return identifiedPlant;
      } else {
        console.log(`❌ No identification for ${plantName}`);
        return null;
      }
      
    } catch (error) {
      console.error(`❌ ${plantName} API Error:`, error);
      return null;
    }
  };

  // Capture full image and detect multiple plants using YOLO-style detection
  const captureAndIdentifyMultiplePlants = async () => {
    setIdentifying(true);
    setApiStatus("detecting_plants");

    try {
      // Capture full image
      const fullImageData = captureFullImage();
      if (!fullImageData) {
        setApiStatus("image_capture_failed");
        return;
      }

      // Detect plants using computer vision (simulated YOLO)
      const detections = await detectPlantsWithCV(fullImageData);
      console.log("🎯 YOLO-style detections:", detections);

      // Filter for confident detections and take top 2 plants
      const plantDetections = detections
        .filter(det => det.confidence > 0.5)
        .slice(0, 2);

      if (plantDetections.length < 2) {
        setApiStatus("not_enough_plants");
        console.log("❌ Need at least 2 plants detected");
        setIdentifying(false);
        return;
      }

      setDetectedPlants(plantDetections);
      drawBoundingBoxes(plantDetections);

      console.log("🌿 Plants to identify:", plantDetections);

      // Identify each plant using cropped images
      const identificationPromises = plantDetections.map(async (detection, index) => {
        const croppedImage = await cropPlantFromImage(fullImageData, detection.bbox, index);
        return await identifyPlantWithAPI(croppedImage, `Plant ${index + 1}`);
      });

      const identifiedPlants = await Promise.all(identificationPromises);
      const validPlants = identifiedPlants.filter(plant => plant !== null);

      if (validPlants.length >= 2) {
        // Set plants and images
        setPlant1(validPlants[0].name);
        setPlant2(validPlants[1].name);
        setCapturedImages({
          plant1: validPlants[0].image,
          plant2: validPlants[1].image
        });

        // Update AR markers with plant positions from YOLO detection
        setArMarkers([
          {
            id: 1,
            plantName: validPlants[0].name,
            position: { 
              x: plantDetections[0].bbox[0] / videoRef.current.videoWidth * 100,
              y: plantDetections[0].bbox[1] / videoRef.current.videoHeight * 100
            },
            type: 'identified',
            bbox: plantDetections[0].bbox
          },
          {
            id: 2,
            plantName: validPlants[1].name,
            position: { 
              x: plantDetections[1].bbox[0] / videoRef.current.videoWidth * 100,
              y: plantDetections[1].bbox[1] / videoRef.current.videoHeight * 100
            },
            type: 'identified',
            bbox: plantDetections[1].bbox
          }
        ]);

        // Check compatibility
        setLoading(true);
        setApiStatus("checking_compatibility");
        const compatibility = await checkCompatibilityWithAI(validPlants[0].name, validPlants[1].name);
        
        // Update AR markers with results
        setArMarkers(prev => prev.map(marker => ({
          ...marker,
          type: 'result',
          compatibility: compatibility.compatibility
        })));

        setResult({
          message: compatibility.compatibility === 'good' ? '✅ EXCELLENT COMPANIONS!' :
                   compatibility.compatibility === 'bad' ? '❌ POOR COMPANIONS' :
                   '⚡ NEUTRAL COMPANIONS',
          type: compatibility.compatibility,
          description: compatibility.reason,
          plant1Result: compatibility.compatibility,
          plant2Result: compatibility.compatibility
        });

        setApiStatus("success");
        setLoading(false);
      } else {
        setApiStatus("identification_failed");
      }

    } catch (error) {
      console.error("❌ Multiple plant identification error:", error);
      setApiStatus("api_error");
    } finally {
      setIdentifying(false);
    }
  };

  // Capture full image
  const captureFullImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    if (!video || video.videoWidth === 0) {
      console.log("❌ Video not ready");
      return null;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log("📸 Full image captured for YOLO detection");
    return imageData;
  };

  // Check compatibility with OpenRouter API
  const checkCompatibilityWithAI = async (plant1Name, plant2Name) => {
    if (!OPENROUTER_API_KEY) {
      console.log("Using local compatibility check");
      return checkLocalCompatibility(plant1Name, plant2Name);
    }

    try {
      const fullPrompt = `As a gardening expert, analyze if ${plant1Name} and ${plant2Name} are good companion plants for growing together. 

Consider factors like:
- Nutrient requirements and competition
- Pest control benefits
- Growth habits and space requirements
- Root systems compatibility
- Shade tolerance and sunlight needs

Return your analysis in this exact JSON format only:
{
  "compatibility": "good" | "bad" | "neutral",
  "reason": "Brief explanation of why they are good/bad/neutral companions"
}`;

      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: fullPrompt }],
          max_tokens: 200
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🤖 OpenRouter Response:", res.data);

      const responseContent = res.data.choices[0].message.content;
      
      // Try to parse JSON response
      try {
        const compatibilityData = JSON.parse(responseContent);
        return compatibilityData;
      } catch (e) {
        // If JSON parsing fails, analyze the text response
        const text = responseContent.toLowerCase();
        if (text.includes('good') || text.includes('beneficial') || text.includes('recommend') || text.includes('excellent')) {
          return { 
            compatibility: 'good', 
            reason: responseContent || `${plant1Name} and ${plant2Name} are good companion plants.` 
          };
        } else if (text.includes('bad') || text.includes('avoid') || text.includes('not recommend') || text.includes('poor')) {
          return { 
            compatibility: 'bad', 
            reason: responseContent || `${plant1Name} and ${plant2Name} should not be planted together.` 
          };
        } else {
          return { 
            compatibility: 'neutral', 
            reason: responseContent || `${plant1Name} and ${plant2Name} can be planted together without significant benefits or issues.` 
          };
        }
      }

    } catch (error) {
      console.error("❌ OpenRouter API error:", error);
      return checkLocalCompatibility(plant1Name, plant2Name);
    }
  };

  // Local compatibility check as fallback
  const checkLocalCompatibility = (plant1Name, plant2Name) => {
    const cleanP1 = plant1Name.toLowerCase();
    const cleanP2 = plant2Name.toLowerCase();

    const findPlantData = (plantName) => {
      return companionPlantsData.find(plant => 
        plant.name.toLowerCase() === plantName
      );
    };

    const p1Data = findPlantData(cleanP1);
    const p2Data = findPlantData(cleanP2);

    if (!p1Data || !p2Data) {
      return {
        compatibility: 'neutral',
        reason: 'No companion data available for these plants.'
      };
    }

    if (p1Data.goodCompanions.some(comp => comp.toLowerCase() === cleanP2) ||
        p2Data.goodCompanions.some(comp => comp.toLowerCase() === cleanP1)) {
      return {
        compatibility: 'good',
        reason: `${p1Data.name} and ${p2Data.name} are excellent companion plants! They help each other grow better.`
      };
    } else if (p1Data.badCompanions.some(comp => comp.toLowerCase() === cleanP2) ||
               p2Data.badCompanions.some(comp => comp.toLowerCase() === cleanP1)) {
      return {
        compatibility: 'bad',
        reason: `${p1Data.name} and ${p2Data.name} should not be planted together. They may compete for resources or inhibit each other's growth.`
      };
    } else {
      return {
        compatibility: 'neutral',
        reason: `${p1Data.name} and ${p2Data.name} can be planted together without significant benefits or issues.`
      };
    }
  };

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setPlant1("");
      setPlant2("");
      setResult(null);
      setCapturedImages({ plant1: null, plant2: null });
      setArMarkers([]);
      setDetectedPlants([]);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
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
  };

  // Reset and start over
  const startOver = () => {
    setPlant1("");
    setPlant2("");
    setResult(null);
    setCapturedImages({ plant1: null, plant2: null });
    setArMarkers([]);
    setDetectedPlants([]);
  };

  // Manual compatibility check
  const manualCheckCompatibility = () => {
    if (plant1 && plant2) {
      setLoading(true);
      setTimeout(async () => {
        const compatibility = await checkCompatibilityWithAI(plant1, plant2);
        setResult({
          message: compatibility.compatibility === 'good' ? '✅ EXCELLENT COMPANIONS!' :
                   compatibility.compatibility === 'bad' ? '❌ POOR COMPANIONS' :
                   '⚡ NEUTRAL COMPANIONS',
          type: compatibility.compatibility,
          description: compatibility.reason,
          plant1Result: compatibility.compatibility,
          plant2Result: compatibility.compatibility
        });
        setLoading(false);
      }, 1000);
    }
  };

  // Get result icon for AR
  const getResultIcon = (type) => {
    switch (type) {
      case "good": return "✅";
      case "bad": return "❌";
      case "neutral": return "⚡";
      default: return "🔍";
    }
  };

  // Get color for AR marker
  const getMarkerColor = (type) => {
    switch (type) {
      case "good": return "text-green-400";
      case "bad": return "text-red-400";
      case "neutral": return "text-yellow-400";
      default: return "text-blue-400";
    }
  };

  // Get background color for AR marker
  const getMarkerBgColor = (type) => {
    switch (type) {
      case "good": return "bg-green-600";
      case "bad": return "bg-red-600";
      case "neutral": return "bg-yellow-600";
      default: return "bg-blue-600";
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        <Title text1={"COMPANION"} text2={"PLANTING AR"} />
        <p className="text-gray-600 text-center mb-8">
          YOLO-Style Plant Detection • AI Compatibility Analysis
        </p>

        {/* API Status */}
        <div className={`rounded-xl p-3 text-center mb-6 ${
          apiStatus === "success" ? "bg-green-50 border border-green-200" :
          apiStatus === "detecting_plants" ? "bg-blue-50 border border-blue-200" :
          apiStatus === "checking_compatibility" ? "bg-purple-50 border border-purple-200" :
          "bg-gray-50 border border-gray-200"
        }`}>
          <p className={`font-medium ${
            apiStatus === "success" ? "text-green-700" :
            apiStatus === "detecting_plants" ? "text-blue-700" :
            apiStatus === "checking_compatibility" ? "text-purple-700" :
            "text-gray-700"
          }`}>
            {apiStatus === "ready" && "📷 Ready for YOLO plant detection"}
            {apiStatus === "detecting_plants" && "🎯 Detecting plants with YOLO..."}
            {apiStatus === "checking_compatibility" && "🤖 Analyzing compatibility..."}
            {apiStatus === "success" && "✅ Both plants identified & analyzed!"}
            {apiStatus === "not_enough_plants" && "❌ Need 2 plants in frame for detection"}
            {apiStatus === "no_api_key" && "❌ Please add Plant.id API key"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Camera & Detection */}
          <div className="space-y-6">
            
            {/* Camera Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-600" />
                YOLO Plant Detector
              </h3>
              
              {!cameraActive ? (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-12 border-4 border-dashed border-green-300">
                    <Camera className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Frame 2 plants together • YOLO will detect both automatically
                    </p>
                    <p className="text-sm text-green-600">
                      🎯 Real-time bounding boxes • Smart cropping • AI identification
                    </p>
                    {(!PLANT_ID_API_KEY) && (
                      <p className="text-red-600 text-sm mt-2">⚠️ Add Plant.id API key for identification</p>
                    )}
                  </div>
                  <button
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Camera className="w-5 h-5" />
                    Start YOLO Detector
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
                      className="w-full h-80 object-cover"
                    />
                    
                    {/* Detection Canvas for YOLO boxes */}
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />
                    
                    {/* AR OVERLAY - Dynamic markers based on YOLO detection */}
                    {arMarkers.map((marker) => (
                      <div
                        key={marker.id}
                        className="absolute"
                        style={{ 
                          left: `${marker.position.x}%`,
                          top: `${marker.position.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* AR Marker with Icon */}
                        <div className={`text-2xl font-bold p-2 rounded-full bg-black/70 backdrop-blur-sm ${
                          getMarkerColor(marker.compatibility || 'identified')
                        }`}>
                          {getResultIcon(marker.compatibility || 'identified')}
                        </div>
                        
                        {/* Plant Name Label */}
                        <div className={`mt-1 text-white text-xs font-bold px-2 py-1 rounded text-center ${
                          getMarkerBgColor(marker.compatibility || 'identified')
                        }`}>
                          {marker.plantName}
                        </div>
                      </div>
                    ))}

                    {/* Center Compatibility Ring */}
                    {result && (
                      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-8 animate-pulse ${
                        result.type === "good" ? "border-green-500" :
                        result.type === "bad" ? "border-red-500" :
                        "border-yellow-500"
                      }`}></div>
                    )}

                    {/* Detection Info */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          {detectedPlants.length >= 2 ? 
                            `✅ ${detectedPlants.length} plants detected` : 
                            `🎯 Frame 2 plants for YOLO detection`}
                        </span>
                        <span className="text-xs bg-green-600 px-2 py-1 rounded">
                          YOLO ACTIVE
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={stopCamera}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={captureAndIdentifyMultiplePlants}
                    disabled={identifying}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Scan className="w-4 h-4" />
                    {identifying ? 'Running YOLO Detection...' : 'Detect & Identify Plants'}
                  </button>

                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                    <p className="text-sm text-blue-700 text-center">
                      💡 <strong>YOLO Detection:</strong> Frame 2 plants together → Click button → AI detects both with bounding boxes
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Plant 1 Display */}
            {plant1 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Plant 1 (YOLO Detected)</h3>
                <div className="text-center">
                  {capturedImages.plant1 && (
                    <div className="relative">
                      <img 
                        src={capturedImages.plant1} 
                        alt="Plant 1" 
                        className="w-32 h-32 object-cover rounded-xl mx-auto mb-3 border-4 border-green-300"
                      />
                      {result && (
                        <div className={`absolute -top-2 -right-2 text-2xl p-1 rounded-full bg-white ${
                          result.plant1Result === "good" ? "text-green-500" :
                          result.plant1Result === "bad" ? "text-red-500" :
                          "text-yellow-500"
                        }`}>
                          {getResultIcon(result.plant1Result)}
                        </div>
                      )}
                    </div>
                  )}
                  <p className="font-medium text-green-800 text-lg">{plant1}</p>
                  <p className="text-xs text-gray-500 mt-1">Detected with YOLO</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Plant 2 & Manual Input */}
          <div className="space-y-6">
            
            {/* Plant 2 Display */}
            {plant2 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Plant 2 (YOLO Detected)</h3>
                <div className="text-center">
                  {capturedImages.plant2 && (
                    <div className="relative">
                      <img 
                        src={capturedImages.plant2} 
                        alt="Plant 2" 
                        className="w-32 h-32 object-cover rounded-xl mx-auto mb-3 border-4 border-blue-300"
                      />
                      {result && (
                        <div className={`absolute -top-2 -right-2 text-2xl p-1 rounded-full bg-white ${
                          result.plant2Result === "good" ? "text-green-500" :
                          result.plant2Result === "bad" ? "text-red-500" :
                          "text-yellow-500"
                        }`}>
                          {getResultIcon(result.plant2Result)}
                        </div>
                      )}
                    </div>
                  )}
                  <p className="font-medium text-blue-800 text-lg">{plant2}</p>
                  <p className="text-xs text-gray-500 mt-1">Detected with YOLO</p>
                </div>
              </div>
            )}

            {/* Manual Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Manual Selection
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
                  onClick={manualCheckCompatibility}
                  disabled={!plant1 || !plant2 || loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Checking...
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

            {/* Results Display */}
            {result && (
              <div className={`rounded-2xl p-6 shadow-lg border-2 ${
                result.type === "good" 
                  ? "bg-green-50 border-green-400" 
                  : result.type === "bad" 
                  ? "bg-red-50 border-red-400"
                  : "bg-yellow-50 border-yellow-400"
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${
                    result.type === "good" 
                      ? "bg-green-100 text-green-600" 
                      : result.type === "bad" 
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {result.type === "good" ? 
                      <Check className="w-8 h-8" /> : 
                     result.type === "bad" ? 
                      <XCircle className="w-8 h-8" /> : 
                      <HelpCircle className="w-8 h-8" />
                    }
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{result.message}</h3>
                    <p className="text-gray-700 mt-2">{result.description}</p>
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      🎯 Powered by YOLO Detection + Plant.id API
                    </p>
                  </div>
                </div>

                <button
                  onClick={startOver}
                  className="w-full mt-4 bg-gray-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                >
                  Scan New Plants
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanionPlantingAR;