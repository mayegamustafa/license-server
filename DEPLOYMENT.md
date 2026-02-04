# Deploy to Render (Free)

## Quick Deploy Steps

### 1. Push to GitHub

```bash
cd /home/mustafa/license-server
git init
git add .
git commit -m "Initial commit - License server"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Render

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will auto-detect the settings from `render.yaml`

### 3. Set Environment Variables

In Render dashboard, add these environment variables:

```
PAYPAL_CLIENT_ID=AWAcHrjDROQ1x8cgliCNCqfbSA4F70GEhsXVlFozuiof-1j7vepXDZq5LS18kUL6YvDHq8sH4pq299ha
PAYPAL_CLIENT_SECRET=EJjLgi-dQDfvo8WUK7dwzoouf05faHc8ksfw7VVlkN6APm0Pof1ZWuMm6XoEPqu-XoRkTcbfZWIo7fh_
GMAIL_USER=mstfmyg256@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

### 4. Deploy!

Click **"Create Web Service"** - Render will:
- Install dependencies
- Start your server
- Give you a live URL like `https://license-server-xxxx.onrender.com`

## After Deployment

1. **Update your frontend** - Change any `localhost:8080` URLs to your Render URL
2. **Test payments** - Try a small purchase first ($0.01 if possible)
3. **Monitor logs** - Check Render dashboard for any errors

## Free Plan Limitations

- ✅ 750 hours/month free
- ✅ Enough for personal projects
- ⚠️ Server sleeps after 15 min inactivity (wakes on request)
- ⚠️ Limited to 512 MB RAM

## Troubleshooting

**Server sleeps:** First request after inactivity takes ~30 seconds to wake up
**Solution:** Upgrade to paid plan ($7/mo) or use a ping service

**PayPal works now!** Your network timeout issue won't exist on Render's servers.

---

Your license server is ready to deploy! 🚀
