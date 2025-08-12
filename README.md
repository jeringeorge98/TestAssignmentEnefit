# Enefit Test Assignment

A React Native mobile application for managing EV charging stations and sessions.

## 🚀 Setup and Run Instructions

### Prerequisites
- Node.js 
- npm or yarn
- JSON Server (To install json server use this command: npm install -g json-server)
- Expo ( Was used as a delopment framework in this assignment along with React native)
- Android Studio 
 OR
- Xcode 

### Installation
```bash
# Clone the repository
git clone https://github.com/jeringeorge98/TestAssignmentEnefit.git
cd TestAssignment

# Install dependencies
npm install


# Start the mock backend with Json Server
npm run db 
# Start the development server
npm run start
```

### Running on Devices
- **Android**: Press 'a' in terminal 
- **iOS**: Press 'i' in terminal 
(This project was developed and tested on the ios Simulator so that would be the recommended one.)



## ️ Technologies Used

### Frontend
- **React Native** - Mobile app framework
- **Expo** - Development platform 
- **TypeScript** 

### Additional Libraries
- **Navigation** - Expo Router
- **Networking** - TanStack React Query, Axios
- **Third Party Api** - React Native Maps ,Lottie , etc


### Styling & UI
- **Expo Linear Gradient** - Gradient backgrounds
- **Lottie** - Pre-built animations

### Backend & Data
- **JSON Server** - Mock API server
- **Axios** - HTTP client

##  How to Run Tests

### Running Tests
```bash
# Run all tests
npm run test
```
- All tests are written in the components/__tests__/ folder 

# Room For Improvements

## Future Enhancements

### 1. Dynamic Distance Calculation

Currently, the distances from the user to each charging station are static and fixed. I plan to implement dynamic distance calculation in the following ways:

- **User Location Tracking**: When a user logs into the app, their location will be captured and sent to the server via an API call
- **Distance Calculation**: Implement PostgreSQL table functions to calculate real-time distances from the user to each station
- **Dynamic Sorting**: Enable sorting stations based on proximity (nearest to farthest) for better user experience

### 2. Navigation Integration

**Current State**: Only station addresses are displayed to users

**Proposed Enhancement**: Add a maps button next to each station address that opens Google Maps for turn-by-turn navigation, significantly improving user experience

### 3. Smart Price Notifications

Implement push notifications to alert users about optimal charging times based on energy prices:

- Monitor energy price fluctuations
- Send notifications when prices are favorable
- Help users save money by charging during low-rate periods

### 4. Payment Integration

Integrate payment solutions such as Stripe or similar services to enable seamless payment processing when starting charging sessions.

---

## Implementation Status

 **Completed**: All functional use cases specified in the assignment have been successfully implemented

---
## Thanks and Acknowledgment: 

I would like to thank Enefit for providing me the oppurtunity to display my skills this has been a wonderful experience with learning how to apply my skills and I am glad I got that oppurtunity.Thank You

