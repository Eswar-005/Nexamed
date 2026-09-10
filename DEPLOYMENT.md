# 🚀 Nexamed Healthcare Portal - 100% Free Deployment Guide

This guide walks you through deploying both the **Frontend** (Vite + React) and **Backend** (Express + Node.js + MongoDB) for **100% FREE** using modern hosting services.

---

## 🛠️ Free Hosting Architecture

| Component | Platform | Free Tier Highlights | Setup Time |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | Free global CDN, custom domains, auto Git deployments | ~2 mins |
| **Backend API** | **Render** (or Vercel) | Free Web Service (Node.js Express) | ~2 mins |
| **Database** | **MongoDB Atlas** | Free M0 Cluster (512 MB storage, shared RAM) | ~3 mins |

---

## Step 1: Create a Free MongoDB Atlas Database (3 mins)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Click **Create a Deployment** and choose **M0 Free Tier**.
3. Select any region (e.g. AWS / N. Virginia or Singapore).
4. Create a **Database User**:
   - Username: `nexamed_user`
   - Password: `YourStrongPassword123` (Save this password!)
5. Under **Network Access**, click **Add IP Address** -> Select **Allow Access from Anywhere (`0.0.0.0/0`)** -> Click **Confirm**.
6. Click **Database** -> **Connect** -> Choose **Drivers** (Node.js).
7. Copy your MongoDB Connection String. It looks like:
   ```text
   mongodb+srv://nexamed_user:<password>@cluster0.abcde.mongodb.net/nexamed?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your actual database user password).*

---

## Step 2: Deploy Backend to Render (Free Web Service) (2 mins)

1. Push your repository to [GitHub](https://github.com).
2. Sign up / Log in to [Render.com](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository (`Nexamed`).
5. Fill in the deployment details:
   - **Name**: `nexamed-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Scroll down to **Environment Variables** and add:
   - `MONGODB_URI`: `mongodb+srv://nexamed_user:YourStrongPassword123@cluster0.abcde.mongodb.net/nexamed?retryWrites=true&w=majority`
   - `JWT_SECRET`: `nexamed_super_secret_jwt_key_2026`
   - `PORT`: `5000`
7. Click **Create Web Service**.
8. Once built, copy your backend live URL (e.g. `https://nexamed-backend.onrender.com`).
9. Test your backend health check by visiting:
   `https://nexamed-backend.onrender.com/health` in your browser.

---

## Step 3: Deploy Frontend to Vercel (Free) (2 mins)

1. Sign up / Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project** -> Import your GitHub repository (`Nexamed`).
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL`: `https://nexamed-backend.onrender.com` (Your Render backend URL from Step 2)
5. Click **Deploy**.
6. Vercel will build and launch your application! You will get a live URL such as:
   `https://nexamed.vercel.app`

---

## ⚡ Alternative: 1-Click Vercel Rewrite Configuration

If you prefer proxying `/api` requests automatically through Vercel:
1. Open `vercel.json` in the project root.
2. Replace `https://YOUR_BACKEND_URL.onrender.com` with your deployed Render URL.
3. Commit and push to GitHub. Vercel will automatically redeploy!

---

## 🔍 Verification Checklist

- [x] **Backend Health Check**: Open `https://<YOUR_RENDER_URL>/health` (returns `{"status":"OK",...}`).
- [x] **Frontend UI**: Open `https://<YOUR_VERCEL_URL>` in browser or mobile.
- [x] **Database Auto-Seeding**: Navigating to Symptom Checker or Pharma Encyclopedia auto-populates medicines and diseases from MongoDB Atlas.
- [x] **Authentication & Profiles**: Click **Patient Portal** -> **Try Demo Account** to log in instantly.
- [x] **Emergency SOS**: Click **SOS 108 Emergency** to test location broadcast & emergency alerts.

---

## 💻 Local Development Commands

To run both client and server locally:

```bash
# Install dependencies for both client and server
npm run install:all

# Run Backend (Port 5000)
npm run dev:server

# Run Frontend (Port 5173 with Vite proxy)
npm run dev:client
```
