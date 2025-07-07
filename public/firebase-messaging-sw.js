importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCCnwKDYc3B01Z84AfYUvb_kzGb794f-Ig",
  authDomain: "bookmydesk-pushnotificat-cde67.firebaseapp.com",
  projectId: "bookmydesk-pushnotificat-cde67",
  storageBucket: "bookmydesk-pushnotificat-cde67.firebasestorage.app",
  messagingSenderId: "1038912734970",
  appId: "1:1038912734970:web:9b077477de57258a71eb43",
  measurementId: "G-0HB1CS6Q6Q"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || 'New Message';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message',
    icon: '/BookMydesk.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
