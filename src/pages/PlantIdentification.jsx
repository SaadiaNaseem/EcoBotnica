import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Scan, Leaf, Sparkles, Download, Share2, Bookmark, Clock, Zap, Flower, ThermometerSun, Droplets, Sprout } from 'lucide-react';
import { usePlantIdentification } from '../context/plantIdentification';
import Title from '../compononts/Title';

const PlantIdentification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [finalDialogMessage, setFinalDialogMessage] = useState('');
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const { classifyImage, classificationResult, loading, error, clearResults } = usePlantIdentification();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Format AI response with proper styling
  const formatAIResponse = (text) => {
    if (!text) return null;

    // Split by sections and create styled components
    const sections = text.split('**').filter(section => section.trim());
    
    return sections.map((section, index) => {
      if (section.includes(':')) {
        const [title, ...contentParts] = section.split(':');
        const content = contentParts.join(':').trim();
        
        // Special styling for different sections
        if (title.trim().includes('🌿 PLANT IDENTIFICATION')) {
          return (
            <div key={index} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Plant Identification</h3>
              </div>
              <div className="bg-white rounded-xl p-4 border border-green-200">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </div>
            </div>
          );
        }
        
        if (title.trim().includes('📊 BASIC CHARACTERISTICS')) {
          return (
            <div key={index} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Flower className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Basic Characteristics</h3>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </div>
            </div>
          );
        }
        
        if (title.trim().includes('🌍 GROWING CONDITIONS')) {
          return (
            <div key={index} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <ThermometerSun className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-800">Growing Conditions</h3>
              </div>
              <div className="bg-white rounded-xl p-4 border border-amber-200">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </div>
            </div>
          );
        }
        
        if (title.trim().includes('💧 CARE & MAINTENANCE')) {
          return (
            <div key={index} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-cyan-800">Care & Maintenance</h3>
              </div>
              <div className="bg-white rounded-xl p-4 border border-cyan-200">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </div>
            </div>
          );
        }
        
        if (title.trim().includes('⚠️ TOXICITY ASSESSMENT')) {
          return (
            <div key={index} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Sprout className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-800">Toxicity Assessment</h3>
              </div>
              <div className="bg-white rounded-xl p-4 border border-red-200">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </div>
            </div>
          );
        }

        // Default section styling
        return (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">{title.trim()}</h4>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-3">
              {content}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  // Camera Functions
  const openCamera = async () => {
    setIsCameraOpen(true);
    setCapturedPhoto(null);
    setShowDetails(false);
    clearResults();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      alert('Unable to access camera. Please check permissions.');
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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');
    setCapturedPhoto(imageDataUrl);
    stopCamera();
  };

  const uploadCaptured = () => {
    setSelectedImage(capturedPhoto);
    setCapturedPhoto(null);
    setShowDetails(false);
    clearResults();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowDetails(false);
      clearResults();
    }
  };

  // Convert data URL to File object for API
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Real scan process
  const handleStartScan = async () => {
    if (!selectedImage) {
      alert('Please upload or capture an image first.');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setShowDetails(false);
    clearResults();

    try {
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      let imageFile;
      if (selectedImage.startsWith('data:image')) {
        imageFile = dataURLtoFile(selectedImage, 'plant-photo.jpg');
      } else {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        imageFile = new File([blob], 'plant-photo.jpg', { type: blob.type });
      }

      const result = await classifyImage(imageFile);
      
      clearInterval(progressInterval);
      setScanProgress(100);

      if (result.success) {
        const formattedResult = {
          plant_name: result.modelUsed === 'plant' ? 'Identified Plant' : 'Identified Flower',
          scientific_name: "AI Analysis Complete",
          family: result.modelUsed === 'plant' ? 'Plant Species' : 'Flower Family',
          confidence: result.confidence / 100,
          description: result.message,
          care_tips: [
            "Based on comprehensive AI analysis",
            "Follow the detailed care instructions above",
            "Monitor plant health regularly"
          ],
          fun_fact: `This identification was powered by our ${result.modelUsed} model and enhanced with AI analysis!`,
          modelUsed: result.modelUsed,
          detailedReport: result.detailedReport
        };
        
        setPlantInfo(formattedResult);
        setShowDetails(true);
        
        setTimeout(() => {
          const resultsElement = document.getElementById('plant-results');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      } else {
        alert(`Identification failed: ${result.message}`);
      }

    } catch (err) {
      console.error('Scan error:', err);
      alert('Identification failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Update useEffect to handle context loading state
  useEffect(() => {
    if (loading) {
      setIsScanning(true);
    } else {
      setIsScanning(false);
    }
  }, [loading]);

  // Handle context results when they change
  useEffect(() => {
    if (classificationResult && classificationResult.success) {
      const formattedResult = {
        plant_name: classificationResult.modelUsed === 'plant' ? 'Identified Plant' : 'Identified Flower',
        scientific_name: "AI Analysis Complete",
        family: classificationResult.modelUsed === 'plant' ? 'Plant Species' : 'Flower Family',
        confidence: classificationResult.confidence / 100,
        description: classificationResult.message,
        care_tips: [
          "Based on comprehensive AI analysis",
          "Follow the detailed care instructions above",
          "Monitor plant health regularly"
        ],
        fun_fact: `This identification was powered by our ${classificationResult.modelUsed} model and enhanced with AI analysis!`,
        modelUsed: classificationResult.modelUsed,
        detailedReport: classificationResult.detailedReport
      };
      
      setPlantInfo(formattedResult);
      setShowDetails(true);
      setScanProgress(100);
    }
  }, [classificationResult]);

  // Disease Detection Flow
  const handleDetectionClick = () => {
    setShowSaveDialog(true);
  };

  const handleDialogChoice = (choice) => {
    setShowSaveDialog(false);
    if (choice === 'yes') {
      const isLoggedIn = !!localStorage.getItem('token');
      setFinalDialogMessage(isLoggedIn ? 'Plant data saved to your dashboard!' : 'Please login to save plant data.');
      setShowFinalDialog(true);
    } else {
      navigate('/plantDoctor');
    }
  };

  const handleFinalDialogOK = () => {
    setShowFinalDialog(false);
    if (finalDialogMessage.includes('saved')) {
      navigate('/plantDoctor');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <Title text1="PLANT" text2="IDENTIFICATION" />
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Identify any plant instantly using AI technology. Simply upload a photo or use your camera to discover plant species, care tips, and more.
        </p>
        
        {/* API Status Indicator */}
        {error && (
          <div className="mt-4 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 font-medium">Identification Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {classificationResult && !error && (
          <div className="mt-4 max-w-2xl mx-auto">
            <div className={`${
              classificationResult.modelUsed === 'plant' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-pink-50 border-pink-200'
            } border rounded-xl p-4 animate-pulse`}>
              <p className={`${
                classificationResult.modelUsed === 'plant' ? 'text-green-700' : 'text-pink-700'
              } font-medium flex items-center justify-center gap-2`}>
                {classificationResult.modelUsed === 'plant' ? '🌿 Plant' : '🌸 Flower'} Identified!
              </p>
              <p className={`${
                classificationResult.modelUsed === 'plant' ? 'text-green-600' : 'text-pink-600'
              } text-sm`}>
                Confidence: {classificationResult.confidence}% • Model: {classificationResult.modelUsed}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Panel - Controls & Info */}
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Scan className="w-5 h-5 text-green-600" />
                Upload Plant Image
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={openCamera}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-green-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Camera className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Take Photo</p>
                    <p className="text-sm text-gray-500">Use camera</p>
                  </div>
                </button>

                <label className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group cursor-pointer">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Upload Image</p>
                    <p className="text-sm text-gray-500">From device</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Tips for Best Results:
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Take clear, well-lit photos of leaves and flowers</li>
                  <li>• Include multiple angles if possible</li>
                  <li>• Avoid blurry or dark images</li>
                  <li>• Focus on distinctive features</li>
                </ul>
              </div>
            </div>

            {/* Plant Information */}
            {showDetails && plantInfo && (
              <div id="plant-results" className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{plantInfo.plant_name}</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {plantInfo.confidence * 100}% Match
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Scientific Name</p>
                      <p className="font-medium text-gray-800">{plantInfo.scientific_name}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium text-gray-800 capitalize">{plantInfo.modelUsed}</p>
                    </div>
                  </div>

                  {/* Detailed AI Analysis */}
                  <div className="space-y-6">
                    {formatAIResponse(plantInfo.detailedReport || plantInfo.description)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Key Insights
                    </h4>
                    <div className="space-y-2">
                      {plantInfo.care_tips.map((tip, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-600 text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-1 flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      Technology Used
                    </h4>
                    <p className="text-green-700 text-sm">{plantInfo.fun_fact}</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleDetectionClick}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Scan className="w-4 h-4" />
                      Disease Detection
                    </button>
                    <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Camera & Preview */}
          <div className="space-y-6">
            {/* Camera/Preview Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Plant Preview</h3>
              
              {isCameraOpen && !capturedPhoto && (
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Capture Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {capturedPhoto && (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border-4 border-green-200">
                    <img src={capturedPhoto} alt="Captured" className="w-full h-96 object-cover" />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={uploadCaptured}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Use This Photo
                    </button>
                    <button
                      onClick={openCamera}
                      className="border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              )}

              {!isCameraOpen && !capturedPhoto && (
                <div className="text-center space-y-6">
                  <div className="relative rounded-xl overflow-hidden border-4 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 h-96 flex items-center justify-center">
                    {selectedImage ? (
                      <img 
                        src={selectedImage} 
                        alt="Uploaded Plant" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Leaf className="w-16 h-16 mx-auto mb-4 text-green-300" />
                        <p className="text-lg font-medium">No plant image selected</p>
                        <p className="text-sm">Upload or capture a photo to begin identification</p>
                      </div>
                    )}
                  </div>

                  {/* Scanning Animation */}
                  {isScanning && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        <span className="text-gray-700 font-medium">
                          {loading ? 'Analyzing with AI...' : 'Processing image...'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {scanProgress < 50 && 'Identifying plant/flower...'}
                        {scanProgress >= 50 && scanProgress < 90 && 'Getting detailed analysis...'}
                        {scanProgress >= 90 && 'Finalizing report...'}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleStartScan}
                    disabled={!selectedImage || isScanning}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-105"
                  >
                    <Scan className="w-5 h-5" />
                    {isScanning ? 'Scanning...' : 'Start Plant Identification'}
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-50 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">Smart Analysis</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-50 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Auto-Detect</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-50 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600">AI Reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Dialogs */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-96 max-w-[90%] text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Save to Your Plant Collection?
            </h2>
            <p className="text-gray-600">
              Save this plant's information to your personal dashboard for future reference.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleDialogChoice('yes')}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                Yes, Save It
              </button>
              <button
                onClick={() => handleDialogChoice('no')}
                className="flex-1 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinalDialog && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-96 max-w-[90%] text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              {finalDialogMessage.includes('saved') ? (
                <Sparkles className="w-8 h-8 text-green-600" />
              ) : (
                <Leaf className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {finalDialogMessage.includes('saved') ? 'Success!' : 'Action Required'}
            </h2>
            <p className="text-gray-600">{finalDialogMessage}</p>
            <button
              onClick={handleFinalDialogOK}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantIdentification;