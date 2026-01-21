# 🎮 Mineswipper - React Native Minesweeper Game

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

A modern, cross-platform Minesweeper game built with React Native and Expo, featuring native performance, beautiful animations, and offline capabilities.

## ✨ Features

- **🎮 Classic Minesweeper Gameplay** - Authentic minesweeper experience with multiple difficulty levels
- **📱 Cross-Platform** - Runs on iOS, Android, and Web
- **🎨 Modern UI** - Beautiful interface with NativeWind (Tailwind CSS for React Native)
- **💾 Local Storage** - Game progress saved using SQLite and AsyncStorage
- **🎵 Immersive Experience** - Audio feedback and haptic vibrations
- **🔗 Navigation** - Smooth navigation with Expo Router
- **⚡ Performance** - Optimized with Reanimated 2 and React 19

## 🛠 Tech Stack & Dependencies

### Core Framework
![Expo](https://img.shields.io/badge/Expo_54-000020?style=flat-square&logo=expo)
![React Native](https://img.shields.io/badge/React_Native_0.81-61DAFB?style=flat-square&logo=react)
![React 19](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react)

### UI & Styling
![NativeWind](https://img.shields.io/badge/NativeWind_4-38BDF8?style=flat-square&logo=tailwindcss)
![Reanimated 2](https://img.shields.io/badge/Reanimated_2-FF6B6B?style=flat-square&logo=react)
![React Navigation 7](https://img.shields.io/badge/React_Navigation_7-6B52AE?style=flat-square)

### State Management
![Zustand](https://img.shields.io/badge/Zustand_5-000000?style=flat-square)

### Storage
![SQLite](https://img.shields.io/badge/Expo_SQLite-07405E?style=flat-square&logo=sqlite)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage_2-5A29E4?style=flat-square)

### Multimedia
![Expo Audio](https://img.shields.io/badge/Expo_Audio_1-0099FF?style=flat-square)
![Expo Haptics](https://img.shields.io/badge/Haptics_15-FF4757?style=flat-square)

### Navigation & Routing
![Expo Router](https://img.shields.io/badge/Expo_Router_6-000020?style=flat-square&logo=expo)
![React Navigation](https://img.shields.io/badge/React_Navigation-6B52AE?style=flat-square)

### Icons & Assets
![Expo Vector Icons](https://img.shields.io/badge/Expo_Icons_15-FF6B6B?style=flat-square)
![Expo Symbols](https://img.shields.io/badge/Expo_Symbols-8E44AD?style=flat-square)

### Utilities
![Expo Linear Gradient](https://img.shields.io/badge/Linear_Gradient-3498DB?style=flat-square)
![Expo Image](https://img.shields.io/badge/Expo_Image_3-27AE60?style=flat-square)
![Gesture Handler](https://img.shields.io/badge/Gesture_Handler_2-FF9F43?style=flat-square)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- Expo CLI (optional, included in dependencies)
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mineswipper

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 📱 Platform Support

| Platform | Status | Requirements |
|----------|--------|--------------|
| **iOS** | ✅ Fully Supported | iOS Simulator or physical device |
| **Android** | ✅ Fully Supported | Android Emulator or physical device |
| **Web** | ✅ Supported | Modern browser with ES6 support |

## 🏗 Project Structure

```
mineswipper/
├── app/                    # Expo Router app directory
│   ├── (tabs)/           # Tab navigation screens
│   ├── _layout.tsx       # Root layout configuration
│   └── index.tsx         # Entry point
├── assets/               # Static assets (images, fonts, icons)
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── store/               # Zustand state management
├── utils/               # Utility functions and helpers
├── scripts/             # Build and utility scripts
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── tailwind.config.js   # NativeWind configuration
```

## 🎯 Available Scripts

```bash
# Development
npm start                # Start Expo development server
npm run android          # Run on Android emulator/device
npm run ios              # Run on iOS simulator/device
npm run web              # Run in web browser

# Build
npm run build:android    # Build Android release APK

# Quality Assurance
npm run lint             # Run ESLint for code quality
npm run doctor           # Check project dependencies and health

# Project Management
npm run reset-project    # Reset project to clean state
```

## ⚙️ Configuration

### App Configuration (`app.json`)
- **Name**: Mineswipper
- **Bundle ID**: `com.rajharit77.mineswipper`
- **Orientation**: Portrait
- **Theming**: Automatic dark/light mode
- **New Architecture**: Enabled
- **Permissions**: Audio, vibration, full-screen intents

### Key Features Configuration
- **Audio Background Modes**: Enabled for iOS
- **Splash Screen**: Custom with themed background
- **SQLite Database**: Local game data storage
- **Haptic Feedback**: Enhanced user experience

## 🎨 Theming & Styling

The project uses **NativeWind** (Tailwind CSS for React Native) for styling:
- Utility-first CSS framework
- Dark mode support
- Responsive design
- Custom animations and transitions

## 🔧 Development

### Adding New Dependencies
```bash
npx expo install <package-name>
```

### TypeScript Support
Full TypeScript support with strict type checking and Expo's typed routes.

### Hot Reloading
Enjoy fast development with Expo's hot reloading and fast refresh capabilities.

## 📊 Performance Optimizations

- **Reanimated 2**: 60 FPS animations on native thread
- **React Compiler**: Enabled for performance improvements
- **Image Optimization**: Expo Image with caching
- **Memory Management**: Efficient state management with Zustand

## 🗂️ Data Persistence

- **SQLite**: Game statistics and user progress
- **AsyncStorage**: App preferences and settings
- **Asset Caching**: Efficient asset loading with Expo Asset

## 🔊 Audio & Haptics

- **Sound Effects**: Game actions feedback
- **Background Audio**: Continuous playback support
- **Haptic Feedback**: Tactile responses for game events
- **Vibration**: Android vibration API support

## 🎮 Game Features

- Multiple difficulty levels
- Timer and score tracking
- High score leaderboard
- Game statistics
- Customizable themes
- Sound and vibration settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- NativeWind for Tailwind CSS integration
- All open-source contributors

---

**Built with ❤️ using Expo & React Native**

*For issues and feature requests, please use the issue tracker.*