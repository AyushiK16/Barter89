import firebase from 'firebase'
require('@firebase/firestore')

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAe0i34hjYlrX4w-oM_t2EbqYzjmk1hQVM",
    authDomain: "bartersystem2-c4ff2.firebaseapp.com",
    projectId: "bartersystem2-c4ff2",
    storageBucket: "bartersystem2-c4ff2.appspot.com",
    messagingSenderId: "171954348670",
    appId: "1:171954348670:web:ff1ba4260f3fafc6ec2e2f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();

