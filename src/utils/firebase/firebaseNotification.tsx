import toast from 'react-hot-toast';
import { NotificationToast } from '@/components/ReusableComponents/NotificationToast';
import { messaging } from './firebase';
import { getToken,onMessage } from 'firebase/messaging';


const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

export const requestPermission = async (): Promise<string | null> => {
  try {

     if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

     if (!('serviceWorker' in navigator)) {
      console.warn('This browser does not support service workers');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker registered:', registration);

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      toast.error("Notification permission not granted.");
      return null;
    }
    // console.log("✅ VAPID Key:", vapidKey);

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration 
    });

    if (currentToken) {
      console.log("✅ FCM token:", currentToken);
      return currentToken;
    } else {
      console.warn("⚠️ No registration token available.");
      toast.error("No registration token available.");
      return null;
    }
  } catch (error:any) {
    console.error("🚨 Error getting FCM token:", error);
    console.error("🚨 Error details:", error.message);
    return null;
  }
};

export const listenForForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground FCM message received:", payload);
    const title = payload.notification?.title || "New Notification";
    const body = payload.notification?.body || "You have a new message";

    toast.custom(<NotificationToast title={title} body={body} />,{
        duration: 5000,
    });
  });
};
