import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCCnwKDYc3B01Z84AfYUvb_kzGb794f-Ig",
  authDomain: "bookmydesk-pushnotificat-cde67.firebaseapp.com",
  projectId: "bookmydesk-pushnotificat-cde67",
  storageBucket: "bookmydesk-pushnotificat-cde67.firebasestorage.app",
  messagingSenderId: "1038912734970",
  appId: "1:1038912734970:web:9b077477de57258a71eb43",
  measurementId: "G-0HB1CS6Q6Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);


export { app, analytics, messaging };