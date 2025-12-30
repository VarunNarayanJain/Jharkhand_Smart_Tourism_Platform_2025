# 🚀 Quick Start Deployment Guide

**Goal**: Deploy your Jharkhand Tourism app to production in 3 steps!

---

## ✅ Pre-requisites Checklist

- [x] Database is running (Supabase - already configured!)
- [x] Code is ready for deployment
- [x] GitHub repository exists
- [ ] API keys ready (Groq/OpenAI)
- [ ] Accounts created (Render, Vercel)

---

## 📦 STEP 1: Prepare & Push to GitHub

### 1.1 Make sure `.env` files are NOT committed

Check your `.gitignore`:
```bash
# View gitignore
cat .gitignore

# Should include:
# .env
# .env.local
# backend/.env
```

### 1.2 Commit and push your code

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Prepare for production deployment"

# Push to GitHub
git push origin main
```

**⚠️ STOP**: Verify on GitHub that `.env` files are NOT visible!

---

## 🖥️ STEP 2: Deploy Backend on Render

### 2.1 Create Render Account
1. Go to: https://render.com/
2. Click "Get Started" → Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find: `Jharkhand_Smart_Tourism_Platform_2025`
4. Click **"Connect"**

### 2.3 Configure Service

Fill in these **EXACT** values:

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `jharkhand-tourism-api` | Can be anything, but this is clear |
| **Region** | `Singapore` or `Oregon` | Choose closest to your users |
| **Branch** | `main` | Your main branch |
| **Root Directory** | `backend` | ⚠️ CRITICAL - tells Render where your backend is |
| **Runtime** | `Node` | Auto-detected |
| **Build Command** | `npm install` | Auto-detected |
| **Start Command** | `npm start` | Auto-detected |
| **Instance Type** | `Free` | Perfect for learning/testing |

### 2.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these ONE BY ONE:

```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 5000
```

```
Key: GROQ_API_KEY
Value: <your_actual_groq_key>
```
**Get it from**: https://console.groq.com/keys (FREE!)

```
Key: OPENAI_API_KEY
Value: <your_actual_openai_key>
```
**Get it from**: https://platform.openai.com/api-keys (if you have one)

```
Key: FRONTEND_URL
Value: http://localhost:5173
```
**Note**: We'll update this after deploying frontend!

### 2.5 Deploy!

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Watch the logs (they'll show in real-time)

### 2.6 Test Your Backend

Once deployed, you'll see a URL like:
```
https://jharkhand-tourism-api.onrender.com
```

**Test it** by opening this in your browser:
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

✅ **Backend is LIVE!**

**Copy your backend URL - you'll need it for Step 3!**

---

## 🌐 STEP 3: Deploy Frontend on Vercel

### 3.1 Go to Vercel
1. Visit: https://vercel.com/
2. Click "Sign Up" → **Continue with GitHub**
3. Authorize Vercel

### 3.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find: `Jharkhand_Smart_Tourism_Platform_2025`
3. Click **"Import"**

### 3.3 Configure Project Settings

Vercel auto-detects most settings, but verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite (auto-detected) |
| **Root Directory** | `.` (leave as-is) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3.4 Add Environment Variables

Click **"Environment Variables"** section

Add these THREE variables:

```
Name: VITE_API_URL
Value: https://jharkhand-tourism-api.onrender.com
```
**Use YOUR actual Render URL from Step 2.6!**

```
Name: VITE_SUPABASE_URL
Value: https://qcwdmwswtzomibvenhvd.supabase.co
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd2Rtd3N3dHpvbWlidmVuaHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTI3NzMsImV4cCI6MjA3NTI2ODc3M30.4vLVbq-w4ay9GrbS3KKanNylrqTPzyLb9vHFQLSPLiA
```

**For all three**: Leave "Apply to" as **"Production, Preview, and Development"**

### 3.5 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Vercel builds and deploys your app

### 3.6 Get Your Frontend URL

Once deployed, you'll see:
```
https://jharkhand-tourism-abc123.vercel.app
```

**Test it** by clicking the URL!

✅ **Frontend is LIVE!**

**Copy your frontend URL - you need it for Step 4!**

---

## 🔗 STEP 4: Connect Frontend & Backend (Fix CORS)

### Why this step?
Your backend currently only allows `localhost` requests. We need to tell it to accept requests from your Vercel domain.

### 4.1 Update Backend Environment Variable

1. Go back to **Render Dashboard**: https://dashboard.render.com/
2. Click on your `jharkhand-tourism-api` service
3. Click **"Environment"** in the left sidebar
4. Find `FRONTEND_URL`
5. Click **"Edit"**
6. Change value to your Vercel URL:
   ```
   https://jharkhand-tourism-abc123.vercel.app
   ```
   **Use YOUR actual Vercel URL!**
7. Click **"Save Changes"**

### 4.2 Wait for Redeploy
- Render automatically redeploys (takes 2-3 minutes)
- Watch the logs to see it complete

### 4.3 Test Everything!

Visit your Vercel URL and test:

- [ ] Homepage loads ✅
- [ ] Destinations page works ✅
- [ ] Chatbot opens and responds ✅
- [ ] Itinerary planner generates plans ✅
- [ ] No CORS errors in console (F12) ✅

---

## 🎉 YOU'RE LIVE!

Your complete app is now deployed:

```
🌐 Frontend: https://your-app.vercel.app
🖥️ Backend:  https://your-api.onrender.com
💾 Database: Supabase (already hosted)
```

---

## 📱 Share Your App

You can now share your Vercel URL with anyone:
- Portfolio
- Resume
- Friends & family
- Social media

---

## 🔄 How to Update (After Changes)

Whenever you make code changes:

```bash
# Make changes in your code
# ...

