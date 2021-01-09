import { firebase } from '@firebase/app';
import firestore from 'firebase/firestore';

var firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx"
  };

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;