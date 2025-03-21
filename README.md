# Health Tracker

A web application that allows healthcare providers (admins) to create and manage exercise and diet plans for patients. Patients can view their assigned plans and update their progress.

## Features

- User authentication with Firebase
- Role-based access control (admin/patient)
- Administrators can:
  - Create exercise plans for patients
  - Create diet plans for patients
  - View progress updates from patients
- Patients can:
  - View their assigned exercise plans
  - View their assigned diet plans
  - Submit progress updates

## Technologies Used

- React
- TypeScript
- Firebase (Authentication & Firestore)
- TailwindCSS
- Vite

## Prerequisites

- Node.js 14+ installed
- NPM or Yarn package manager
- A Firebase account and project

## Setup

1. Clone the repository:
```
git clone <repository-url>
cd health-tracker
```

2. Install dependencies:
```
npm install
```

3. Update Firebase configuration:
   - Open `src/services/firebase.ts`
   - Replace the Firebase config object with your own Firebase project settings

4. Start the development server:
```
npm run start
```

5. Access the application at http://localhost:3000

## Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Email/Password authentication method
3. Create a Firestore database
4. Add the following collections:
   - `users`
   - `exercisePlans`
   - `dietPlans`
   - `progressUpdates`
5. Copy your Firebase configuration to the `firebaseConfig` object in `src/services/firebase.ts`

## Build for Production

```
npm run build
```

This will generate optimized production files in the `dist` directory.

## License

MIT 