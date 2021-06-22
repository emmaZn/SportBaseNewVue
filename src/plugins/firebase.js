import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyCTk3EG6jR9oN8MgeaSkeGIiEoPoRSp144",
  authDomain: "sportbase-38151.firebaseapp.com",
  projectId: "sportbase-38151",
  storageBucket: "sportbase-38151.appspot.com",
  messagingSenderId: "329953458846",
  appId: "1:329953458846:web:98fbb33715430d1aa4998f",
  measurementId: "G-XN6ZS185C2"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}