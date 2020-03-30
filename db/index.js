import firebase from '@firebase/app';
import '@firebase/database';
import 'firebase/firestore';
import config from '../config.json';

const fbConfig = config.firebase;

const initFirebase = () => {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(fbConfig);
      firebase.firestore().settings({ timestampsInSnapshots: true });
      firebase.firestore();
    }
  } catch (err) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack);
    }
  }
  return firebase;
}

export { 
  initFirebase,
  fbConfig,
}