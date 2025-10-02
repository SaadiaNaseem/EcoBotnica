import React, { useRef, useState, useEffect, useContext } from 'react';
import { Camera, Upload } from "lucide-react";
import Title from "../compononts/Title";
import { Disease } from '../context/disease';
const PlantDoctor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const { diagnoseDisease, response, loading } = useContext(Disease);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera
  const openCamera = async () => {
    setIsCameraOpen(true);
    setCapturedPhoto(null);
    setShowDetails(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      alert("Camera access failed.");
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
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const imageData = canvas.toDataURL('image/png');
      setCapturedPhoto(imageData);
      // Create file from blob for API
      const file = new File([blob], "captured-plant.png", { type: "image/png" });
      setImageFile(file);
    });
    stopCamera();
  };

  const uploadCaptured = () => {
    setSelectedImage(capturedPhoto);
    setShowDetails(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setShowDetails(false);
    }
  };

  const handleStartScan = async () => {
    if (!selectedImage || !imageFile) {
      alert("Please upload an image before starting the scan.");
      return;
    }

    try {
      await diagnoseDisease(imageFile);
      setShowDetails(true);
    } catch (error) {
      console.error("Error scanning plant:", error);
      alert("Failed to scan plant. Please try again.");
    }
  };

  // Function to parse the AI response and format it properly
  // const parseAIResponse = (responseText) => {
  //   if (!responseText) return null;
    
  //   // Split by bullet points and format
  //   const sections = responseText.split('• **').filter(section => section.trim());
  //   const result = {};
    
  //   sections.forEach(section => {
  //     const [title, ...contentParts] = section.split('**:');
  //     if (title && contentParts.length > 0) {
  //       const content = contentParts.join('**:').trim();
  //       result[title.trim()] = content;
  //     }
  //   });
    
  //   return result;
  // };


const parseAIResponse = (responseText) => {
  if (!responseText) return null;

  // Split by sections based on the bullet points with `• **`
  const sections = responseText.split('• **').filter(section => section.trim());
  const result = {};

  sections.forEach(section => {
    const [title, ...contentParts] = section.split('**:');
    if (title && contentParts.length > 0) {
      const content = contentParts.join('**:').trim();
      result[title.trim()] = content;
    }
  });

  return result;
};


  const parsedResponse = parseAIResponse(response);

  return (
    <div className='py-12'>
      {/* Title */}
      <div className="text-2xl mb-4">
        <Title text1={"DISEASE"} text2={"DEDUCTION"} />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 px-8 bg-white text-black">
        {/* Left Side */}
        <div className="max-w-xl w-full space-y-6">
          {/* Upload & Camera Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={openCamera}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm disabled:opacity-50"
            >
              <Camera size={16} /> Take picture of Plant
            </button>

            <label className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm cursor-pointer disabled:opacity-50">
              <Upload size={16} /> Upload photo from device
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={loading}
              />
            </label>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing plant image...</p>
            </div>
          )}

          {/* Plant Info (After Scan) */}
          {/* {showDetails && !loading && parsedResponse && (
            <div className="text-base space-y-6">
              <h1 className="text-5xl font-light tracking-wide">Plant Diagnosis</h1>

              <div className="space-y-4">
                {Object.entries(parsedResponse).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-black font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                    {key.toLowerCase().includes('severity') || key.toLowerCase().includes('urgency') ? (
                      <p className={
                        value.toLowerCase().includes('severe') || value.toLowerCase().includes('high') 
                          ? "text-red-600" 
                          : value.toLowerCase().includes('moderate') 
                            ? "text-yellow-600" 
                            : "text-green-600"
                      }>
                        {value}
                      </p>
                    ) : (
                      <div className="text-gray-900 whitespace-pre-wrap">
                        {value.split('\n').map((line, index) => (
                          <p key={index} className={line.trim().startsWith('-') ? 'pl-4' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )} */}


{showDetails && !loading && parsedResponse && (
  <div className="text-base space-y-6">
    <h1 className="text-5xl font-light tracking-wide">Plant Diagnosis</h1>

    <div className="space-y-4">
      {Object.entries(parsedResponse).map(([key, value]) => (
        <div key={key}>
          <p className="text-black font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>

          {/* Apply custom styling based on the content */}
          {key.toLowerCase().includes('severity') || key.toLowerCase().includes('urgency') ? (
            <p
              className={
                value.toLowerCase().includes('severe') || value.toLowerCase().includes('high')
                  ? "text-red-600"
                  : value.toLowerCase().includes('moderate')
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {value}
            </p>
          ) : (
            <div className="text-gray-900 whitespace-pre-wrap">
              {value.split('\n').map((line, index) => (
                <p key={index} className={line.trim().startsWith('-') ? 'pl-4' : ''}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}




          {/* Error or No Details Found */}
          {showDetails && !loading && response && response.includes("no details found") && (
            <div className="text-center py-8 text-red-600">
              <p className="text-lg">No disease details found for this plant image.</p>
              <p className="text-sm text-gray-600 mt-2">Please try with a clearer image or different plant.</p>
            </div>
          )}
        </div>

        {/* Right Side - Image / Camera */}
        <div className="flex flex-col items-center gap-4 justify-start">
          {/* Live Camera View */}
          {isCameraOpen && !capturedPhoto && (
            <div className="relative w-[320px] h-[360px] border-4 border-black/80 rounded-md overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <button
                onClick={capturePhoto}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm"
              >
                Capture
              </button>
            </div>
          )}

          {/* Preview After Capture */}
          {capturedPhoto && (
            <>
              <div className="w-[320px] h-auto border-4 border-black/80 rounded-md overflow-hidden">
                <img src={capturedPhoto} alt="Captured" className="w-[320px] h-auto object-contain object-top" />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={uploadCaptured}
                  className="px-6 py-2 bg-green-700 text-white rounded-full text-sm"
                >
                  Upload
                </button>
                <button
                  onClick={openCamera}
                  className="px-6 py-2 bg-red-600 text-white rounded-full text-sm"
                >
                  Retake
                </button>
              </div>
            </>
          )}

          {/* Final Image Box */}
          {!isCameraOpen && !capturedPhoto && (
            <div className="relative w-[320px] max-h-[380px] border-4 border-black/80 rounded-md overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded Plant"
                  className="w-full h-auto object-contain object-top"
                />
              ) : (
                <img
                  src="/bird-of-paradise.jpg"
                  alt="Bird of Paradise"
                  className="w-full h-auto object-contain"
                />
              )}
            </div>
          )}

          {/* Start Scan Button */}
          <button
            onClick={handleStartScan}
            disabled={loading || !selectedImage}
            className="px-6 py-2 bg-black text-white rounded-full text-sm tracking-wide hover:bg-black/80 transition disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Start Scan"}
          </button>
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PlantDoctor;