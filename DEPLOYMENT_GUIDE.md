# Deployment Guide - Sally Mobile to Google Play Store

## 🚀 Quick Start (30 Minutes to Submission)

### Prerequisites Checklist
- [ ] Google Play Console account ($25 one-time fee)
- [ ] Expo account (free at expo.dev)
- [ ] Privacy policy and terms hosted online
- [ ] Support email set up

### Step-by-Step Deployment

#### Phase 1: Build Production App (10 minutes)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Navigate to project
cd sally-mobile

# Configure EAS (first time only)
eas build:configure

# Build production AAB for Play Store
eas build --platform android --profile production

# Build production APK for testing
eas build --platform android --profile production-apk
```

Wait 10-15 minutes for builds to complete. Download from Expo dashboard.

#### Phase 2: Test Production Build (10 minutes)

1. Download production APK from Expo
2. Transfer to Android device
3. Install and test all features
4. Verify no crashes or bugs
5. Confirm performance is acceptable

#### Phase 3: Submit to Google Play (10 minutes)

1. Log in to Google Play Console
2. Create new app
3. Upload all assets (icon, screenshots, feature graphic)
4. Fill in store listing (use PLAY_STORE_LISTING.md)
5. Complete content rating questionnaire
6. Fill in data safety form
7. Upload production AAB
8. Submit for review

## 📦 What's Included

### App Assets
- ✅ App icon (1024x1024)
- ✅ Splash screen
- ✅ Adaptive icon
- ✅ Feature graphic (1024x500)
- ✅ 5 screenshots (all screens)

### Documentation
- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ Play Store listing content
- ✅ Build instructions
- ✅ Submission checklist
- ✅ QA report

### Build Configuration
- ✅ EAS Build configured
- ✅ App.json production-ready
- ✅ Environment variables set
- ✅ Permissions configured

## 🎯 Post-Submission

### Review Timeline
- Initial review: 1-3 days
- Approval/rejection notification via email
- Average approval time: 2 days

### After Approval
1. Verify app is live in Play Store
2. Test download and installation
3. Monitor crash reports
4. Respond to user reviews
5. Track analytics

### Launch Checklist
- [ ] Announce on social media
- [ ] Post on Product Hunt
- [ ] Update website
- [ ] Send to beta testers
- [ ] Monitor reviews

## 📊 Success Metrics

**Week 1 Goals:**
- 100+ downloads
- 4+ star rating
- <1% crash rate
- 50%+ retention

**Month 1 Goals:**
- 1,000+ downloads
- 4.5+ star rating
- Featured in category
- Active user community

## 🆘 Support

**Issues during deployment?**
- Check BUILD_INSTRUCTIONS.md
- Review SUBMISSION_CHECKLIST.md
- Contact: support@sallymobile.app

---

**You're ready to deploy!** 🎉

Estimated time to live app: 3-7 days from now.
