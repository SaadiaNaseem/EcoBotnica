import React, { useRef, useState, useEffect, useContext } from 'react';
import { Camera, Upload, CheckCircle, AlertTriangle, Info, X, Save } from "lucide-react";
import Title from "../compononts/Title";
import { Disease } from '../context/disease';

const PlantDoctor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [revealedSections, setRevealedSections] = useState([]);

  const { diagnoseDisease, response, loading, error } = useContext(Disease);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Reset sections when new diagnosis appears
  useEffect(() => {
    if (response && showDetails) {
      setCurrentSection(0);
      setRevealedSections([]);
      setShowSavePrompt(false);
      
      // Animate sections one by one
      const parsed = parseAIResponse(response);
      if (parsed) {
        const sectionKeys = Object.keys(parsed);
        const timers = [];
        
        sectionKeys.forEach((_, index) => {
          timers.push(
            setTimeout(() => {
              setRevealedSections(prev => [...prev, index]);
              setCurrentSection(index);
            }, (index + 1) * 800)
          );
        });
        
        // Show save prompt after all sections are revealed
        timers.push(
          setTimeout(() => {
            setShowSavePrompt(true);
          }, (sectionKeys.length + 1) * 800)
        );
        
        return () => timers.forEach(timer => clearTimeout(timer));
      }
    }
  }, [response, showDetails]);

  // Start camera
  const openCamera = async () => {
    setIsCameraOpen(true);
    setCapturedPhoto(null);
    setShowDetails(false);
    setSelectedImage(null);
    setImageFile(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Camera access failed. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!video || video.readyState !== 4) {
      alert("Camera not ready. Please try again.");
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const imageData = canvas.toDataURL('image/png');
        setCapturedPhoto(imageData);
        const file = new File([blob], "captured-plant.png", { type: "image/png" });
        setImageFile(file);
      }
    }, 'image/png');
    stopCamera();
  };

  const uploadCaptured = () => {
    setSelectedImage(capturedPhoto);
    setShowDetails(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file.");
        return;
      }
      
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setShowDetails(false);
      setCapturedPhoto(null);
      setIsCameraOpen(false);
    }
  };

  const handleStartScan = async () => {
    if (!selectedImage || !imageFile) {
      alert("Please upload an image before starting the scan.");
      return;
    }

    try {
      setShowDetails(false);
      await diagnoseDisease(imageFile);
      setShowDetails(true);
    } catch (error) {
      console.error("Error scanning plant:", error);
      alert("Failed to scan plant. Please try again.");
    }
  };

  const handleSaveDiagnosis = () => {
    // Simulate saving to profile
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSavePrompt(false);
    }, 3000);
  };

  const parseAIResponse = (responseText) => {
    if (!responseText || responseText.includes("no details found") || responseText.includes("❌")) {
      return null;
    }

    // Remove asterisks from the response for clean display
    const cleanResponse = responseText.replace(/\*/g, '');
    
    // Split by sections based on line breaks and colons
    const lines = cleanResponse.split('\n').filter(line => line.trim());
    const result = {};
    let currentSection = '';
    let currentContent = '';

    lines.forEach(line => {
      if (line.includes(':') && !line.trim().startsWith('-')) {
        // If we have a previous section, save it
        if (currentSection && currentContent) {
          result[currentSection] = currentContent.trim();
        }
        // Start new section
        const [section, ...content] = line.split(':');
        currentSection = section.trim();
        currentContent = content.join(':').trim();
      } else {
        // Continue adding to current section
        currentContent += '\n' + line.trim();
      }
    });

    // Don't forget the last section
    if (currentSection && currentContent) {
      result[currentSection] = currentContent.trim();
    }

    return Object.keys(result).length > 0 ? result : null;
  };

  const parsedResponse = parseAIResponse(response);

  // Get severity level for styling
  const getSeverityLevel = (value) => {
    if (!value) return 'low';
    
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes('severe') || lowerValue.includes('high')) return 'high';
    if (lowerValue.includes('moderate') || lowerValue.includes('medium')) return 'medium';
    return 'low';
  };

  return (
    <div className='py-8 min-h-screen bg-[#F4FFF4]'>
      {/* Title */}
      <div className="text-xl mb-6 text-center">
        <Title text1={"DISEASE"} text2={"DEDUCTION"} />
        <p className="text-gray-600 mt-1 max-w-2xl mx-auto text-sm">
          Upload or capture an image of your plant to diagnose potential diseases
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 px-4 max-w-6xl mx-auto h-[600px]">
        {/* Left Side - Image & Controls */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4">
          {/* Image Display */}
          <div className="flex-1">
            {/* Live Camera View */}
            {isCameraOpen && !capturedPhoto && (
              <div className="relative w-full h-full border border-gray-300 rounded-lg overflow-hidden animate-fade-in">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  <button
                    onClick={capturePhoto}
                    className="px-4 py-2 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all duration-200 shadow flex items-center gap-1"
                  >
                    <Camera size={14} /> Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 bg-gray-600 text-white rounded-full text-xs font-medium hover:bg-gray-700 transition-all duration-200 shadow flex items-center gap-1"
                  >
                    <X size={14} /> Close
                  </button>
                </div>
              </div>
            )}

            {/* Preview After Capture */}
            {capturedPhoto && !isCameraOpen && (
              <div className="w-full h-full animate-fade-in flex flex-col">
                <div className="flex-1 relative border border-gray-300 rounded-lg overflow-hidden">
                  <img 
                    src={capturedPhoto} 
                    alt="Captured" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex gap-3 mt-3 justify-center">
                  <button
                    onClick={uploadCaptured}
                    className="px-4 py-2 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all duration-200 flex items-center gap-1"
                  >
                    <CheckCircle size={14} /> Use This
                  </button>
                  <button
                    onClick={openCamera}
                    className="px-4 py-2 bg-gray-600 text-white rounded-full text-xs font-medium hover:bg-gray-700 transition-all duration-200 flex items-center gap-1"
                  >
                    <Camera size={14} /> Retake
                  </button>
                </div>
              </div>
            )}

            {/* Final Image Box */}
            {!isCameraOpen && !capturedPhoto && (
              <div className="relative w-full h-full border border-gray-300 rounded-lg overflow-hidden shadow transition-all duration-300 hover:shadow-md bg-white">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Uploaded Plant"
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center border border-dashed border-gray-300 rounded-lg">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3 transition-all duration-200">
                      <Camera className="text-gray-600" size={24} />
                    </div>
                    <p className="text-gray-700 font-medium text-sm">No plant image selected</p>
                    <p className="text-gray-500 text-xs mt-1">Upload or capture an image to begin</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upload & Camera Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openCamera}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-black text-white text-sm font-medium disabled:opacity-50 hover:bg-gray-800 transition-all duration-200 shadow"
            >
              <Camera size={16} /> Take Photo
            </button>

            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-black text-white text-sm font-medium cursor-pointer disabled:opacity-50 hover:bg-gray-800 transition-all duration-200 shadow">
              <Upload size={16} /> Upload
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={loading}
              />
            </label>
          </div>

          {/* Start Scan Button */}
          <button
            onClick={handleStartScan}
            disabled={loading || !selectedImage}
            className="w-full px-4 py-2.5 bg-black text-white rounded-full text-sm font-medium tracking-wide hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 shadow flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Info size={16} /> Start Diagnosis
              </>
            )}
          </button>
        </div>

        {/* Right Side - Diagnosis Results */}
        <div className="w-full lg:w-3/5 h-full">
          {/* Loading State */}
          {loading && (
            <div className="h-full text-center py-8 animate-fade-in bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative mb-4">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-black rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Your Plant</h3>
                <p className="text-gray-600 text-sm max-w-md">Examining plant image for signs of disease...</p>
                <div className="mt-4 w-full max-w-md bg-gray-200 rounded-full h-1.5">
                  <div className="bg-black h-1.5 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          )}

          {/* Plant Diagnosis Results */}
          {showDetails && !loading && parsedResponse && (
            <div className="h-full animate-fade-in bg-white rounded-lg shadow overflow-hidden border border-gray-200 flex flex-col">
              {/* Header with plant image and main diagnosis - Green Gradient */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/30 bg-white">
                    <img
                      src={selectedImage}
                      alt="Diagnosed Plant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-xl font-bold mb-1">Plant Diagnosis Complete</h1>
                    <p className="text-green-100 opacity-90 text-sm">Analysis based on your plant image</p>
                  </div>
                </div>
              </div>

              {/* Diagnosis Details */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {Object.entries(parsedResponse).map(([key, value], index) => (
                  <div 
                    key={key} 
                    className={`p-4 rounded-lg border-l-4 transition-all duration-500 transform ${
                      revealedSections.includes(index) 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    } ${
                      key.toLowerCase().includes('severity') || key.toLowerCase().includes('urgency') 
                        ? getSeverityLevel(value) === 'high' 
                          ? 'bg-red-50 border-red-500' 
                          : getSeverityLevel(value) === 'medium' 
                            ? 'bg-yellow-50 border-yellow-500' 
                            : 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-400'
                    } hover:shadow-sm transition-all duration-200`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        key.toLowerCase().includes('severity') || key.toLowerCase().includes('urgency') 
                          ? getSeverityLevel(value) === 'high' 
                            ? 'bg-red-100 text-red-600' 
                            : getSeverityLevel(value) === 'medium' 
                              ? 'bg-yellow-100 text-yellow-600' 
                              : 'bg-green-100 text-green-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {key.toLowerCase().includes('severity') || key.toLowerCase().includes('urgency') ? (
                          <AlertTriangle size={16} />
                        ) : (
                          <Info size={16} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800 mb-2 capitalize">{key}</h3>
                        
                        {key.toLowerCase().includes('severity') || key.toLowerCase().includes('urgency') ? (
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            getSeverityLevel(value) === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : getSeverityLevel(value) === 'medium' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {value}
                          </div>
                        ) : (
                          <div className="text-gray-700 text-sm whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                            {value.split('\n').map((line, lineIndex) => (
                              <p 
                                key={lineIndex} 
                                className={
                                  line.trim().startsWith('-') ? 'pl-3 mb-1 text-gray-700' : 
                                  line.trim() === '' ? 'mb-2' : 'mb-1 text-gray-800'
                                }
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Prompt */}
              {showSavePrompt && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 animate-fade-in">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        <Save size={16} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">Save to profile?</h3>
                        <p className="text-xs text-gray-600">Track plant health over time</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveDiagnosis}
                        className="px-3 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all duration-200 flex items-center gap-1"
                      >
                        <CheckCircle size={14} /> Save
                      </button>
                      <button
                        onClick={() => setShowSavePrompt(false)}
                        className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-full text-xs font-medium hover:bg-gray-400 transition-all duration-200"
                      >
                        No Thanks
                      </button>
                    </div>
                  </div>
                  
                  {/* Success Message */}
                  {saveSuccess && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2 animate-fade-in">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-green-700 font-medium text-xs">Diagnosis saved successfully!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* No Details Found */}
          {showDetails && !loading && response && (response.includes("no details found") || !parsedResponse) && (
            <div className="h-full text-center py-8 animate-fade-in bg-white rounded-lg shadow p-6 border border-gray-200 flex flex-col justify-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Disease Detected</h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-4">
                No specific diseases identified. Your plant might be healthy, or try a clearer image.
              </p>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImageFile(null);
                  setShowDetails(false);
                }}
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-200"
              >
                Try Another Image
              </button>
            </div>
          )}

          {/* Initial State - Before Scan */}
          {!showDetails && !loading && (
            <div className="h-full text-center py-8 animate-fade-in bg-white rounded-lg shadow p-6 border border-gray-200 flex flex-col justify-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-200">
                <Info className="text-gray-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Diagnose</h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-4">
                Upload or capture a clear image for AI-powered plant diagnosis.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3 bg-gray-50 rounded border border-gray-200 transition-all duration-200">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-200 flex items-center justify-center">
                    <Camera className="text-gray-600" size={16} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">Capture</p>
                </div>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 transition-all duration-200">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="text-gray-600" size={16} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">Upload</p>
                </div>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 transition-all duration-200">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-200 flex items-center justify-center">
                    <Info className="text-gray-600" size={16} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">Diagnose</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PlantDoctor;