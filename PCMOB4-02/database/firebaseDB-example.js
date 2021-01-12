import { firebase } from "@firebase/app";
import firestore from "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
