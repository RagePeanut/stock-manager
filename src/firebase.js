// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = require('./firebase-config.json').result.sdkConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
export const auth = getAuth(app);

export default app;