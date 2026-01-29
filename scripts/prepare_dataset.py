import os
import shutil
import random
from pathlib import Path
from typing import Tuple
from sklearn.model_selection import train_test_split

RANDOM_SEED = 42

def split_dataset(input_root: str, output_root: str,
                  val_ratio: float = 0.15, test_ratio: float = 0.15,
                  min_imgs_per_class: int = 5) -> None:
    """
    Input: folder with subfolders per class.
    Output: organized train/val/test splits.
    """
    random.seed(RANDOM_SEED)
    input_root = Path(input_root)
    output_root = Path(output_root)
    output_root.mkdir(parents=True, exist_ok=True)

    dirs = [d for d in input_root.iterdir() if d.is_dir()]
    if not dirs:
        print(f"Error: No class directories found in {input_root}")
        return

    for cls_dir in dirs:
        cls = cls_dir.name
        images = [p for p in cls_dir.iterdir() if p.suffix.lower() in ('.jpg', '.jpeg', '.png')]
        if len(images) < min_imgs_per_class:
            print(f"Warning: class {cls} has only {len(images)} images (min expected {min_imgs_per_class})")
            if len(images) < 3: # Need at least 3 for a 3-way split
                continue
        
        try:
            train_and_val, test = train_test_split(images, test_size=test_ratio, random_state=RANDOM_SEED, shuffle=True)
            train, val = train_test_split(train_and_val, test_size=val_ratio/(1.0 - test_ratio),
                                          random_state=RANDOM_SEED, shuffle=True)
            
            for split_name, split_list in [('train', train), ('val', val), ('test', test)]:
                out_dir = output_root / split_name / cls
                out_dir.mkdir(parents=True, exist_ok=True)
                for p in split_list:
                    dst = out_dir / p.name
                    shutil.copy2(p, dst)
            print(f"{cls}: train={len(train)}, val={len(val)}, test={len(test)}")
        except Exception as e:
            print(f"Skipping class {cls} due to split error: {e}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='Path to input root (class subfolders)')
    parser.add_argument('--output', required=True, help='Path to output root (will contain train/val/test)')
    parser.add_argument('--val_ratio', type=float, default=0.15)
    parser.add_argument('--test_ratio', type=float, default=0.15)
    args = parser.parse_args()

    split_dataset(args.input, args.output, val_ratio=args.val_ratio, test_ratio=args.test_ratio)
