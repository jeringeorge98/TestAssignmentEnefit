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
= **Third Party Api** - React Native Maps ,Lottie , etc


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

### Room For Improvements


## Improvements for the future
 
# Adding Distance Calculation with respect to the user location

Right now the distances from the user and each charging station is fixed and static . I would like to dynamically calculate this .I would do this in couple of ways 
- When the user logs into the app the user location is picked and then an api is called in the background this would save the user location in the server, we could use some PostGres table functions to calculate the distance from the user to the station and save it in the station table or have another api that could calculate the distance and return along with our station data .

This would also help us sort the stations based on nearest to farthest and help in displaying that data meaningfully . 

# Adding Navigation from their location to the address of the Station

Currenlty only the address is visible to the user ,I would like to add a maps button next to the address ,when clicked would open google maps that would help them navigate thereby improving user experience.

# Notifications to notify users about ideal charge times based on prices

In situations when we have different energy prices I would like to send out push notifications for users when the energy prices are favourable so that they can charge.

# Adding Payment Integrations
Would like to integrate stripe or other payment integrations which would help in integrating payment while starting the charging 

## Didnt have time to implement
I have managed to implement all the funcitonal use cases asked  for in the assignment

