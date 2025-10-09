from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from efficientnet_pytorch import EfficientNet
from torchvision import transforms
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Configuration
MODEL_PATH = 'plant_disease_model_38_classes.pth'
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                        std=[0.229, 0.224, 0.225])
])

# Create model architecture
def create_model(num_classes=38):
    model = EfficientNet.from_name('efficientnet-b0')
    in_features = model._fc.in_features
    model._fc = nn.Linear(in_features, num_classes)
    return model

# Load the trained model
def load_model(model_path):
    try:
        model = create_model(num_classes=len(CLASS_NAMES))
        
        if torch.cuda.is_available():
            checkpoint = torch.load(model_path)
        else:
            checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
        
        if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)
        
        model.to(device)
        model.eval()
        print("✅ Model loaded successfully!")
        return model
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

# Initialize model
model = load_model(MODEL_PATH)

def predict_image(image):
    """Predict plant disease from image"""
    try:
        # Preprocess image
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Predict
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        confidence_score = confidence.item()
        predicted_class = CLASS_NAMES[predicted.item()]
        
        # Get disease info
        disease_info = get_disease_info(predicted_class)
        
        return {
            'success': True,
            'diagnosis': predicted_class,
            'confidence': round(confidence_score * 100, 2),
            'is_healthy': 'healthy' in predicted_class.lower(),
            'disease_info': disease_info
        }
    
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def get_disease_info(disease_name):
    """Get detailed information about specific plant diseases"""
    disease_db = {
        'Apple___Apple_scab': {
            'name': 'Apple Scab',
            'severity': 'High',
            'cause': 'Fungal disease caused by Venturia inaequalis',
            'symptoms': ['Dark, scaly lesions on leaves and fruits', 'Yellowing leaves', 'Premature leaf drop'],
            'treatment': ['Apply fungicides like sulfur or copper-based sprays', 'Remove and destroy infected leaves', 'Practice good sanitation'],
            'urgency': 'High - Can significantly reduce yield'
        },
        'Apple___Black_rot': {
            'name': 'Apple Black Rot',
            'severity': 'Moderate',
            'cause': 'Fungal disease caused by Botryosphaeria obtusa',
            'symptoms': ['Brown spots on leaves', 'Fruit rot with concentric rings', 'Cankers on branches'],
            'treatment': ['Prune infected branches', 'Apply fungicides', 'Remove mummified fruits'],
            'urgency': 'Moderate - Can spread to fruits'
        },
        'Tomato___Early_blight': {
            'name': 'Tomato Early Blight',
            'severity': 'Moderate',
            'cause': 'Fungal disease caused by Alternaria solani',
            'symptoms': ['Concentric rings on leaves', 'Yellowing lower leaves', 'Dark lesions on stems'],
            'treatment': ['Apply copper-based fungicides', 'Remove infected leaves', 'Improve air circulation'],
            'urgency': 'Moderate - Can defoliate plants'
        },
        'Tomato___Late_blight': {
            'name': 'Tomato Late Blight',
            'severity': 'High',
            'cause': 'Fungal disease caused by Phytophthora infestans',
            'symptoms': ['Water-soaked lesions on leaves', 'White mold growth', 'Rapid plant collapse'],
            'treatment': ['Apply fungicides immediately', 'Destroy infected plants', 'Avoid overhead watering'],
            'urgency': 'High - Can destroy entire crop quickly'
        },
        'Tomato___healthy': {
            'name': 'Healthy Tomato',
            'severity': 'None',
            'cause': 'No disease detected',
            'symptoms': ['Normal green foliage', 'Healthy growth', 'No visible lesions'],
            'treatment': ['Continue current care practices', 'Monitor regularly', 'Maintain proper watering'],
            'urgency': 'None - Plant is healthy'
        },
        'Apple___healthy': {
            'name': 'Healthy Apple',
            'severity': 'None',
            'cause': 'No disease detected',
            'symptoms': ['Vibrant green leaves', 'Strong growth', 'No spots or discoloration'],
            'treatment': ['Maintain current care routine', 'Regular monitoring', 'Proper fertilization'],
            'urgency': 'None - Plant is healthy'
        }
    }
    
    # Return specific disease info or generic info
    if disease_name in disease_db:
        return disease_db[disease_name]
    else:
        # Generic response for other diseases
        is_healthy = 'healthy' in disease_name.lower()
        if is_healthy:
            return {
                'name': 'Healthy Plant',
                'severity': 'None',
                'cause': 'No disease detected',
                'symptoms': ['Normal appearance', 'Healthy growth pattern'],
                'treatment': ['Continue current care practices'],
                'urgency': 'None - Plant is healthy'
            }
        else:
            return {
                'name': disease_name.replace('___', ' ').replace('_', ' '),
                'severity': 'Moderate',
                'cause': 'Plant disease detected - consult expert for specific identification',
                'symptoms': ['Abnormal leaf patterns', 'Discoloration', 'Possible growth issues'],
                'treatment': ['Isolate affected plant', 'Consult agricultural expert', 'Consider general fungicide'],
                'urgency': 'Moderate - Professional consultation recommended'
            }

@app.route('/diagnose', methods=['POST'])
def diagnose():
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image uploaded'})
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'})
        
        # Read and process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Make prediction
        result = predict_image(image)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'device': str(device),
        'num_classes': len(CLASS_NAMES)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)