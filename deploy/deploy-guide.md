# Free Deployment Guide

## Frontend Deployment Options

### 1. Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your `frontend` folder
3. Site will be live instantly at `https://yoursite.netlify.app`

### 2. Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo or drag & drop `frontend` folder
3. Live at `https://yoursite.vercel.app`

### 3. GitHub Pages
1. Push code to GitHub
2. Go to Settings > Pages
3. Select source branch
4. Live at `https://username.github.io/repo-name`

## Backend Deployment Options

### 1. Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Deploy `backend` folder
4. Auto-generates API URL

### 2. Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Heroku (Free tier ended)
Alternative: Use Railway or Render

## Quick Deploy Steps

### Frontend (Netlify):
```bash
# 1. Copy your HTML file to a new folder
mkdir deploy-frontend
cp frontend/ultra-modern-compare.html deploy-frontend/index.html

# 2. Update API URL in HTML to your deployed backend URL
# 3. Drag folder to netlify.com
```

### Backend (Railway):
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy ready"
git push

# 2. Connect Railway to GitHub repo
# 3. Deploy automatically
```

## Update API URL
After backend deployment, update this line in your HTML:
```javascript
const API_BASE = 'https://your-backend-url.railway.app/api';
```