# Railway Deployment Guide for ESI Flow Backend

## Step 1: Prepare Your Repository

### What I've Already Fixed ✅
- Fixed all file name typos (authmiddlware → authMiddleware, notifcationservice → notificationservice)
- Fixed folder name (cornjobs → cronjobs)
- Updated all imports
- Removed unused packages (@prisma/client, prisma, googleapis)
- Created `.env.example` for reference
- Updated CORS configuration for production

### Final Setup:
```bash
# Install updated dependencies (remove old unused packages)
npm install

# Test your setup locally
npm start

# Commit your changes
git add .
git commit -m "Fix typos, remove unused packages, prepare for Railway deployment"
git push origin main
```

---

## Step 2: Create Railway Account & Project

1. **Go to [railway.app](https://railway.app)**
2. **Sign up** (can use GitHub, Google, or email)
3. **Click "Create New Project"**
4. **Select "Deploy from GitHub"**
   - Authorize Railway to access your GitHub
   - Select `Erraid7/esi_flow_back` repository
   - Click "Deploy"

---

## Step 3: Add PostgreSQL Database (Neon)

Railway has 2 options:

### Option A: Use Railway's PostgreSQL (Simpler)
1. In your Railway project dashboard
2. Click **"+ Create"** → **"Database"** → **"PostgreSQL"**
3. Railway will auto-generate connection credentials
4. Copy the PostgreSQL connection string
5. Set `DB_*` environment variables (see Step 4)

### Option B: Keep Using Neon DB (Your Current Setup)
You're already using Neon, so just make sure credentials are set in Railway's environment variables.

---

## Step 4: Configure Environment Variables in Railway

1. **In Railway Dashboard**, go to **"Variables"** tab
2. **Add these variables** (copy from your `.env` file):

```
DB_USER=neondb_owner
DB_PASSWORD=npg_cbsKQae4nk8Y
DB_HOST=ep-raspy-bird-am9xqphq.c-5.us-east-1.aws.neon.tech
DB_NAME=neondb
DB_DIALECT=postgres
DB_SSL=true

NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-url.com

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=kjsdacjbnsdufhdjsnfsdjnufkjsdniunsdj
```

⚠️ **IMPORTANT**: 
- Use strong JWT_SECRET (generate here: https://randomkeygen.com/)
- For Gmail, use an App-Specific Password, not your regular password
- Never commit `.env` file - use `.env.example` as template

---

## Step 5: Update package.json (Optional but Recommended)

Your start script currently runs migrations on every deploy. For production:

```json
{
  "scripts": {
    "start": "node server.js",
    "migrate": "sequelize-cli db:migrate --env production"
  }
}
```

Then run migrations separately:
```bash
npm run migrate  # Run migrations before deploying
```

---

## Step 6: Verify Deployment

1. **Railway automatically deploys** when you push to `main`
2. **View logs**: Click "View Logs" in Railway dashboard
3. **Check if running**: Look for message like "Server running on port 3000"
4. **Test your API**: Railway gives you a public URL like:
   ```
   https://esi-flow-back-production.up.railway.app
   ```

5. **Test a route**:
   ```bash
   curl https://esi-flow-back-production.up.railway.app/
   # Should return: "welcome back to out website"
   ```

---

## Step 7: Update Frontend CORS

In your frontend code, update API base URL:

```javascript
// OLD (local development)
const API_URL = "http://localhost:3000"

// NEW (Railway production)
const API_URL = "https://esi-flow-back-production.up.railway.app"

// Or use environment variable
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"
```

Then update `FRONTEND_URL` in Railway environment variables to match your frontend domain.

---

## Step 8: Monitor Your Deployment

### View Logs:
- Click **"View Logs"** in Railway dashboard
- Filter by "Error", "Warning", "Info"

### Check Health:
```bash
# Test if backend is running
curl https://esi-flow-back-production.up.railway.app/
```

### Monitor Database:
- Go to [console.neon.tech](https://console.neon.tech)
- Check your database status and connections

---

## Common Issues & Solutions

### ❌ Error: "Cannot find module 'authMiddleware'"
**Solution**: Restart the deployment
```bash
# In Railway dashboard, click "Redeploy"
```

### ❌ Error: "ECONNREFUSED: Neon database"
**Solution**: 
- Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD` are correct
- Check if Neon connection string is accessible
- Test locally: `npm start`

### ❌ Email not sending
**Solution**:
- Use Gmail App Password (not regular password)
- Enable "Less secure app access" if needed
- Check EMAIL_USER and EMAIL_PASS are correct

### ❌ CORS errors from frontend
**Solution**:
- Update `FRONTEND_URL` in `.env`
- Restart deployment
- Clear browser cache (Cmd+Shift+Delete)

### ❌ Cron jobs not running
**Note**: Cron jobs require a persistent process
- Railway keeps your server running ✅
- Jobs will run on schedule (00:10 and 00:15 UTC)
- Check logs to verify they're executing

---

## 🚀 Final Checklist Before Deploying

- [ ] Created Railway account
- [ ] Connected GitHub repository
- [ ] Set all environment variables in Railway
- [ ] Neon database is accessible
- [ ] Email credentials are valid
- [ ] Cloudinary credentials are valid
- [ ] Frontend URL is set in FRONTEND_URL variable
- [ ] JWT_SECRET is strong and unique
- [ ] Ran `git push` to main branch
- [ ] Railway automatically deployed
- [ ] Tested API endpoint and got response

---

## 🎉 Success!

Your ESI Flow backend is now live on Railway! 

**Backend URL**: `https://esi-flow-back-production.up.railway.app`

Connect your frontend to this URL and you're all set! 🚀