# Commit and push
git add .
git commit -m "Your change description"
git push origin main
```

**What happens automatically:**
- ✅ Vercel detects push → rebuilds frontend (2-3 min)
- ✅ Render detects push → rebuilds backend (3-5 min)
- ✅ Database always stays current

**No manual deployment needed!**

---

## 🐛 Troubleshooting Common Issues

### Backend not responding (503 error)
**Problem**: Render free tier sleeps after 15 min of inactivity
**Solution**: First request wakes it up (takes 30 sec)
**Prevention**: Use cron-job.org to ping `/health` every 10 minutes

### CORS errors in browser
**Problem**: `FRONTEND_URL` doesn't match your Vercel domain
**Solution**: 
1. Check Render environment variables
2. Make sure no trailing slash: `https://your-app.vercel.app` (not `...app/`)
3. Wait for Render to redeploy after changing

### Chatbot not responding
**Problem**: Missing or invalid API key
**Solution**:
1. Check Render logs for errors
2. Verify `GROQ_API_KEY` or `OPENAI_API_KEY` in Render environment
3. Test key at https://console.groq.com/

### Build fails on Vercel
**Problem**: TypeScript errors or missing dependencies
**Solution**:
1. Check Vercel build logs
2. Fix errors locally first: `npm run build`
3. Push fixes to GitHub

### Database connection issues
**Problem**: Supabase URL or key incorrect
**Solution**:
1. Check Vercel environment variables
2. Verify keys in Supabase dashboard
3. Check browser console for specific errors

---

## 📊 Monitor Your App

### Render Logs
- **URL**: https://dashboard.render.com/
- Shows all API requests, errors, and server logs
- Real-time updates

### Vercel Logs
- **URL**: https://vercel.com/dashboard
- Shows build logs and runtime info
- Analytics available

### Supabase Dashboard
- **URL**: https://app.supabase.com/
- Monitor database queries
- View table data
- Check API usage

---

## 💡 Next Steps (Optional)

1. **Custom Domain**
   - Buy domain (Namecheap, GoDaddy)
   - Add to Vercel settings
   - Point DNS to Vercel

2. **Analytics**
   - Add Google Analytics
   - Use Vercel Analytics
   - Track user behavior

3. **Performance**
   - Optimize images
   - Add loading states
   - Enable caching

4. **SEO**
   - Add meta tags
   - Create sitemap
   - Optimize titles/descriptions

---

## 📚 Helpful Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Your GitHub**: https://github.com/VarunNarayanJain/Jharkhand_Smart_Tourism_Platform_2025

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend health check works
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads successfully
- [ ] CORS configured (FRONTEND_URL updated)
- [ ] Chatbot tested and working
- [ ] Itinerary planner tested
- [ ] Database queries working
- [ ] No console errors

---

**Congratulations! You've successfully deployed a full-stack application! 🎉**

Need help? Check the troubleshooting section or the full `DEPLOYMENT_GUIDE.md` for more details!
