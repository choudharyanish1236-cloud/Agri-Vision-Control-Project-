import os
import zipfile
import uuid
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import torch
import torchvision.models as models

# Local imports
from scripts.prepare_dataset import split_dataset
from cotton_dataset import create_dataloaders

TMP_ROOT = Path("uploads")
TMP_ROOT.mkdir(exist_ok=True)

app = FastAPI(title="AgriVision Dataset API")

def allowed_zip_structure(root: Path) -> bool:
    for d in root.iterdir():
        if d.is_dir():
            return True
    return False

@app.post("/upload_dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a ZIP archive, prepare splits, and run sanity checks.
    """
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Please upload a .zip file.")

    uid = uuid.uuid4().hex[:8]
    work_dir = TMP_ROOT / uid
    raw_dir = work_dir / "raw"
    processed_dir = work_dir / "processed"
    work_dir.mkdir(parents=True, exist_ok=True)
    raw_dir.mkdir(parents=True, exist_ok=True)
    zip_path = work_dir / file.filename

    with open(zip_path, "wb") as f:
        content = await file.read()
        f.write(content)

    try:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(path=raw_dir)
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid ZIP archive.")

    # Flatten structure if zipped folder
    top_children = [p for p in raw_dir.iterdir() if p.is_dir()]
    if len(top_children) == 1 and not any(p.is_file() for p in raw_dir.iterdir()):
        candidate = top_children[0]
        for item in candidate.iterdir():
            shutil.move(str(item), str(raw_dir))
        try:
            candidate.rmdir()
        except OSError:
            pass

    if not allowed_zip_structure(raw_dir):
        raise HTTPException(status_code=400, detail="ZIP must contain class subfolders.")

    split_dataset(str(raw_dir), str(processed_dir), val_ratio=0.15, test_ratio=0.15)
    loaders = create_dataloaders(str(processed_dir), batch_size=8, num_workers=0)

    stats = {}
    for split, loader in loaders.items():
        ds = loader.dataset
        class_counts = {}
        for _, label, _ in ds:
            cls_name = ds.classes[label]
            class_counts[cls_name] = class_counts.get(cls_name, 0) + 1
        stats[split] = {
            "num_batches": len(loader),
            "num_samples": len(ds),
            "class_counts": class_counts,
            "classes": ds.classes
        }

    # Sanity check with ResNet backbone
    device = torch.device("cpu")
    model = models.resnet18(pretrained=True)
    model.eval()
    model.to(device)
    pipeline_ok = False
    sample_run = {}
    try:
        # Try to get first batch from val or any available split
        dl = loaders.get('val', next(iter(loaders.values())))
        batch = next(iter(dl))
        imgs, labels, paths = batch
        with torch.no_grad():
            out = model(imgs)
        pipeline_ok = True
        sample_run = {
            "batch_shape": list(imgs.shape),
            "output_shape": list(out.shape),
            "sample_paths": [str(Path(p).name) for p in paths[:3]]
        }
    except Exception as e:
        pipeline_ok = False
        sample_run = {"error": str(e)}

    return {
        "upload_id": uid,
        "stats": stats,
        "pipeline_sanity_check": pipeline_ok,
        "sample_run": sample_run,
        "work_dir": str(work_dir)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
