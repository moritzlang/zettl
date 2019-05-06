import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyAEky8TexWlTfJYkcUCmSMfcqdxoFeZOXA',
  authDomain: 'zettl-835a3.firebaseapp.com',
  databaseURL: 'https://zettl-835a3.firebaseio.com',
  projectId: 'zettl-835a3',
  storageBucket: 'zettl-835a3.appspot.com',
  messagingSenderId: '211177511834',
  appId: '1:211177511834:web:d2a0112906690b2f',
}

if(!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default {
  auth: () => firebase.auth(),
  authUser: () =>
    new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          // User is signed in
          resolve(user)
        } else {
          // User is signed out
          reject(new Error('User not logged in'))
        }             
      })
    }),
  signOut: () => firebase.auth().signOut(),
  uiConfig: {
    signInSuccessUrl: 'http://localhost:3000/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '/terms-of-service',
    privacyPolicyUrl: () => {
      window.location.assign('/privacy-policy')
    },
  },
}