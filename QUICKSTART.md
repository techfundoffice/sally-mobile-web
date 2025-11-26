# 🚀 Quick Start Guide - Sally Mobile

## Step 1: Install Expo Go on Your Phone

Download the Expo Go app from your device's app store:

- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 2: Scan the QR Code

The development server is already running! Look for the QR code in your terminal.

### For Android:
1. Open the **Expo Go** app
2. Tap **"Scan QR Code"**
3. Point your camera at the QR code in the terminal
4. The app will load automatically

### For iOS:
1. Open the **Camera** app (or Expo Go app)
2. Point your camera at the QR code in the terminal
3. Tap the notification that appears
4. The app will open in Expo Go

**Alternative**: You can also manually enter this URL in Expo Go:
```
exp://25q9pcu-anonymous-8081.exp.direct
```

## Step 3: Set Up Your API Key

Once the app loads on your device:

1. Navigate to the **Profile** tab (bottom right)
2. Scroll to the "OpenAI API Key" section
3. Tap **Edit**
4. Enter your OpenAI API key (starts with `sk-...`)
5. Tap **Save**

**Don't have an API key?** Get one at [platform.openai.com](https://platform.openai.com)

## Step 4: Create Your First Video

1. Go to the **Create** tab (bottom navigation)
2. Enter a prompt like: *"A sweeping drone shot over neon-drenched Tokyo at night"*
3. Select your preferred settings:
   - **Model**: Sally 2 (fast) or Sally 2 Pro (high quality)
   - **Duration**: 4-20 seconds
   - **Aspect Ratio**: Portrait or Landscape
4. Optionally upload a reference image
5. Tap **Generate Video**

## Step 5: Monitor Progress

1. Switch to the **Library** tab
2. Your video will appear with a status indicator
3. The app automatically polls for updates every 3 seconds
4. When complete, tap the video to watch it!

## Step 6: Explore the Social Feed

1. Go to the **Home** tab
2. Swipe up/down to browse AI-generated videos
3. Like, comment, and share videos
4. Pull down to refresh

---

## Features Overview

### 🎬 Home Tab
- TikTok-style vertical video feed
- Swipe to browse videos
- Like, comment, and share
- Pull-to-refresh

### ➕ Create Tab
- Text-to-video generation
- Image-to-video with reference upload
- Model selection (Sally 2 / Sally 2 Pro)
- Duration control (4-20 seconds)
- Resolution options

### 📚 Library Tab
- All your generated videos
- Real-time status updates
- Video preview player
- Remix videos
- Delete videos

### 👤 Profile Tab
- API key management
- Video statistics
- Account information

---

## Troubleshooting

### Can't scan the QR code?
- Make sure your phone and computer are on the same network
- Try manually entering the URL in Expo Go
- Restart the development server

### App won't load?
- Check your internet connection
- Make sure Expo Go is up to date
- Try clearing the Expo Go cache

### Videos not generating?
- Verify your API key is correct
- Check that you have Sally API access
- Ensure you have available API credits

---

## Development Server Commands

The server is currently running. You can use these commands:

- **`r`** - Reload the app
- **`m`** - Toggle developer menu
- **`j`** - Open debugger
- **`Ctrl+C`** - Stop the server

---

## Next Steps

- Experiment with different prompts
- Try uploading reference images
- Create remixes of your favorite videos
- Explore the social feed

**Enjoy creating AI-generated videos! 🎥✨**
