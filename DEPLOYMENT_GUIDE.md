# 🚀 Jharkhand Tourism - Complete Deployment Guide

This guide walks you through deploying your full-stack tourism application from scratch.

---

## 📊 Tech Stack Overview

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + OpenAI/Groq
- **Database**: Supabase (PostgreSQL)
- **Deployment**:
  - Frontend: Vercel
  - Backend: Render
  - Database: Supabase (already hosted)

---

## 🎯 Deployment Strategy

### Architecture Overview
```
User's Browser
    ↓
Frontend (Vercel) → https://jharkhand-tourism.vercel.app
    ↓ API Calls
Backend (Render) → https://jharkhand-tourism-api.onrender.com
    ↓ Database Queries
Database (Supabase) → Already hosted
```

---

## PART 1: Database Deployment ✅ (Already Done!)

Your Supabase database is already set up and running at:
- **URL**: `https://qcwdmwswtzomibvenhvd.supabase.co`
- **Status**: ✅ Live and ready

**What you have:**
- All tables created (destinations, itineraries, marketplace_items, etc.)
- Authentication system ready
- API keys configured
- Automatic backups and scaling

**No action needed for database!**

---

## PART 2: Backend API Deployment 🚀

### Why Render?
- ✅ Free tier (perfect for learning)
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS
- ✅ Zero DevOps knowledge required
- ✅ Great for Node.js apps

---

### Step 2.1: Prepare Your Backend Code

**What we need to do:**
1. Make sure your backend listens on `process.env.PORT` ✅ (already done)
2. Configure CORS to allow your frontend domain
3. Set up environment variables
4. Push to GitHub

**Already done in your code:**
- ✅ `PORT` from environment variable (line 12 in server.js)
- ✅ CORS configuration with `FRONTEND_URL` (line 26)
- ✅ All API routes set up
- ✅ Health check endpoint

---

### Step 2.2: Push Your Code to GitHub

**If you haven't already:**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Add your GitHub remote (replace with your repo)
git remote add origin https://github.com/VarunNarayanJain/Jharkhand_Smart_Tourism_Platform_2025.git

# Push to GitHub
git push -u origin main
```

**Important**: Make sure `.env` is in `.gitignore` so secrets aren't exposed!

---

### Step 2.3: Deploy on Render

#### Step-by-Step Process:

**1. Create a Render Account**
- Go to: https://render.com/
- Sign up with GitHub (easiest)
- This automatically connects your repositories

**2. Create a New Web Service**
- Click "New +" → "Web Service"
- Select "Connect a repository"
- Find your `Jharkhand_Smart_Tourism_Platform_2025` repo
- Click "Connect"

**3. Configure Your Service**

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `jharkhand-tourism-api` |
| **Region** | Choose closest to you (e.g., Singapore/Oregon) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ IMPORTANT! |
| **Runtime** | `Node` (auto-detected) |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

**4. Add Environment Variables**

In the "Environment Variables" section, click "Add Environment Variable" for each:

| Key | Value | Where to get it |
|-----|-------|-----------------|
| `NODE_ENV` | `production` | Just type this |
| `PORT` | `5000` | Just type this (Render overrides it anyway) |
| `GROQ_API_KEY` | `your_actual_key` | Get from https://console.groq.com/keys |
| `OPENAI_API_KEY` | `your_actual_key` | Get from https://platform.openai.com/api-keys |
| `FRONTEND_URL` | `http://localhost:5173` | We'll update this after frontend deploy |

⚠️ **IMPORTANT**: 
- Don't include quotes around values
- Don't commit these to GitHub
- Keep them private

**5. Deploy!**
- Click "Create Web Service"
- Render will start building and deploying
- Wait 2-5 minutes for first deploy
- You'll see build logs in real-time

**6. Get Your Backend URL**

Once deployed, Render gives you a URL like:
```
https://jharkhand-tourism-api.onrender.com
```

**7. Test Your Backend**

Open in browser or use curl:
```
https://jharkhand-tourism-api.onrender.com/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Jharkhand Tourism Backend is running",
  "timestamp": "2025-12-31T..."
}
```

✅ **Backend is now live!**

