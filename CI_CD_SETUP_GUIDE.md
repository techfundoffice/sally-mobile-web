# 🚀 Sally Mobile - CI/CD Setup Guide

Complete guide to set up continuous integration and deployment for Sally Mobile.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Workflow Descriptions](#workflow-descriptions)
6. [Deployment Process](#deployment-process)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Sally Mobile uses a comprehensive CI/CD pipeline with:

- **Continuous Integration**: Automated testing and linting on every push
- **Preview Deployments**: Automatic preview builds for pull requests
- **Production Deployments**: Automated releases to web, Expo, and app stores
- **OTA Updates**: Over-the-air updates via Expo EAS Update

### **Workflows Included:**

1. **ci.yml** - Lint, test, and build checks
2. **deploy.yml** - Production deployments
3. **preview.yml** - PR preview deployments
4. **release.yml** - App store releases

---

## ✅ Prerequisites

### **Required Accounts:**

1. **GitHub Account** (you already have this)
2. **Expo Account** - Sign up at https://expo.dev
3. **Google Play Console** (for Android) - $25 one-time fee
4. **Apple Developer Program** (for iOS) - $99/year
5. **Netlify Account** (optional, for PR previews) - Free tier available

### **Required Tools:**

- Node.js 20+
- pnpm 8+
- Expo CLI
- EAS CLI

---

## 🔧 Initial Setup

### **Step 1: Create Expo Account**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Link project to Expo
cd /path/to/sally-mobile
eas init
```

### **Step 2: Configure EAS Build**

```bash
# Configure Android build
eas build:configure --platform android

# Configure iOS build (requires Apple Developer account)
eas build:configure --platform ios
```

### **Step 3: Generate Expo Access Token**

1. Go to https://expo.dev/accounts/[your-username]/settings/access-tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token (you'll need this for GitHub Secrets)

---

## 🔐 GitHub Secrets Configuration

Add these secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### **Required Secrets:**

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `EXPO_TOKEN` | Expo access token | From expo.dev settings |
| `GITHUB_TOKEN` | GitHub token | Automatically provided by GitHub |

### **Optional Secrets (for advanced features):**

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token | PR previews |
| `NETLIFY_SITE_ID` | Netlify site ID | PR previews |
| `GOOGLE_SERVICES_JSON` | Android Firebase config | Push notifications |
| `GOOGLE_PLAY_SERVICE_ACCOUNT` | Play Store API key | Auto-submission |

---

## 📝 Workflow Descriptions

### **1. CI Workflow (`ci.yml`)**

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Actions:**
- ✅ Lint code with ESLint
- ✅ Type check with TypeScript
- ✅ Run tests with Jest
- ✅ Build web preview
- ✅ Upload build artifacts

**Status:** Runs on every push/PR

---

### **2. Deploy Workflow (`deploy.yml`)**

**Triggers:**
- Push to `main` branch
- Git tags starting with `v*`
- Manual trigger via workflow_dispatch

**Actions:**
- 🌐 Deploy web app to GitHub Pages
- 📱 Publish Expo OTA update
- 🤖 Build Android APK/AAB (on tags)
- 🍎 Build iOS IPA (on tags)
- 📦 Create GitHub release

**Status:** Deploys to production

---

### **3. Preview Workflow (`preview.yml`)**

**Triggers:**
- Pull request opened/updated

**Actions:**
- 🌐 Deploy web preview to Netlify
- 📱 Publish Expo preview update
- 💬 Comment on PR with preview links
- 📱 Generate QR code for Expo Go

**Status:** Creates preview for testing

---

### **4. Release Workflow (`release.yml`)**

**Triggers:**
- Manual trigger with version input

**Actions:**
- 🏷️ Create git tag
- 🤖 Build Android for Play Store
- 🍎 Build iOS for App Store
- 📦 Create GitHub release with changelog
- 📝 Generate release notes

**Status:** Full app store release

---

## 🚀 Deployment Process

### **A. Web Deployment (Automatic)**

**On every push to `main`:**

1. Code is pushed to GitHub
2. CI workflow runs tests
3. Deploy workflow builds web app
4. Deploys to GitHub Pages
5. Live at: https://techfundoffice.github.io/sally-mobile-web/

**No manual steps required!**

---

### **B. Expo OTA Update (Automatic)**

**On every push to `main`:**

1. Code is pushed to GitHub
2. Deploy workflow publishes update
3. Users get update automatically
4. No app store review needed

**Update time:** ~5 minutes

---

### **C. App Store Release (Manual)**

**When ready to release:**

1. Go to GitHub Actions
2. Click "Release - Automated App Store Deployment"
3. Click "Run workflow"
4. Enter version number (e.g., 1.0.0)
5. Select platform (Android/iOS/Both)
6. Click "Run workflow"

**What happens:**
- Creates git tag
- Builds production apps
- Submits to app stores
- Creates GitHub release

**Review time:**
- Android: 1-3 days
- iOS: 1-7 days

---

### **D. Preview Deployment (Automatic on PRs)**

**When you create a pull request:**

1. Create PR on GitHub
2. Preview workflow runs automatically
3. Bot comments with preview links
4. Test changes before merging

**Preview includes:**
- Web preview URL (Netlify)
- Expo preview QR code
- Build status

---

## 🔄 Typical Development Workflow

### **1. Feature Development**

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... code ...

# Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create PR on GitHub
# → Preview deployment runs automatically
```

### **2. Code Review & Merge**

```bash
# After review, merge PR
# → CI runs on main branch
# → Web deployment happens automatically
# → Expo OTA update published
```

### **3. Release to App Stores**

```bash
# When ready for app store release:
# 1. Go to GitHub Actions
# 2. Run "Release" workflow
# 3. Enter version: 1.0.0
# 4. Select platform
# 5. Wait for builds to complete
# 6. Apps submitted to stores automatically
```

---

## 🛠️ Manual Commands

### **Local Testing:**

```bash
# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check

# Build web locally
pnpm build:web
```

### **Manual Deployments:**

```bash
# Deploy web manually
pnpm deploy:web

# Publish Expo update
pnpm update:production

# Build Android
pnpm build:android

# Build iOS
pnpm build:ios
```

---

## 🐛 Troubleshooting

### **Problem: CI workflow fails on lint**

**Solution:**
```bash
# Fix linting issues locally
pnpm lint:fix

# Commit fixes
git add .
git commit -m "Fix linting issues"
git push
```

### **Problem: Expo build fails**

**Solution:**
1. Check EAS dashboard for error details
2. Verify `eas.json` configuration
3. Ensure `EXPO_TOKEN` secret is set
4. Check build logs in GitHub Actions

### **Problem: Web deployment fails**

**Solution:**
1. Verify GitHub Pages is enabled
2. Check repository settings
3. Ensure `dist` folder is being created
4. Review workflow logs

### **Problem: OTA update not received**

**Solution:**
1. Check update channel matches build
2. Verify app is connected to internet
3. Force reload in Expo Go
4. Check EAS dashboard for update status

---

## 📊 Monitoring & Analytics

### **Build Status:**
- GitHub Actions tab shows all workflow runs
- Green checkmark = success
- Red X = failure

### **Expo Builds:**
- EAS Dashboard: https://expo.dev/accounts/[username]/projects/sally-mobile
- View build status, logs, and artifacts

### **Web Deployment:**
- GitHub Pages: Repository Settings → Pages
- View deployment history

---

## 🔒 Security Best Practices

1. **Never commit secrets** to repository
2. **Use GitHub Secrets** for sensitive data
3. **Rotate tokens** regularly
4. **Review PR previews** before merging
5. **Enable branch protection** on main branch

---

## 📈 Next Steps

### **Recommended Improvements:**

1. **Add automated testing**
   - Unit tests with Jest
   - E2E tests with Detox
   - Visual regression tests

2. **Set up monitoring**
   - Sentry for error tracking
   - Analytics with Firebase
   - Performance monitoring

3. **Implement feature flags**
   - Gradual rollouts
   - A/B testing
   - Remote configuration

4. **Add code quality checks**
   - SonarQube integration
   - Code coverage requirements
   - Dependency scanning

---

## 📚 Resources

- **Expo EAS Build**: https://docs.expo.dev/build/introduction/
- **Expo EAS Update**: https://docs.expo.dev/eas-update/introduction/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Netlify Deploys**: https://docs.netlify.com/

---

## ✅ Quick Reference

### **Common Commands:**

```bash
# Start development
pnpm start

# Run tests
pnpm test

# Build web
pnpm build:web

# Deploy to production
git push origin main  # Automatic deployment

# Create release
# Use GitHub Actions UI → Release workflow
```

### **Important URLs:**

- **Web App**: https://techfundoffice.github.io/sally-mobile-web/
- **EAS Dashboard**: https://expo.dev
- **GitHub Actions**: https://github.com/techfundoffice/sally-mobile-web/actions
- **Repository**: https://github.com/techfundoffice/sally-mobile-web

---

**🎉 Your CI/CD pipeline is ready!**

Push code to `main` and watch the magic happen! ✨
