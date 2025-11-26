# Google Play Store Submission Checklist

## Pre-Submission Requirements

### Account Setup
- [ ] Create Google Play Console account ($25 one-time fee)
- [ ] Verify email address
- [ ] Complete account verification
- [ ] Set up payment profile (for future paid apps/IAP)
- [ ] Accept Developer Distribution Agreement

### Developer Identity
- [ ] Provide developer name: "Sally Mobile Team"
- [ ] Upload developer icon/logo
- [ ] Provide contact email: support@sallymobile.app
- [ ] Provide website: https://sallymobile.app
- [ ] Provide physical address (required)
- [ ] Provide phone number (optional but recommended)

---

## App Build Requirements

### Production Build
- [ ] Generate production AAB using EAS Build
- [ ] Test production APK on physical Android devices
- [ ] Verify app signing certificate
- [ ] Confirm version code: 1
- [ ] Confirm version name: 1.0.0
- [ ] Verify package name: com.sally.mobile
- [ ] Test on multiple Android versions (10-14)
- [ ] Verify no debug/dev code present
- [ ] Test all features in production mode
- [ ] Verify API integration works
- [ ] Test offline behavior
- [ ] Check app size (<100MB recommended)

### Technical Requirements
- [ ] Min SDK: 21 (Android 5.0)
- [ ] Target SDK: 34 (Android 14)
- [ ] 64-bit support: Yes (handled by Expo)
- [ ] App Bundle format: AAB
- [ ] Code obfuscation: Enabled (ProGuard/R8)
- [ ] Permissions properly declared in manifest
- [ ] No security vulnerabilities
- [ ] Passes Google Play security scan

---

## Store Listing Assets

### Required Graphics
- [x] App icon (512x512 PNG) - Generated
- [x] Feature graphic (1024x500 PNG) - Generated
- [x] Screenshots (minimum 2, maximum 8)
  - [x] Screenshot 1: Login screen
  - [x] Screenshot 2: Home feed
  - [x] Screenshot 3: Create video
  - [x] Screenshot 4: Video library
  - [x] Screenshot 5: Profile
- [ ] Promo video (optional but highly recommended)
  - YouTube URL
  - 30 seconds to 2 minutes
  - Showcases key features

### Screenshot Requirements
- [x] Format: PNG or JPEG
- [x] Minimum dimension: 320px
- [x] Maximum dimension: 3840px
- [x] Aspect ratio: 16:9 or 9:16
- [x] At least 2 screenshots required
- [x] Show actual app content (no mockups)

### Graphic Requirements
- [x] App icon: 512x512, 32-bit PNG
- [x] Feature graphic: 1024x500, PNG or JPEG
- [x] No transparency in feature graphic
- [x] High-quality, professional design

---

## Store Listing Content

### Basic Information
- [x] App name: "Sally Mobile - AI Video Creator"
- [x] Short description (80 chars): "Create stunning AI-generated videos with OpenAI's Sally technology on mobile"
- [x] Full description (4000 chars): Complete (see PLAY_STORE_LISTING.md)
- [x] App category: Video Players & Editors
- [x] Tags/keywords: Defined
- [x] Contact email: support@sallymobile.app
- [x] Website: https://sallymobile.app
- [ ] Privacy policy URL: https://sallymobile.app/privacy (must be live)
- [ ] Terms of service URL: https://sallymobile.app/terms (must be live)

### What's New
- [x] Release notes for v1.0.0 written
- [x] Highlights key features
- [x] Professional and engaging tone
- [x] Under 500 characters

---

## Content Rating

### Content Rating Questionnaire
- [ ] Complete IARC questionnaire in Play Console
- [ ] Answer questions about:
  - Violence
  - Sexual content
  - Language
  - Controlled substances
  - User interaction features
  - Sharing of user information
  - Sharing of physical location
  - Gambling
  - Unrestricted internet access

### Expected Rating
- Target: Everyone or Teen
- Justification: AI video generation tool, no inappropriate content
- User-generated content: Yes (AI-generated videos)
- Moderation: User responsibility

---

## Privacy & Data Safety

### Data Safety Section
- [ ] Complete Data Safety form in Play Console
- [ ] Declare data collection practices:
  - Personal information collected: Email, name, profile picture
  - Data usage: Account creation, service provision
  - Data sharing: With OpenAI for video generation
  - Security practices: Encryption, secure storage
  - Data deletion: User can delete account and data