---

### ⚠️ Important Render Notes

**Free Tier Limitations:**
- Sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month (plenty for testing)

**To keep it awake (optional):**
- Use a service like Cron-Job.org to ping your `/health` endpoint every 10 minutes
- Or upgrade to paid plan ($7/month) for always-on

---

## PART 3: Frontend Deployment 🔷

### Why Vercel?
- ✅ You already know it!
- ✅ Best for React/Vite apps
- ✅ Automatic builds on Git push
- ✅ Free tier is very generous
- ✅ Global CDN for fast loading

---

### Step 3.1: Prepare Frontend Configuration

**Create production environment file:**

Create `.env.production` in your root directory with:

```env
VITE_API_URL=https://jharkhand-tourism-api.onrender.com
VITE_SUPABASE_URL=https://qcwdmwswtzomibvenhvd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd2Rtd3N3dHpvbWlidmVuaHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTI3NzMsImV4cCI6MjA3NTI2ODc3M30.4vLVbq-w4ay9GrbS3KKanNylrqTPzyLb9vHFQLSPLiA
```

**Update your API calls (if needed):**

Make sure your frontend uses `VITE_API_URL`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

### Step 3.2: Deploy on Vercel

#### Step-by-Step Process:

**1. Go to Vercel**
- Visit: https://vercel.com/
- Login with GitHub

**2. Import Your Project**
- Click "Add New..." → "Project"
- Find your `Jharkhand_Smart_Tourism_Platform_2025` repo
- Click "Import"

**3. Configure Project Settings**

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite (auto-detected) |
| **Root Directory** | `.` (leave default) |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected) |

**4. Add Environment Variables**

Click "Environment Variables" and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://jharkhand-tourism-api.onrender.com` |
| `VITE_SUPABASE_URL` | `https://qcwdmwswtzomibvenhvd.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

**5. Deploy!**
- Click "Deploy"
- Vercel builds your app (1-2 minutes)
- You get a URL like: `https://jharkhand-tourism-abc123.vercel.app`

**6. Test Your Frontend**
- Visit your Vercel URL
- Try navigating the site
- Test chatbot feature
- Test itinerary planner

✅ **Frontend is now live!**

---

### Step 3.3: Update Backend CORS

**Now that frontend is deployed, update your backend:**

1. Go to Render dashboard
2. Find your `jharkhand-tourism-api` service
3. Go to "Environment" tab
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://jharkhand-tourism-abc123.vercel.app
   ```
   (Use your actual Vercel URL)
5. Click "Save Changes"
6. Render will auto-redeploy (takes 1-2 minutes)

**Why this matters:**
- CORS is a browser security feature
- Backend must explicitly allow requests from your frontend domain
- Without this, API calls will fail with CORS errors

---

## PART 4: Final Integration & Testing 🧪

### Step 4.1: Test Everything End-to-End

**Test Checklist:**

1. **Homepage**
   - [ ] Images load
   - [ ] Hero video plays
   - [ ] Featured destinations display
   - [ ] Navigation works

2. **Destination Explorer**
   - [ ] Destinations load from Supabase
   - [ ] Filters work
   - [ ] Detail pages open
   - [ ] Search functions

3. **Chatbot**
   - [ ] Opens successfully
   - [ ] Sends messages
   - [ ] Gets AI responses
   - [ ] No CORS errors

4. **Itinerary Planner**
   - [ ] Form loads
   - [ ] Generates itinerary
   - [ ] Saves to Supabase
   - [ ] Displays results

5. **Authentication**
   - [ ] Sign up works
   - [ ] Login works
   - [ ] Protected routes work
   - [ ] Logout works

---

### Step 4.2: Monitor & Debug

**Check Logs:**

**Backend logs (Render):**
- Go to your Render dashboard
- Click your service
- Click "Logs" tab
- See real-time API requests

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for failed requests

**Common Issues & Fixes:**

| Issue | Solution |
|-------|----------|
| CORS error | Update FRONTEND_URL in Render |
| API not responding | Backend sleeping? Ping /health endpoint |
| Supabase error | Check API keys in Vercel env vars |
| Build failure | Check package.json scripts |
| 404 on routes | May need to configure redirects |

---

## 🎉 Congratulations! Your App is Live!

You now have:
- ✅ Frontend on Vercel (global CDN)
- ✅ Backend on Render (auto-scaling API)
- ✅ Database on Supabase (managed Postgres)
- ✅ Full CI/CD (auto-deploy on Git push)

---

## 📈 Next Steps (Optional Improvements)

### 1. Custom Domain
**Frontend (Vercel):**
- Buy domain (Namecheap, GoDaddy, etc.)
- Add to Vercel → Settings → Domains
- Update DNS records

**Backend (Render):**
- Add custom domain in Render settings
- Update CORS to allow new frontend domain

### 2. Performance Optimization
- Add caching headers
- Optimize images (use Vercel Image Optimization)
- Add loading states
- Implement lazy loading

### 3. Monitoring & Analytics
- Add Google Analytics
- Set up error tracking (Sentry)
- Monitor API performance (Render metrics)
- Track database queries (Supabase dashboard)

### 4. Security Enhancements
- Add rate limiting (already in code!)
- Implement RLS in Supabase
- Add HTTPS only
- Set up proper authentication flows

### 5. SEO Optimization
- Add meta tags
- Create sitemap
- Add robots.txt
- Implement Open Graph tags

---

## 🔄 How to Deploy Updates

**When you make code changes:**

```bash
# Make your changes
# ...

