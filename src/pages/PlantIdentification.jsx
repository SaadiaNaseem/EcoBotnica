import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload } from 'lucide-react';
import Title from '../compononts/Title';

const PlantIdentification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null); // <-- new state
  const [showDetails, setShowDetails] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [finalDialogMessage, setFinalDialogMessage] = useState('');
  const [showFinalDialog, setShowFinalDialog] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Camera Functions
  const openCamera = async () => {
    setIsCameraOpen(true);
    setCapturedPhoto(null);
    setShowDetails(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      alert('Unable to access camera.');
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
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowDetails(false);
    }
  };

  // 🔹 Function to send image to backend API
  const fetchPlantInfo = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict-plant/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setPlantInfo(data);  // save backend response
    } catch (error) {
      console.error(error);
      alert("Error detecting plant. Please try again.");
    }
  };

  const handleStartScan = () => {
    if (!selectedImage) {
      alert('Please upload an image before starting the scan.');
      return;
    }

    // If selectedImage is file path → convert into File for upload
    fetch(selectedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "plant.png", { type: "image/png" });
        fetchPlantInfo(file);
        setShowDetails(true);
      });
  };

  // Disease Detection Flow
  const handleDetectionClick = () => {
    setShowSaveDialog(true);
  };

  const handleDialogChoice = (choice) => {
    setShowSaveDialog(false);

    if (choice === 'yes') {
      const isLoggedIn = !!localStorage.getItem('token');
      if (isLoggedIn) {
        // simulate sending to backend
        setFinalDialogMessage('Data saved in dashboard.');
      } else {
        setFinalDialogMessage('Please login first.');
      }
      setShowFinalDialog(true);
    } else {
      navigate('/plantDoctor');
    }
  };

  const handleFinalDialogOK = () => {
    setShowFinalDialog(false);
    if (finalDialogMessage === 'Data saved in dashboard.') {
      navigate('/plantDoctor');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="py-12">
      {/* Title */}
      <div className="text-2xl mb-4">
        <Title text1="PLANT" text2="IDENTIFICATION" />
      </div>

      <div className="flex flex-col lg:flex-row justify-center lg:items-start items-center gap-12 px-8 bg-white text-black">
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

          {/* Plant Info */}
          {showDetails && plantInfo && (
            <div className="text-base space-y-6">
              <h1 className="text-4xl font-light tracking-wide">{plantInfo.plant_name}</h1>
              <div className="space-y-2">
                <p><strong>Name:</strong> {plantInfo.plant_name}</p>
                <p><strong>Confidence:</strong> {(plantInfo.confidence * 100).toFixed(2)}%</p>
              </div>

              <button
                onClick={handleDetectionClick}
                className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm tracking-wide"
              >
                DISEASE DETECTION AND TREATMENT
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Camera/Image Preview */}
        <div className="flex flex-col items-center gap-4 justify-start">
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

          {capturedPhoto && (
            <>
              <div className="w-[320px] h-auto border-4 border-black/80 rounded-md overflow-hidden">
                <img src={capturedPhoto} alt="Captured" className="w-full h-auto object-contain" />
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

          {!isCameraOpen && !capturedPhoto && (
            <div className="relative w-[320px] max-h-[480px] border-4 border-black/80 rounded-md overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt="Uploaded Plant" className="w-full h-auto object-contain" />
              ) : (
                <img src="/bird-of-paradise.jpg" alt="Bird of Paradise" className="w-full h-auto object-contain" />
              )}
            </div>
          )}

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

      {/* Save Confirmation Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md text-center space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Do you want to save this info in your profile?
            </h2>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleDialogChoice('yes')}
                className="px-6 py-2 bg-black text-white rounded-[20px]"
              >
                Yes
              </button>
              <button
                onClick={() => handleDialogChoice('no')}
                className="px-6 py-2 bg-black text-white rounded-[20px]"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Dialog */}
      {showFinalDialog && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md text-center space-y-4">
            <h2 className="text-lg text-gray-800">{finalDialogMessage}</h2>
            <button
              onClick={handleFinalDialogOK}
              className="px-6 py-2 bg-black text-white rounded-[20px]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantIdentification;
