# Production Build Guide - Sally Mobile

## Build Status: Ready for Production

All configuration files are in place. Follow these steps to generate production builds.

---

## Quick Start (5 Minutes to First Build)

### Step 1: Install EAS CLI (1 minute)

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo (1 minute)

```bash
eas login
```

Enter your Expo credentials (create account at expo.dev if needed).

### Step 3: Initialize Project (1 minute)

```bash
cd sally-mobile
eas build:configure
```

This links the project to your Expo account and generates a project ID.

### Step 4: Build Production APK (2 minutes to start)

```bash
eas build --platform android --profile production-apk
```

The build will run on Expo's servers. You'll get a link to monitor progress.

### Step 5: Download and Test

Once complete (~10-15 minutes), download the APK from the Expo dashboard and install on your Android device.

---

## Build Profiles Available

### 1. Preview (Testing)

**Command:**
```bash
eas build --platform android --profile preview
```

**Output:** APK file  
**Purpose:** Quick testing on physical devices  
**Build Time:** ~5-10 minutes  
**Use Case:** Internal testing, beta distribution

### 2. Production AAB (Google Play Store)

**Command:**
```bash
eas build --platform android --profile production
```

**Output:** AAB (Android App Bundle)  
**Purpose:** Google Play Store submission  
**Build Time:** ~10-15 minutes  
**Use Case:** Official app store release

### 3. Production APK (Direct Distribution)

**Command:**
```bash
eas build --platform android --profile production-apk
```

**Output:** APK file (production-ready)  
**Purpose:** Direct distribution, testing production build  
**Build Time:** ~10-15 minutes  
**Use Case:** Enterprise distribution, final QA testing

---

## What Happens During Build

### 1. Code Preparation
- TypeScript compiled to JavaScript
- Dependencies bundled
- Assets optimized and compressed
- Source maps generated

### 2. Native Compilation
- React Native code compiled to native Android
- Gradle build executed
- Native modules linked
- APK/AAB packaged

### 3. Code Signing
- EAS automatically generates keystore (first build)
- App signed with production certificate
- Credentials securely stored
- Ready for distribution

### 4. Optimization
- Code minification
- Dead code elimination
- Asset compression
- ProGuard/R8 optimization (Android)

---

## Build Configuration Details

### Android Build Settings

**Package Name:** `com.sally.mobile`  
**Version Code:** 1  
**Version Name:** 1.0.0  
**Min SDK:** 21 (Android 5.0)  
**Target SDK:** 34 (Android 14)  
**Permissions:**
- CAMERA (for reference image capture)
- READ_EXTERNAL_STORAGE (for image selection)
- WRITE_EXTERNAL_STORAGE (for video downloads)
- READ_MEDIA_IMAGES (Android 13+)
- READ_MEDIA_VIDEO (Android 13+)
- INTERNET (for API calls)

### App Metadata

**Name:** Sally Mobile  
**Icon:** 1024x1024 PNG with purple-blue spiral  
**Splash Screen:** Dark background with glowing spiral  
**Theme:** Dark mode  
**Orientation:** Portrait  

---

## Signing Credentials

### Automatic Management (Recommended)

EAS automatically handles:
- Keystore generation
- Key alias creation
- Password management
- Secure credential storage

**First build:**
- EAS creates new keystore
- Credentials stored in Expo account
- Used for all future builds

**Subsequent builds:**
- Same credentials automatically applied
- Consistent signing across versions
- No manual intervention needed

### Manual Management (Advanced)

If you have existing credentials:

```bash
eas credentials
```

Then select:
1. Android credentials
2. Production profile
3. Upload existing keystore

---

## Build Outputs

### APK File Structure

```
sally-mobile-v1.0.0-build001.apk
├── AndroidManifest.xml
├── classes.dex (compiled code)
├── resources.arsc (resources)
├── assets/
│   ├── fonts/
│   ├── images/
│   └── bundle.js
└── lib/ (native libraries)
```

**Size:** ~25-30 MB (APK)

### AAB File Structure

```
sally-mobile-v1.0.0-build001.aab
├── base/
│   ├── manifest/
│   ├── dex/
│   ├── res/
│   └── assets/
└── BundleConfig.pb
```

**Size:** ~15-20 MB (AAB)  
**Note:** Google Play generates optimized APKs from AAB for each device configuration

---

## Build Monitoring

### Real-Time Status

```bash
eas build:list
```

Shows:
- Build ID
- Platform
- Profile
- Status (in-progress, success, failed)
- Created time

### Detailed Logs

