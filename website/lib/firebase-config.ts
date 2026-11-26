// Firebase web app config (safe to be public). Paste from Firebase console:
// Project settings → General → Your apps → Web app → SDK setup and configuration → Config.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
export const firebaseReady = () => Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
