from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import transforms
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ---------------- LOAD MODELS ----------------
def load_model(path):
    model = torch.load(path, map_location=device)
    model.eval()
    return model

disease_model = load_model("ML/plant_disease_model_38_classes.pth")
plant_model = load_model("ML/plant_classifier_complete.pth")
flower_model = load_model("ML/flower_classification_model_deployment.pth")

# ---------------- PREPROCESS ----------------
def preprocess(image, size=224):
    transform = transforms.Compose([
        transforms.Resize((size,size)),
        transforms.ToTensor()
    ])
    return transform(image).unsqueeze(0).to(device)

# ---------------- DISEASE PREDICTION ----------------
DISEASE_CLASSES = ["Apple___healthy", "Apple___Apple_scab", "Tomato___Early_blight", "Tomato___healthy"]  # fill all
def predict_disease(image):
    x = preprocess(image)
    with torch.no_grad():
        out = disease_model(x)
        probs = torch.nn.functional.softmax(out, dim=1)
        conf, idx = torch.max(probs, 1)
        return {
            "success": True,
            "diagnosis": DISEASE_CLASSES[idx.item()],
            "confidence": round(conf.item()*100,2)
        }

# ---------------- PLANT PREDICTION ----------------
PLANT_CLASSES = ["Rose", "Tulip", "Sunflower"]  # fill all
def predict_plant(image):
    x = preprocess(image)
    with torch.no_grad():
        out = plant_model(x)
        probs = torch.nn.functional.softmax(out, dim=1)
        conf, idx = torch.max(probs,1)
        return {
            "success": True,
            "plant": PLANT_CLASSES[idx.item()],
            "confidence": round(conf.item()*100,2)
        }

# ---------------- FLOWER PREDICTION ----------------
FLOWER_CLASSES = ["Daisy", "Lily", "Orchid"]  # fill all
def predict_flower(image):
    x = preprocess(image)
    with torch.no_grad():
        out = flower_model(x)
        probs = torch.nn.functional.softmax(out, dim=1)
        conf, idx = torch.max(probs,1)
        return {
            "success": True,
            "flower": FLOWER_CLASSES[idx.item()],
            "confidence": round(conf.item()*100,2)
        }

# ---------------- ROUTES ----------------
@app.route('/disease', methods=['POST'])
def disease_route():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image uploaded'})
    file = request.files['image']
    image = Image.open(io.BytesIO(file.read())).convert('RGB')
    return jsonify(predict_disease(image))

@app.route('/plant', methods=['POST'])
def plant_route():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image uploaded'})
    file = request.files['image']
    image = Image.open(io.BytesIO(file.read())).convert('RGB')
    return jsonify(predict_plant(image))

@app.route('/flower', methods=['POST'])
def flower_route():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image uploaded'})
    file = request.files['image']
    image = Image.open(io.BytesIO(file.read())).convert('RGB')
    return jsonify(predict_flower(image))

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "device": str(device)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
