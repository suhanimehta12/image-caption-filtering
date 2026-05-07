# 🧠 AI Vision Studio

> Production-grade AI image analysis platform — Image Captioning + NLP Evaluation + Computer Vision Filters

![Tech Stack](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![PyTorch](https://img.shields.io/badge/PyTorch-2.3-EE4C2C?style=flat-square&logo=pytorch)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🧠 Module 1 — Image Narrator
- Upload any image → BLIP Transformer generates a rich caption
- Edit the AI-generated caption with your own text
- Evaluate caption quality with **BLEU**, **ROUGE-L**, and **CIDEr-like** metrics
- Rate captions (Good / Needs Improvement) — stored in CSV for model improvement

### 🎨 Module 2 — Filter Studio
- Apply **10 real-time OpenCV filters**: Grayscale, Gaussian Blur, Edge Detection, Median Blur, Erosion, Dilation, Sharpening, Sepia, Emboss, Invert
- Tune filter parameters with interactive sliders
- Side-by-side original vs filtered preview
- One-click PNG download

### 💾 Module 3 — Feedback Log
- View all stored caption ratings in a searchable table
- Filter by Good / Needs Improvement
- Clear feedback log
- Data persisted in `feedback_log.csv`

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Backend API | FastAPI + Uvicorn |
| DL Model | BLIP (Salesforce) via HuggingFace Transformers |
| Computer Vision | OpenCV |
| NLP Metrics | NLTK, ROUGE-Score, scikit-learn TF-IDF |
| Frontend | React 18 + Tailwind CSS |
| HTTP Client | Axios |
| File Upload | react-dropzone |

---

## 📁 Project Structure

```
ai-vision-studio/
├── backend/
│   ├── main.py           # FastAPI app & all endpoints
│   ├── captioning.py     # BLIP model + NLP metric functions
│   ├── filters.py        # OpenCV filter implementations
│   ├── requirements.txt
│   └── feedback_log.csv  # Auto-generated on first feedback
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── CaptioningTab.jsx
│   │   │   ├── FilteringTab.jsx
│   │   │   └── FeedbackLog.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
├── deployment-guide.md
└── .gitignore
```

---

## 🚀 Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ai-vision-studio.git
cd ai-vision-studio
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be live at: `http://localhost:8000`  
Swagger docs at: `http://localhost:8000/docs`

> **Note:** First run will download the BLIP model (~1.9 GB). This is cached automatically.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm start
```

App will be live at: `http://localhost:3000`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status |
| `GET` | `/health` | Health check |
| `POST` | `/api/caption` | Generate caption from image |
| `POST` | `/api/evaluate` | Compute BLEU/ROUGE-L/CIDEr |
| `POST` | `/api/feedback` | Save feedback entry |
| `GET` | `/api/feedback` | Retrieve all feedback |
| `DELETE` | `/api/feedback` | Clear feedback log |
| `POST` | `/api/filter` | Apply image filter |

Full interactive docs at `http://localhost:8000/docs`

---

## 🔧 Environment Variables

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000
```

For production, set this to your deployed backend URL:

```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 📦 Deployment

See [deployment-guide.md](./deployment-guide.md) for full step-by-step instructions to deploy on:
- **Backend**: Render / Railway / Hugging Face Spaces
- **Frontend**: Vercel / Netlify

---

## 🧩 Skills Demonstrated

- Deep Learning model integration (BLIP Transformer via HuggingFace)
- REST API design with FastAPI
- Computer Vision pipeline (OpenCV)
- NLP evaluation metrics (BLEU, ROUGE, cosine similarity)
- Human-in-the-loop feedback collection
- React 18 component architecture
- Tailwind CSS responsive design
- Full-stack integration (Axios REST calls)
- Production deployment (Render + Vercel)
