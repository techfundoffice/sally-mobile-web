# Sally Mobile - AI Video Generation App

A fully functional React Native Expo mobile app that clones OpenAI's Sally video generation capabilities. Create stunning AI-generated videos directly from your mobile device.

![Sally Mobile](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square)

## Features

### 🎬 Core Video Generation
- **Text-to-Video**: Generate videos from detailed text prompts
- **Image-to-Video**: Upload reference images to guide video generation
- **Model Selection**: Choose between Sally 2 (fast) and Sally 2 Pro (high quality)
- **Duration Control**: Select video duration from 4 to 20 seconds
- **Resolution Options**: Portrait (9:16), Landscape (16:9) with multiple quality settings
- **Real-time Progress**: Monitor generation status with live updates

### 📚 Video Library & Management
- **Video Gallery**: Grid view of all your generated videos
- **Status Indicators**: Visual feedback for queued, processing, completed, and failed videos
- **Video Preview**: Built-in video player with playback controls
- **Download Videos**: Save videos to your device
- **Delete Videos**: Remove unwanted videos from your library
- **Remix Feature**: Create variations of existing videos with new prompts

### 🌟 Social Feed (TikTok-style)
- **Vertical Scrolling**: Swipe through AI-generated videos
- **Engagement**: Like, comment, and share videos
- **User Profiles**: View creator information
- **Infinite Scroll**: Continuous content discovery
- **Pull-to-Refresh**: Get the latest videos

### 🎨 UI/UX Design
- **Dark Theme**: Modern dark interface with purple/blue accents
- **Material Design**: Clean, intuitive components
- **Bottom Tab Navigation**: Easy access to Home, Create, Library, and Profile
- **Smooth Animations**: Polished transitions and interactions
- **Loading States**: Skeleton screens and progress indicators
- **Error Handling**: User-friendly error messages

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **API Client**: Axios
- **Storage**: Expo SecureStore (for API key)
- **Media**: Expo AV (video playback), Expo Image Picker
- **UI Components**: Custom components with Material Design principles

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **pnpm**: Package manager (or npm/yarn)
- **Expo Go App**: Install on your mobile device
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **OpenAI API Key**: With Sally Video API access
  - Get access at [platform.openai.com](https://platform.openai.com)

## Installation

1. **Navigate to the project directory**:
   ```bash
   cd /home/ubuntu/sally-mobile
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm start
   ```

4. **Scan the QR code**:
   - Open the Expo Go app on your mobile device
   - Scan the QR code displayed in your terminal
   - The app will load on your device

## Configuration

### Setting Up Your API Key

1. Launch the app on your device
2. Navigate to the **Profile** tab
3. Enter your OpenAI API key in the designated field
4. Tap **Save** to securely store the key on your device

Your API key is stored locally using Expo SecureStore and never leaves your device.

## Usage

### Creating Your First Video

1. **Navigate to the Create tab**
2. **Enter a prompt**: Describe the video you want to generate
   - Example: "A sweeping drone shot over neon-drenched Tokyo at night"
3. **Select model**: Choose Sally 2 (fast) or Sally 2 Pro (high quality)
4. **Set duration**: Pick from 4, 8, 12, 16, or 20 seconds
5. **Choose aspect ratio**: Portrait or Landscape
6. **Upload reference image** (optional): Add an image to guide the generation
7. **Tap Generate Video**

### Monitoring Progress

1. Go to the **Library** tab
2. View all your videos with real-time status updates
3. Videos automatically update as they process
4. Tap on completed videos to watch them

### Exploring the Social Feed

1. Open the **Home** tab
2. Swipe up/down to browse AI-generated videos
3. Like, comment, and share videos you enjoy
4. Pull down to refresh the feed

### Remixing Videos

1. In the **Library** tab, find a completed video
2. Tap the **Remix** button
3. Modify the prompt or settings
4. Generate a new variation

## Project Structure

```
sally-mobile/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home (Social Feed)
│   │   ├── create.tsx       # Video Generation
│   │   ├── library.tsx      # Video Library
│   │   ├── profile.tsx      # User Profile
│   │   └── _layout.tsx      # Tab layout config
│   └── _layout.tsx          # Root layout
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── VideoCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── VideoGenerationForm.tsx
│   │   └── SocialVideoCard.tsx
│   ├── constants/           # Theme and constants
│   │   └── theme.ts
│   ├── services/            # API integration
│   │   └── api.ts
│   ├── store/               # State management
│   │   ├── useVideoStore.ts
│   │   └── useSocialStore.ts
│   └── types/               # TypeScript types
│       └── index.ts
├── assets/                  # Images and fonts
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json           # TypeScript config
```

## API Integration

The app integrates with the OpenAI Sally Video API:

- **POST /videos**: Create new video
- **GET /videos/{id}**: Get video status
- **GET /videos**: List all videos
- **DELETE /videos/{id}**: Delete video
- **POST /videos/{id}/remix**: Create remix

All API calls are handled through the `apiService` in `src/services/api.ts`.

## State Management

The app uses Zustand for state management with two main stores:

1. **useVideoStore**: Manages video generation, library, and API key
2. **useSocialStore**: Manages the social feed (mock data for demo)

## Customization

### Changing the Theme

Edit `src/constants/theme.ts` to customize colors, spacing, and other design tokens:

```typescript
export const Colors = {
  primary: '#8b5cf6',  // Change primary color
  background: '#0a0a0a', // Change background
  // ... more colors
};
```

### Adding New Features

The modular architecture makes it easy to extend:

1. Add new screens in `app/(tabs)/`
2. Create components in `src/components/`
3. Add API methods in `src/services/api.ts`
4. Extend stores in `src/store/`

## Troubleshooting

### App won't load on Expo Go

- Ensure your device and computer are on the same network
- Try restarting the Expo development server
- Clear the Expo Go app cache

### API Key not working

- Verify your API key has Sally Video API access
- Check that the key is correctly entered (no extra spaces)
- Ensure you have available API credits

### Videos not generating

- Check your internet connection
- Verify your API key is valid
- Check the error message in the Library tab

## Development

### Running in Development Mode

```bash
pnpm start
```

### Building for Production

For iOS:
```bash
pnpm run ios
```

For Android:
```bash
pnpm run android
```

### Type Checking

```bash
npx tsc --noEmit
```

## Contributing

This is a demo application. Feel free to fork and customize for your needs.

## License

MIT License - feel free to use this code for your projects.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- Powered by [OpenAI Sally](https://openai.com/sally)
- Inspired by the official OpenAI Sally sample app

## Support

For issues related to:
- **Expo**: Visit [docs.expo.dev](https://docs.expo.dev)
- **OpenAI API**: Visit [platform.openai.com/docs](https://platform.openai.com/docs)

---

**Note**: This app requires an OpenAI API key with Sally Video API access. Sally is currently in limited availability.
