# fix_plant_model.py
import torch
import torch.nn as nn
from torchvision import models

# Load the unsafe model with weights_only=False
print("🔄 Loading original model...")
checkpoint = torch.load("plant_classifier_complete.pth", map_location='cpu', weights_only=False)

# Create new model
def create_plant_model(num_classes=30):
    model = models.resnet50(pretrained=False)
    num_ftrs = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(num_ftrs, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, num_classes)
    )
    return model

print("🏗️ Creating new model...")
model = create_plant_model(num_classes=len(checkpoint['class_names']))

# Load weights
print("📦 Loading state dict...")
model.load_state_dict(checkpoint['model_state_dict'])

# Save as SAFE format
print("💾 Saving safe model...")
torch.save({
    'model_state_dict': model.state_dict(),
    'class_names': checkpoint['class_names']
}, "plant_classifier_SAFE.pth", _use_new_zipfile_serialization=True)

print("✅ Model converted to safe format!")