import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
from PIL import Image

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20

def train_model(train_dir, val_dir):
    # Data Augmentation and Normalization
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(IMG_SIZE),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(20),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(IMG_SIZE),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    image_datasets = {
        'train': datasets.ImageFolder(train_dir, data_transforms['train']),
        'val': datasets.ImageFolder(val_dir, data_transforms['val'])
    }
    
    dataloaders = {
        'train': DataLoader(image_datasets['train'], batch_size=BATCH_SIZE, shuffle=True),
        'val': DataLoader(image_datasets['val'], batch_size=BATCH_SIZE, shuffle=False)
    }
    
    class_names = image_datasets['train'].classes
    num_classes = len(class_names)
    print(f"Detected {num_classes} classes: {class_names}")

    # Use MobileNetV2
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
    
    # Freeze base model
    for param in model.parameters():
        param.requires_grad = False
        
    # Replace the classifier
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Sequential(
        nn.Linear(num_ftrs, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, num_classes)
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    model = model.to(device)

    if device.type == 'cuda':
        print(f"GPU Name: {torch.cuda.get_device_name(0)}")
        # Enable benchmark for faster training on fixed input sizes
        torch.backends.cudnn.benchmark = True

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)

    # Training loop
    for epoch in range(EPOCHS):
        print(f'Epoch {epoch}/{EPOCHS - 1}')
        print('-' * 10)

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(image_datasets[phase])
            epoch_acc = running_corrects.double() / len(image_datasets[phase])

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

    # Save model
    torch.save(model.state_dict(), 'plant_disease_model.pth')
    
    # Save class indices
    with open('class_indices.json', 'w') as f:
        inv_map = {i: name for i, name in enumerate(class_names)}
        json.dump(inv_map, f)
        
    print("Training complete. Model saved as plant_disease_model.pth")

if __name__ == "__main__":
    train_path = 'data/PlantDoc-Dataset-master/train'
    test_path = 'data/PlantDoc-Dataset-master/test'
    
    if not os.path.exists(train_path):
        print(f"Dataset not found at {train_path}. Please check the folder structure.")
    else:
        train_model(train_path, test_path)