# Commit and push
git add .
git commit -m "Your update message"
git push origin main
```

**What happens automatically:**
1. ✅ Vercel detects push → builds → deploys frontend (2-3 min)
2. ✅ Render detects push → builds → deploys backend (3-5 min)
3. ✅ Database is always up-to-date (no deployment needed)

**That's it!** Both platforms auto-deploy on every push to main branch.

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Cost if Exceeded |
|---------|-----------|------------------|
| **Vercel** | 100 GB bandwidth/month | $20/month pro |
| **Render** | 750 hours/month | $7/month always-on |
| **Supabase** | 500 MB database, 2 GB bandwidth | $25/month pro |

**For learning/portfolio**: FREE ✅
**For production with traffic**: ~$30-50/month

---

## 🆘 Troubleshooting Guide

### Backend won't start
```bash
# Check Render logs
# Common issues:
# - Missing env vars
# - Package.json start script wrong
# - Port binding issue
```

### Frontend build fails
```bash
# Check Vercel build logs
# Common issues:
# - TypeScript errors
# - Missing dependencies
# - Wrong build command
```

### CORS errors
```bash
# Make sure:
# - FRONTEND_URL is correct in Render
# - No trailing slash in URL
# - CORS enabled in server.js
```

### Database connection fails
```bash
# Check:
# - Supabase URL is correct
# - API key is valid
# - Network connection
```

---

## 📚 Useful Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Your Render Dashboard**: https://dashboard.render.com/
- **Your Vercel Dashboard**: https://vercel.com/dashboard

---

## 🎓 What You've Learned

By completing this deployment, you now understand:

1. **Full-stack architecture** - Frontend, backend, database separation
2. **Environment variables** - Secure configuration management
3. **CORS** - Cross-origin resource sharing
4. **CI/CD** - Continuous deployment from Git
5. **Platform-as-a-Service** - Using managed hosting
6. **Production vs Development** - Different configurations
7. **API deployment** - Exposing backend services
8. **Static site deployment** - Serving React apps
9. **Database hosting** - Managed Postgres with Supabase
10. **Monitoring & debugging** - Production troubleshooting

---

## ✅ Quick Reference

**Your URLs:**
- Frontend: `https://[your-app].vercel.app`
- Backend: `https://[your-service].onrender.com`
- Database: `https://qcwdmwswtzomibvenhvd.supabase.co`

**Dashboards:**
- Vercel: https://vercel.com/dashboard
- Render: https://dashboard.render.com/
- Supabase: https://app.supabase.com/

**To update:**
```bash
git add .
git commit -m "Update"
git push origin main
```

---

**Need help?** Check the troubleshooting section or review platform docs!

**Good luck with your deployment! 🚀**
