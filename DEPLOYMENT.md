# Samajh Deployment Guide: Vercel (Frontend) & Render (Backend)

This document provides a comprehensive, step-by-step guide to deploying **Samajh** to production:
- **Frontend**: [Vercel](https://vercel.com) (React 18 + Vite SPA)
- **Backend**: [Render](https://render.com) (Node.js Express + Gemini AI)
- **Database**: [Supabase](https://supabase.com) (PostgreSQL with RLS)

---

## 1. Database Setup (Supabase)

Before deploying the backend, ensure your Supabase database schema is initialized:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the schema from [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql):
   - Creates the `users` and `documents` tables
   - Sets up indexes for fast user history queries
   - Enables Row Level Security (RLS)
4. Go to **Project Settings** -> **API** and note down:
   - **Project URL** (`SUPABASE_URL`)
   - **`service_role` secret key** (`SUPABASE_SECRET_KEY`)

---

## 2. Backend Deployment on Render

### Option A: 1-Click Blueprint (Recommended)
This repository includes a [`render.yaml`](./render.yaml) configuration file:

1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your repository: `https://github.com/Afnan-0206/AI-for-Accessibility-Inclusion`.
4. Render will detect `render.yaml` and prompt you for the required environment variables:
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_SECRET_KEY`: Your Supabase `service_role` secret key
   - `GEMINI_API_KEY`: Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - `CLIENT_ORIGIN`: Your frontend URL (e.g. `https://samajh.vercel.app` or `*`)
   - `JWT_SECRET`: Render will auto-generate a secure random 32-character string
5. Click **Apply**. Render will build and deploy the backend.

### Option B: Manual Web Service Setup
If creating a manual web service:
1. Click **New +** -> **Web Service**.
2. Connect your repository.
3. Configure the service settings:
   - **Name**: `samajh-backend`
   - **Language / Runtime**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
   - **Health Check Path**: `/health`
4. Under **Environment Variables**, add:
   | Variable | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Port provided by Render |
   | `SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase URL |
   | `SUPABASE_SECRET_KEY` | `your_service_role_key` | Supabase Service Role Key |
   | `JWT_SECRET` | `your-secure-random-key` | Random secret key (min 32 chars) |
   | `GEMINI_API_KEY` | `AIzaSy...` | Gemini API Key |
   | `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model (e.g. `gemini-2.5-flash`) |
   | `CLIENT_ORIGIN` | `https://your-app.vercel.app` | Vercel production domain or `*` |
5. Click **Create Web Service**.
6. Once deployed, note down your Render service URL:  
   `https://samajh-backend.onrender.com`

---

## 3. Frontend Deployment on Vercel

### Deploying via Vercel Dashboard

1. Log in to [vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
2. Import your GitHub repository: `Afnan-0206/AI-for-Accessibility-Inclusion`.
3. In **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client`** (or leave as root, as root fallback `vercel.json` is provided).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   | Variable | Value | Notes |
   |---|---|---|
   | `VITE_API_URL` | `https://samajh-backend.onrender.com/api` | Point to your Render service with `/api` |
   | `VITE_USE_MOCK` | `false` | Disables mock data to use live backend |
5. Click **Deploy**.
6. Once deployment finishes, copy your production Vercel URL (e.g. `https://samajh-client.vercel.app`).

### Update Render CORS (Final Step)
1. Go back to your Render dashboard -> **`samajh-backend`** -> **Environment**.
2. Set `CLIENT_ORIGIN` to your Vercel URL (e.g. `https://samajh-client.vercel.app`).
3. Save changes (Render will trigger a zero-downtime rolling restart).

---

## 4. Verification & Testing

### Test Backend Health
```bash
curl https://<your-backend>.onrender.com/health
# Response: {"status":"ok","uptime":...,"timestamp":"..."}
```

### Test API Health
```bash
curl https://<your-backend>.onrender.com/api/health
# Response: {"status":"ok"}
```

### Test Frontend Access
1. Open your Vercel deployment URL in a browser.
2. Sign up or log in with an account.
3. Upload a document (PDF or image).
4. Verify document classification, urgency detection, and voice/audio read-aloud functionality.