```bash
eas build:view [BUILD_ID]
```

Shows:
- Complete build logs
- Error messages (if failed)
- Build artifacts
- Download links

### Expo Dashboard

Visit: https://expo.dev/accounts/[your-username]/projects/sally-mobile/builds

Features:
- Visual build status
- Download buttons
- Build history
- Credential management
- Analytics

---

## Testing Production Build

### Install APK on Android Device

**Method 1: Direct Transfer**
1. Download APK to computer
2. Transfer to Android device via USB
3. Enable "Install from Unknown Sources" in Settings
4. Tap APK file to install

**Method 2: QR Code**
1. EAS generates QR code after build
2. Scan with Android device
3. Download and install directly

**Method 3: Internal Distribution**
1. Upload to Expo's internal distribution
2. Share link with testers
3. Install via Expo app

### Testing Checklist

- [ ] App installs successfully
- [ ] Splash screen displays correctly
- [ ] App icon appears in launcher
- [ ] Login flow works
- [ ] Google OAuth authentication
- [ ] Video generation features
- [ ] Image upload
- [ ] Video library
- [ ] Social feed
- [ ] Download videos
- [ ] Delete videos
- [ ] Sign out
- [ ] No debug/dev code visible
- [ ] Performance is smooth
- [ ] No crashes or errors

---

## Common Build Issues

### Issue: Build Failed - Dependencies

**Error:** `Unable to resolve module...`

**Solution:**
```bash
pnpm install
eas build --platform android --clear-cache
```

### Issue: Build Failed - Assets

**Error:** `Asset not found...`

**Solution:**
- Verify all assets exist in `assets/` folder
- Check file paths in app.json
- Ensure correct file extensions

### Issue: Build Failed - Memory

**Error:** `Out of memory...`

**Solution:**
- Use AAB instead of APK (smaller)
- Optimize images
- Remove unused dependencies

### Issue: Signing Error

**Error:** `Keystore not found...`

**Solution:**
```bash
eas credentials
# Select "Remove credentials"
# Run build again to generate new keystore
```

---

## Build Optimization Tips

### 1. Reduce Bundle Size

- Remove unused dependencies
- Optimize images (compress, resize)
- Use AAB format
- Enable ProGuard/R8

### 2. Faster Build Times

- Use `--no-wait` flag
- Build during off-peak hours
- Use preview profile for testing
- Cache dependencies

### 3. Better Performance

- Enable Hermes JavaScript engine
- Use production mode
- Minimize JavaScript bundle
- Optimize native modules

---

## Next Steps After Build

### For Testing (APK)

1. Download APK from Expo dashboard
2. Install on physical Android device
3. Complete testing checklist
4. Gather feedback
5. Fix any issues
6. Rebuild if needed

### For Production (AAB)

1. Download AAB from Expo dashboard
2. Test production APK first
3. Prepare Google Play Store listing
4. Upload AAB to Play Console
5. Complete store listing
6. Submit for review

---

## Build Commands Reference

```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# Download build
eas build:download [BUILD_ID]

# Cancel running build
eas build:cancel [BUILD_ID]

# Build with custom message
eas build --platform android --message "Release v1.0.0"

# Build without waiting
eas build --platform android --no-wait

# Build with specific runtime
eas build --platform android --runtime-version 1.0.0

# Clear build cache
eas build --platform android --clear-cache

# Build both platforms
eas build --platform all --profile production
```

---

## Cost and Limits

### Free Tier
- 30 builds per month
- Shared build servers
- Standard build times
- Community support

### Production Tier ($29/month)
- Unlimited builds
- Priority build queue
- Faster build times
- Premium support

### Enterprise Tier (Custom)
- Dedicated build servers
- Custom build configurations
- SLA guarantees
- White-glove support

---

## Support Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Troubleshooting:** https://docs.expo.dev/build-reference/troubleshooting/
- **Expo Forums:** https://forums.expo.dev/
- **Discord:** https://chat.expo.dev/
- **GitHub Issues:** https://github.com/expo/expo/issues

---

## Summary

✅ **All build configuration files are ready**  
✅ **EAS profiles configured (preview, production, production-apk)**  
✅ **App metadata complete**  
✅ **Assets optimized**  
✅ **Permissions configured**  

**You're ready to build!** Run `eas build --platform android --profile production-apk` to create your first production build.

**Estimated time from now to published app:** 1-2 hours (including build time and testing)

---

**Questions?** Check the BUILD_INSTRUCTIONS.md file for detailed step-by-step guidance.
