import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBPgFj2G8bipS5N7nRSYNdxa8MuPrhMKaM",
  authDomain: "fa22se19-oms.firebaseapp.com",
  projectId: "fa22se19-oms",
  storageBucket: "fa22se19-oms.appspot.com",
  messagingSenderId: "77287722969",
  appId: "1:77287722969:web:fe7ebf271ba90efa8e93c8",
  measurementId: "G-CD63NGVXS2"
};

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const app = initializeApp(firebaseConfig);

      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          "BPFpKzmfLmzzar_1ZM0bwI8KaU9zf1auy_0fY3B43mhvgNGEcupw5Okz1GQgv-NtvJgOAhWLMANc71dNJw_jEKk",
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);
        } else {
          console.log("Can not get token");
        }
      });
    } else {
      console.log("Do not have permission!");
    }
  });
}

requestPermission();