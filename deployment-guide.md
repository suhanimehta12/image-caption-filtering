# 🚀 Deployment Guide — AI Vision Studio

Step-by-step instructions to deploy both frontend and backend live.

---

## 📋 Overview

| Part | Platform | Free Tier |
|---|---|---|
| Backend (FastAPI) | Render | ✅ Yes (sleeps after 15min) |
| Frontend (React) | Vercel | ✅ Yes (unlimited) |

---

## STEP 1 — Push to GitHub

### Create the repo

1. Go to https://github.com/new
2. Name it `ai-vision-studio`
3. Keep it **Public**
4. Click **Create repository**

### Push your code

```bash
cd ai-vision-studio
git init
git add .
git commit -m "feat: initial AI Vision Studio"
git remote add origin https://github.com/YOUR_USERNAME/ai-vision-studio.git
git branch -M main
git push -u origin main
```

---

## STEP 2 — Deploy Backend on Render

### 2.1 Create a Render account
Sign up at https://render.com (free tier is fine)

### 2.2 Create a new Web Service

1. Click **New → Web Service**
2. Connect your GitHub repo: `ai-vision-studio`
3. Fill in the settings:

| Field | Value |
|---|---|
| **Name** | `ai-vision-studio-backend` |
| **Region** | Oregon (US West) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

4. Click **Create Web Service**

### 2.3 Wait for deploy (~5-10 min)
Render installs dependencies and downloads the BLIP model.  
Your backend URL will be: `https://ai-vision-studio-backend.onrender.com`

### 2.4 Test it
Visit: `https://ai-vision-studio-backend.onrender.com/docs`  
You should see the FastAPI Swagger interface.

> ⚠️ **Free tier note:** Render spins down inactive services after 15 minutes. First request after sleep may take ~30s.

---

## STEP 3 — Deploy Frontend on Vercel

### 3.1 Create Vercel account
Sign up at https://vercel.com with your GitHub account

### 3.2 Import project

1. Click **Add New → Project**
2. Select your `ai-vision-studio` repo
3. Configure:

| Field | Value |
|---|---|
| **Framework Preset** | `Create React App` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |

### 3.3 Set Environment Variable

In the **Environment Variables** section:

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://ai-vision-studio-backend.onrender.com` |

4. Click **Deploy**

Your live URL will be: `https://ai-vision-studio.vercel.app`

---

## STEP 4 — Fix CORS (already handled)

The backend already has CORS configured to allow all origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← Allows Vercel frontend
    ...
)
```

For production hardening, replace `"*"` with your Vercel URL:

```python
allow_origins=["https://ai-vision-studio.vercel.app"]
```

---

## Alternative: Deploy Backend on Hugging Face Spaces

If your model needs GPU:

1. Go to https://huggingface.co/spaces
2. Click **Create new Space**
3. Select **Docker** as SDK
4. Create a `Dockerfile` in `backend/`:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

5. Push just the `backend/` folder to the Space repo
6. Set `REACT_APP_API_URL` to your HF Space URL

---

## Alternative: Deploy Backend on Railway

1. Go to https://railway.app
2. Click **New Project → Deploy from GitHub**
3. Select `ai-vision-studio`
4. Set:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `PORT` env variable → Railway sets this automatically

---

## 🔁 Updating the App

After making changes locally:

```bash
git add .
git commit -m "feat: your change"
git push
```

Both Render and Vercel will auto-redeploy on push to `main`.

---

## 🐛 Common Issues

| Issue | Fix |
|---|---|
| BLIP model download fails on Render | Upgrade to paid tier for longer build time, or pre-download to HF Spaces |
| CORS error in browser | Check `REACT_APP_API_URL` is set correctly in Vercel |
| Backend returns 500 on `/api/caption` | Check Render logs: `render logs --tail` |
| Frontend shows "Failed to fetch" | Backend may be sleeping — wait 30s and retry |
| `npm run build` fails | Ensure `frontend/` is set as root directory in Vercel |
| Render deploy times out | BLIP model is large; use Starter plan ($7/mo) for persistent instances |

---

## 📊 Final URLs

After deployment your project will have:

- 🌐 **Live App**: `https://ai-vision-studio.vercel.app`
- 🔌 **API**: `https://ai-vision-studio-backend.onrender.com`
- 📚 **API Docs**: `https://ai-vision-studio-backend.onrender.com/docs`
- 💻 **GitHub**: `https://github.com/YOUR_USERNAME/ai-vision-studio`
