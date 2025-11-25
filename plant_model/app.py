# app.py - PLANT IDENTIFICATION API 🌿 (FIXED VERSION)
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import torch.nn as nn
from torchvision import transforms, models
import json
import os
import traceback

# ----------------------------
# App & CORS
# ----------------------------
app = FastAPI(
    title="Plant Identification API",
    description="Identify plant species from images",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Device config
# ----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️ Using device: {device}")

# ============================================================================
# PLANT CLASSES (Will be loaded from checkpoint)
# ============================================================================
PLANT_CLASS_NAMES = None

# ============================================================================
# MODEL CONFIGURATION
# ============================================================================
PLANT_MODEL_PATH = "plant_classifier_SAFE.pth"

# Plant transform (same as your working local test)
plant_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def create_plant_model(num_classes=30):
    """Create the plant model architecture"""
    try:
        print("🏗️ Creating plant model architecture...")
        model = models.resnet50(pretrained=False)
        num_ftrs = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(num_ftrs, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )
        print("✅ Plant model architecture created successfully!")
        return model
    except Exception as e:
        print(f"❌ Error creating plant model: {e}")
        return None

def load_plant_model():
    """Load plant model with correct checkpoint structure"""
    try:
        global PLANT_CLASS_NAMES
        
        print(f"🪴 Loading plant model from: {PLANT_MODEL_PATH}")
        
        # Check if file exists
        if not os.path.exists(PLANT_MODEL_PATH):
            print(f"❌ Plant model file not found: {PLANT_MODEL_PATH}")
            return None
        
        print("✅ Plant model file exists")
        
        # Check file size
        file_size = os.path.getsize(PLANT_MODEL_PATH)
        print(f"📁 Model file size: {file_size} bytes")
        
        if file_size == 0:
            print("❌ Plant model file is empty!")
            return None
        
        # Load checkpoint safely
        print("📦 Loading plant model checkpoint...")
        checkpoint = torch.load(PLANT_MODEL_PATH, map_location=device, weights_only=False)
        
        print(f"🔑 Checkpoint type: {type(checkpoint)}")
        
        # Debug checkpoint structure
        if isinstance(checkpoint, dict):
            print(f"🔑 Checkpoint keys: {list(checkpoint.keys())}")
        
        # Extract class names from checkpoint
        if 'class_names' in checkpoint:
            PLANT_CLASS_NAMES = checkpoint['class_names']
            print(f"🌿 Loaded {len(PLANT_CLASS_NAMES)} plant classes from checkpoint")
        else:
            # Fallback to hardcoded classes
            PLANT_CLASS_NAMES = [
                'aloevera', 'banana', 'bilimbi', 'cantaloupe', 'cassava', 'coconut', 
                'corn', 'cucumber', 'curcuma', 'eggplant', 'galangal', 'ginger', 
                'guava', 'kale', 'longbeans', 'mango', 'melon', 'orange', 'paddy', 
                'papaya', 'peper chili', 'pineapple', 'pomelo', 'shallot', 'soybeans', 
                'spinach', 'sweet potatoes', 'tobacco', 'waterapple', 'watermelon'
            ]
            print(f"⚠️ Using fallback classes: {len(PLANT_CLASS_NAMES)} plant classes")
        
        # Create model with correct number of classes
        num_classes = len(PLANT_CLASS_NAMES)
        print(f"🎯 Creating model with {num_classes} classes")
        
        model = create_plant_model(num_classes=num_classes)
        if model is None:
            return None
        
        # Load state dict - USE THE CORRECT KEY
        print("🔄 Loading state dict...")
        if 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
            print("✅ Loaded from 'model_state_dict'")
        elif 'state_dict' in checkpoint:
            model.load_state_dict(checkpoint['state_dict'])
            print("✅ Loaded from 'state_dict'")
        else:
            print("❌ No valid state dict found in checkpoint!")
            print(f"🔍 Available keys: {list(checkpoint.keys())}")
            return None
        
        model.to(device)
        model.eval()
        print("✅ Plant model loaded successfully!")
        return model
        
    except Exception as e:
        print(f"❌ Error loading plant model: {e}")
        print(f"🔍 Full traceback:\n{traceback.format_exc()}")
        return None

# Load the model at startup
plant_model = load_plant_model()

# ============================================================================
# PREDICTION FUNCTION
# ============================================================================
def predict_plant_species(image):
    """Predict plant species from image"""
    try:
        if plant_model is None:
            return {
                'success': False, 
                'error': 'Plant model not loaded. Please check server logs.'
            }
        
        if PLANT_CLASS_NAMES is None:
            return {
                'success': False,
                'error': 'Plant classes not loaded.'
            }
        
        # Transform and predict
        image_tensor = plant_transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            outputs = plant_model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        confidence_score = confidence.item()
        predicted_class = PLANT_CLASS_NAMES[predicted.item()]
        
        # Get top 3 predictions
        top3_probs, top3_indices = torch.topk(probabilities, 3)
        top3_predictions = [
            {
                'class': PLANT_CLASS_NAMES[idx.item()],
                'confidence': round(prob.item() * 100, 2)
            }
            for idx, prob in zip(top3_indices[0], top3_probs[0])
        ]
        
        return {
            'success': True,
            'plant_type': predicted_class,
            'confidence': round(confidence_score * 100, 2),
            'top_predictions': top3_predictions,
            'total_classes': len(PLANT_CLASS_NAMES)
        }
        
    except Exception as e:
        return {
            'success': False, 
            'error': str(e)
        }

# ============================================================================
# API ENDPOINTS
# ============================================================================
@app.post("/identify-plant")
async def identify_plant(file: UploadFile = File(...)):
    """Identify plant species from image"""
    try:
        # Read and convert image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Predict
        result = predict_plant_species(image)
        return result
        
    except Exception as e:
        return {
            "success": False, 
            "error": f"Image processing error: {str(e)}"
        }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy" if plant_model is not None else "error",
        "model_loaded": plant_model is not None,
        "device": str(device),
        "plant_classes": len(PLANT_CLASS_NAMES) if PLANT_CLASS_NAMES else 0,
        "model_name": "Plant Species Identification",
        "version": "1.0.0"
    }

