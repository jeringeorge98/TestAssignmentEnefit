# EV Charging App

A React Native mobile application for managing EV charging stations and sessions.

## 🚀 Setup and Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd TestAssignment

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Devices
- **Android**: Press 'a' in terminal or scan QR code with Expo Go app
- **iOS**: Press 'i' in terminal or scan QR code with Camera app
- **Web**: Press 'w' in terminal

### Building for Production
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

## ️ Technologies Used

### Frontend
- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Query (TanStack Query)** - Data fetching and state management

### Navigation
- **Expo Router** - File-based routing system

### Styling & UI
- **React Native StyleSheet** - Component styling
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Reanimated** - Animations
- **Lottie** - Pre-built animations

### Backend & Data
- **JSON Server** - Mock API server
- **Axios** - HTTP client

### Development Tools
- **Metro** - JavaScript bundler
- **ESLint** - Code linting
- **Prettier** - Code formatting

##  How to Run Tests

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=Button
```

### Test Structure
