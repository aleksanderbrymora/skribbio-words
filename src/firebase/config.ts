import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCCLb4Jw1iweQlGdcQwpdWqbg83APdECRI',
  authDomain: 'skribble-1fc31.firebaseapp.com',
  projectId: 'skribble-1fc31',
  storageBucket: 'skribble-1fc31.appspot.com',
  messagingSenderId: '802354477905',
  appId: '1:802354477905:web:1a27d35cc131e47163f170',
  measurementId: 'G-DC8GFG8NVK',
};

const app = firebase.initializeApp(firebaseConfig);

export const firestore = app.firestore();