@app.get("/debug")
async def debug():
    """Debug endpoint for model information"""
    return {
        "plant_model_loaded": plant_model is not None,
        "plant_model_path": PLANT_MODEL_PATH,
        "plant_model_file_exists": os.path.exists(PLANT_MODEL_PATH),
        "plant_file_size": os.path.getsize(PLANT_MODEL_PATH) if os.path.exists(PLANT_MODEL_PATH) else 0,
        "plant_classes_count": len(PLANT_CLASS_NAMES) if PLANT_CLASS_NAMES else 0,
        "plant_classes_loaded": PLANT_CLASS_NAMES is not None,
        "device": str(device),
        "torch_version": torch.__version__
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🌿 Plant Identification API",
        "description": "Identify plant species from images",
        "endpoints": {
            "identify_plant": "POST /identify-plant",
            "health_check": "GET /health",
            "debug_info": "GET /debug"
        },
        "plant_classes_count": len(PLANT_CLASS_NAMES) if PLANT_CLASS_NAMES else 0,
        "model_loaded": plant_model is not None
    }

# ============================================================================
# STARTUP MESSAGE
# ============================================================================
print("\n" + "="*50)
print("🚀 Plant Identification API Started Successfully!")
print(f"🌿 Plant Classes: {len(PLANT_CLASS_NAMES) if PLANT_CLASS_NAMES else 'NOT LOADED'}")
print(f"🖥️ Device: {device}")
print(f"📦 Model Loaded: {'✅' if plant_model else '❌'}")
print("📡 API Ready! Visit /docs for interactive documentation")
print("="*50)