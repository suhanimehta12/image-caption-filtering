from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io, base64, os, time
import pandas as pd
import numpy as np
from PIL import Image

from captioning import generate_caption, compute_bleu, compute_rouge, compute_cider_like
from filters import apply_filter

app = FastAPI(title="AI Vision Studio API", version="1.0.0", description="Image Captioning + Filtering API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FEEDBACK_FILE = "feedback_log.csv"

@app.get("/")
def root():
    return {"message": "AI Vision Studio API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# ── CAPTIONING ENDPOINTS ────────────────────────────────────────────────────

@app.post("/api/caption")
async def caption_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        caption = generate_caption(image)
        return {"caption": caption, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/evaluate")
async def evaluate_caption(reference: str = Form(...), candidate: str = Form(...)):
    try:
        bleu  = compute_bleu(reference, candidate)
        rouge = compute_rouge(reference, candidate)
        cider = compute_cider_like(reference, candidate)
        return {
            "bleu":       round(float(bleu),  4),
            "rouge_l":    round(float(rouge), 4),
            "cider_like": round(float(cider), 4),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feedback")
async def save_feedback(
    image_name:        str = Form(...),
    generated_caption: str = Form(...),
    edited_caption:    str = Form(...),
    rating:            str = Form(...),
):
    try:
        row = {
            "image":             image_name,
            "generated_caption": generated_caption,
            "edited_caption":    edited_caption,
            "rating":            rating,
            "timestamp":         time.strftime("%Y-%m-%d %H:%M:%S"),
        }
        df = pd.DataFrame([row])
        if os.path.exists(FEEDBACK_FILE):
            df.to_csv(FEEDBACK_FILE, mode="a", header=False, index=False)
        else:
            df.to_csv(FEEDBACK_FILE, index=False)
        return {"message": "Feedback saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/feedback")
async def get_feedback():
    try:
        if not os.path.exists(FEEDBACK_FILE):
            return {"feedback": []}
        df = pd.read_csv(FEEDBACK_FILE)
        return {"feedback": df.fillna("").to_dict(orient="records")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/feedback")
async def clear_feedback():
    if os.path.exists(FEEDBACK_FILE):
        os.remove(FEEDBACK_FILE)
    return {"message": "Feedback log cleared"}

# ── FILTERING ENDPOINT ──────────────────────────────────────────────────────

@app.post("/api/filter")
async def filter_image(
    file:        UploadFile = File(...),
    filter_type: str = Form(...),
    ksize:       int = Form(5),
    thresh1:     int = Form(100),
    thresh2:     int = Form(200),
    iterations:  int = Form(1),
):
    try:
        image_bytes = await file.read()
        image  = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(image)

        filtered = apply_filter(img_np, filter_type, ksize, thresh1, thresh2, iterations)

        filtered_pil = Image.fromarray(filtered.astype(np.uint8))
        buf = io.BytesIO()
        filtered_pil.save(buf, format="PNG")
        buf.seek(0)
        encoded = base64.b64encode(buf.read()).decode("utf-8")

        return {"filtered_image": f"data:image/png;base64,{encoded}", "filter_type": filter_type}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
