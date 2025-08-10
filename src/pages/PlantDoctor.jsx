import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload } from "lucide-react";
import Title from "../compononts/Title";

const PlantDoctor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

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
    const imageData = canvas.toDataURL('image/png');
    setCapturedPhoto(imageData);
    stopCamera();
  };

  const uploadCaptured = () => {
    setSelectedImage(capturedPhoto);
    setCapturedPhoto(null);
    setShowDetails(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowDetails(false);
    }
  };

  const handleStartScan = () => {
    if (!selectedImage) {
      alert("Please upload an image before starting the scan.");
      return;
    }
    setShowDetails(true);
  };

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
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm"
            >
              <Camera size={16} /> Take picture of Plant
            </button>

            <label className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm cursor-pointer">
              <Upload size={16} /> Upload photo from device
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Plant Info (After Scan) */}
          {showDetails && (
            <div className="text-base space-y-6">
              <h1 className="text-5xl font-light tracking-wide">Monstera Adansonii</h1>

              <div className="space-y-2">
                <div>
                  <p className="text-black font-semibold">Name:</p>
                  <p className="text-gray-900">Monstera Adansonii</p>
                </div>

                <div>
                  <p className="text-black font-semibold">Identified Disease:</p>
                  <p className="text-gray-900">Leaf Yellowing or Chlorosis</p>
                </div>

                <div>
                  <p className="text-black font-semibold">Severity:</p>
                  <p className="text-yellow-700">Moderate</p>
                </div>

                <div>
                  <p className="text-black font-semibold">Cause:</p>
                  <ul className="list-disc list-inside text-gray-900 space-y-1">
                    <li className="pl-[8px]">Chlorosis is often caused by nutrient deficiencies, primarily nitrogen, iron, or magnesium.</li>
                    <li className="pl-[8px]">It can also occur due to overwatering, poor drainage, or pests like spider mites.</li>
                    <li className="pl-[8px]">Excessive direct sunlight or improper care can worsen the condition.</li>
                  </ul>
                </div>

                <div>
                  <p className="text-black font-semibold">Symptoms:</p>
                  <ul className="list-disc list-inside text-gray-900 space-y-1">
                    <li className="pl-[8px]">Yellowing leaves, especially between the veins</li>
                    <li className="pl-[8px]">Weak and stunted growth</li>
                    <li className="pl-[8px]">Leaves losing their vibrant green color</li>
                  </ul>
                </div>

                <div>
                  <p className="text-back font-semibold">Treatments:</p>
                  <ol className="list-decimal list-inside text-gray-900 space-y-1">
                    <li className="pl-[8px]">Watering: Allow soil to dry slightly between waterings; ensure proper drainage.</li>
                    <li className="pl-[8px]">Fertilizer: Use balanced fertilizer (e.g., 20-20-20) and iron supplements if needed.</li>
                    <li className="pl-[8px]">Pruning: Remove yellow or damaged leaves.</li>
                    <li className="pl-[8px]">Light: Place in bright, indirect sunlight.</li>
                    <li className="pl-[8px]">Pests: Use neem oil if pests like spider mites are present.</li>
                  </ol>
                </div>

                <div>
                  <p className="text-black font-semibold">Urgency:</p>
                  <p className="text-red-600">Moderate. Treat promptly to prevent worsening.</p>
                </div>
              </div>
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
                  className="w-full h-auto object-contain "
                />
              )}
            </div>
          )}

          {/* Start Scan Button */}
          <button
            onClick={handleStartScan}
            className="px-6 py-2 bg-black text-white rounded-full text-sm tracking-wide hover:bg-black/80 transition"
          >
            Start Scan
          </button>
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PlantDoctor;