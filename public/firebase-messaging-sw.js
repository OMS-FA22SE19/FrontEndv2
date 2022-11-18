// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBPgFj2G8bipS5N7nRSYNdxa8MuPrhMKaM",
    authDomain: "fa22se19-oms.firebaseapp.com",
    projectId: "fa22se19-oms",
    storageBucket: "fa22se19-oms.appspot.com",
    messagingSenderId: "77287722969",
    appId: "1:77287722969:web:fe7ebf271ba90efa8e93c8",
    measurementId: "G-CD63NGVXS2"
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});