### Privacy Policy Requirements
- [x] Privacy policy written (see PRIVACY_POLICY.md)
- [ ] Privacy policy hosted at public URL
- [ ] Privacy policy covers:
  - What data is collected
  - How data is used
  - How data is shared
  - User rights (access, deletion, etc.)
  - Contact information
  - GDPR/CCPA compliance (if applicable)

### Permissions Justification
- [ ] Document why each permission is needed:
  - CAMERA: "Capture reference images for AI video generation"
  - READ_EXTERNAL_STORAGE: "Select photos as reference images"
  - WRITE_EXTERNAL_STORAGE: "Download generated videos to device"
  - READ_MEDIA_IMAGES: "Access photos on Android 13+"
  - READ_MEDIA_VIDEO: "Access videos on Android 13+"
  - INTERNET: "Connect to OpenAI API for video generation"

---

## App Content

### Ads Declaration
- [x] Contains ads: No
- [x] Ad policy compliance: N/A

### In-App Purchases
- [x] Contains IAP: No
- [x] Future plans: None currently

### Target Audience
- [x] Primary: Adults (18+)
- [x] Secondary: Teens (13-17)
- [x] Not for children under 13

### App Access
- [x] Free to download: Yes
- [x] Requires account: Yes
- [x] Requires external credentials: Yes (OpenAI API key)
- [x] Restricted availability: No

---

## Testing & Quality

### Pre-Launch Testing
- [ ] Test on physical devices:
  - [ ] Android 10
  - [ ] Android 11
  - [ ] Android 12
  - [ ] Android 13
  - [ ] Android 14
- [ ] Test on different screen sizes:
  - [ ] Small phone (5-6 inches)
  - [ ] Large phone (6-7 inches)
  - [ ] Tablet (optional)
- [ ] Test all features:
  - [ ] Sign up / Sign in
  - [ ] Google OAuth
  - [ ] Email authentication
  - [ ] Phone authentication
  - [ ] Text-to-video generation
  - [ ] Image-to-video generation
  - [ ] Video library
  - [ ] Video download
  - [ ] Video delete
  - [ ] Video remix
  - [ ] Social feed
  - [ ] Like/comment/share
  - [ ] Profile management
  - [ ] Sign out
- [ ] Performance testing:
  - [ ] App starts in <3 seconds
  - [ ] No crashes
  - [ ] No memory leaks
  - [ ] Smooth animations (60fps)
  - [ ] Battery usage is reasonable
- [ ] Security testing:
  - [ ] API key stored securely
  - [ ] HTTPS for all network requests
  - [ ] No sensitive data in logs
  - [ ] Proper authentication flow

### Google Play Pre-Launch Report
- [ ] Upload AAB to internal testing track
- [ ] Review pre-launch report
- [ ] Fix any issues found
- [ ] Re-upload if necessary

---

## Legal & Compliance

### Terms of Service
- [x] Terms of Service written (see TERMS_OF_SERVICE.md)
- [ ] Terms of Service hosted at public URL
- [ ] Terms cover:
  - Acceptable use policy
  - User responsibilities
  - Intellectual property rights
  - Liability limitations
  - Dispute resolution

