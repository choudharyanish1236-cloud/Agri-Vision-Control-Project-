import os
import glob
from PIL import Image
from typing import Optional, Tuple, List, Dict
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

def default_transforms(image_size: int = 224):
    return transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])


class CottonDataset(Dataset):
    """
    Expects folder structure:
      root/
        classA/
          img1.jpg
          img2.jpg
        classB/
          img3.jpg
    """
    def __init__(self, root: str, transform: Optional[transforms.Compose] = None,
                 extensions: Tuple[str, ...] = ('.jpg', '.jpeg', '.png')):
        self.root = root
        if not os.path.isdir(root):
            raise ValueError(f"{root} is not a directory")
        self.classes = sorted([d for d in os.listdir(root) if os.path.isdir(os.path.join(root, d))])
        if len(self.classes) == 0:
            raise ValueError(f"No class subfolders found in {root}. Expect root/<class>/*.jpg")
        self.class_to_idx = {c: i for i, c in enumerate(self.classes)}
        self.samples = []
        for cls in self.classes:
            cls_dir = os.path.join(root, cls)
            for ext in extensions:
                self.samples += [(p, self.class_to_idx[cls]) for p in glob.glob(os.path.join(cls_dir, f'*{ext}'))]
        self.transform = transform or default_transforms()

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx: int):
        path, label = self.samples[idx]
        img = Image.open(path).convert('RGB')
        img = self.transform(img)
        return img, label, path

def create_dataloaders(root: str, batch_size: int = 16, image_size: int = 224,
                       num_workers: int = 0, splits: Tuple[str, ...] = ('train', 'val', 'test')):
    """
    Returns dict of DataLoader objects for splits found under 'root' (root/train, root/val, root/test).
    """
    loaders = {}
    for s in splits:
        split_dir = os.path.join(root, s)
        if not os.path.isdir(split_dir):
            continue
        ds = CottonDataset(split_dir, transform=default_transforms(image_size))
        loader = DataLoader(ds, batch_size=batch_size, shuffle=(s == 'train'), num_workers=num_workers)
        loaders[s] = loader
    return loaders
