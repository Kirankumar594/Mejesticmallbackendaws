importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBn3eGlq2UU4Z5EVnCBOcKTy6UF2WdYGaw",
  authDomain: "abhinandhan-43620.firebaseapp.com",
  projectId: "abhinandhan-43620",
  storageBucket: "abhinandhan-43620.appspot.com",
  messagingSenderId: "674275225981",
  appId: "1:674275225981:web:8c57cdca0427003658dc14",
  measurementId: "G-82D0TPD4PS"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.json() : {};

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message.',
    icon: payload.notification?.icon || '/default-icon.png',
    data: payload.notification?.click_action || '/'
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});


self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});


messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  const notificationTitle = payload.notification?.title || 'Background Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new background message.',
    icon: payload.notification?.icon || '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