### Compliance Requirements
- [ ] GDPR compliance (if targeting EU users)
- [ ] CCPA compliance (if targeting California users)
- [ ] COPPA compliance (children's privacy)
- [ ] Export compliance (if applicable)
- [ ] Accessibility standards (WCAG recommended)

### OpenAI Requirements
- [ ] Comply with OpenAI Terms of Service
- [ ] Comply with OpenAI Usage Policies
- [ ] Properly attribute OpenAI/Sally (if required)
- [ ] Implement content moderation (user responsibility)

---

## Pricing & Distribution

### Pricing
- [x] Free to download: Yes
- [x] In-app purchases: No
- [x] Subscription: No
- [x] Ads: No

### Distribution
- [x] Countries: All available countries (or select specific)
- [x] Devices: Phones and tablets
- [x] Android versions: 10+ (API 29+)
- [x] Excluded devices: None

### Release Management
- [ ] Choose release track:
  - [ ] Internal testing (recommended first)
  - [ ] Closed testing (alpha/beta)
  - [ ] Open testing (public beta)
  - [ ] Production (full release)
- [ ] Set rollout percentage (production):
  - Start with 10-20% rollout
  - Monitor for issues
  - Increase to 50%, then 100%

---

## Submission Process

### Step 1: Create App in Play Console
- [ ] Log in to Google Play Console
- [ ] Click "Create app"
- [ ] Enter app details
- [ ] Select default language: English (US)
- [ ] Choose app or game: App
- [ ] Choose free or paid: Free

### Step 2: Set Up Store Listing
- [ ] Upload app icon
- [ ] Upload feature graphic
- [ ] Upload screenshots (minimum 2)
- [ ] Enter app name
- [ ] Enter short description
- [ ] Enter full description
- [ ] Add contact details
- [ ] Add privacy policy URL
- [ ] Add terms of service URL (optional)

### Step 3: Complete Content Rating
- [ ] Start questionnaire
- [ ] Answer all questions honestly
- [ ] Submit for rating
- [ ] Receive rating certificate

### Step 4: Set Up Pricing & Distribution
- [ ] Select countries
- [ ] Confirm free/paid
- [ ] Set content guidelines
- [ ] Confirm distribution agreement

### Step 5: Complete Data Safety
- [ ] Answer data collection questions
- [ ] Describe security practices
- [ ] Explain data sharing
- [ ] Submit data safety form

### Step 6: Upload App Bundle
- [ ] Go to "Production" or "Testing" track
- [ ] Click "Create new release"
- [ ] Upload AAB file
- [ ] Enter release notes
- [ ] Review release details
- [ ] Save (don't submit yet)

### Step 7: Review Everything
- [ ] Store listing: Complete
- [ ] Content rating: Approved
- [ ] Pricing & distribution: Set
- [ ] Data safety: Complete
- [ ] App content: Declared
- [ ] App bundle: Uploaded
- [ ] Release notes: Written

### Step 8: Submit for Review
- [ ] Click "Review release"
- [ ] Check for any warnings or errors
- [ ] Fix any issues
- [ ] Click "Start rollout to Production" (or Testing)
- [ ] Confirm submission

---

## Post-Submission

### Monitoring
- [ ] Check submission status in Play Console
- [ ] Respond to any review requests from Google
- [ ] Monitor email for updates

### Review Timeline
- Initial review: 1-3 days (typically)
- Additional reviews: 1-7 days (if issues found)
- Expedited review: Not available for first submission

### After Approval
- [ ] Verify app is live in Play Store
- [ ] Test download and installation
- [ ] Monitor crash reports
- [ ] Monitor user reviews
- [ ] Respond to user feedback
- [ ] Track analytics

### Launch Activities
- [ ] Announce on social media
- [ ] Post on Product Hunt
- [ ] Share in relevant communities
- [ ] Reach out to tech press
- [ ] Update website with download link
- [ ] Send email to beta testers
- [ ] Create launch blog post

---

## Common Rejection Reasons (Avoid These)

### Policy Violations
- [ ] Ensure no misleading content
- [ ] No impersonation of other apps
- [ ] No copyrighted content without permission
- [ ] No malware or security vulnerabilities
- [ ] No deceptive behavior

### Technical Issues
- [ ] App must not crash on launch
- [ ] All features must work as described
- [ ] No broken links or missing content
- [ ] Proper error handling
- [ ] No excessive permissions

### Metadata Issues
- [ ] Screenshots must show actual app content
- [ ] Description must be accurate
- [ ] Privacy policy must be accessible
- [ ] Contact information must be valid
- [ ] No keyword stuffing

---

## Emergency Contacts

### Google Play Support
- Help Center: https://support.google.com/googleplay/android-developer
- Community Forums: https://support.google.com/googleplay/android-developer/community
- Direct Support: Available in Play Console (for policy violations)

### Internal Contacts
- Technical Issues: dev@sallymobile.app
- Legal Questions: legal@sallymobile.app
- General Support: support@sallymobile.app

---

## Final Checklist Before Submission

- [ ] All assets uploaded and verified
- [ ] All forms completed in Play Console
- [ ] Privacy policy and terms of service live
- [ ] Production build tested thoroughly
- [ ] No critical bugs or crashes
- [ ] All permissions justified
- [ ] Content rating received
- [ ] Data safety form submitted
- [ ] Release notes written
- [ ] Developer account in good standing
- [ ] Payment profile set up (if needed)
- [ ] Ready to respond to review feedback

---

## Estimated Timeline

**Day 1:** Set up Play Console account, create app listing  
**Day 2:** Upload assets, complete forms  
**Day 3:** Upload AAB, final review  
**Day 4:** Submit for review  
**Day 5-7:** Google review process  
**Day 7:** App published! 🎉

**Total Time:** ~1 week from start to publish

---

## Success Criteria

✅ App approved on first submission  
✅ No policy violations  
✅ 4+ star rating within first week  
✅ <1% crash rate  
✅ Positive user reviews  
✅ Featured in "New & Updated" section  

---

**You're ready to submit!** Follow this checklist step-by-step for a smooth submission process.

**Good luck!** 🚀
