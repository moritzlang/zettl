import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
// import 'firebase/messaging'

import { fromJS, List, Map, OrderedMap } from 'immutable'

const config = {
  apiKey: 'AIzaSyAEky8TexWlTfJYkcUCmSMfcqdxoFeZOXA',
  authDomain: 'zettl-835a3.firebaseapp.com',
  databaseURL: 'https://zettl-835a3.firebaseio.com',
  projectId: 'zettl-835a3',
  storageBucket: 'zettl-835a3.appspot.com',
  messagingSenderId: '211177511834',
  appId: '1:211177511834:web:d2a0112906690b2f',
}

// Initialize firebase
if(!firebase.apps.length) {
  firebase.initializeApp(config)
  // firebase.messaging()
  //   .usePublicVapidKey('BMmSJaZxoMRvgUp_Bf8zhn3Z3DBBvK6MsjvbcNh8gcVxqWX8-8MjB5YvZpBL_AfgRd7AaXsWmCJjOvlH87OCE_o')

// // Register service worker
// if ('serviceWorker' in navigator && 'PushManager' in window) {
//   // Service Worker and Push is supported
//   navigator.serviceWorker.register('sw.js')
//     .then(registration => {
//       firebase.messaging().useServiceWorker(registration)
//     })
//     .catch((err) => {
//       console.error('Service Worker Error', err)
//     })
// }
}

export default {
  auth: () => firebase.auth(),
  db: firebase.firestore(),
  // messaging: firebase.messaging(),
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
    signInSuccessUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://zettl-835a3.firebaseapp.com/',
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
  getLists() {
    const { uid } = firebase.auth().currentUser

    return firebase.firestore().collection('user_list').where('userId', '==', uid).get()
      .then(async collection => 
        collection.docs.reduce(async (lists, doc) => {
          const { listId } = doc.data()
          const list = await Promise.all([this.getListDetails(listId), this.getArticles(listId)])
            .then(([listDetails, articles]) => (
              Map({
                ...listDetails,
                articles,
              })
            ))

          if(list) {
            (await lists).push([listId, list])
          }
          return lists
        }, []))
      .then(lists => OrderedMap(lists))
  },
  getListDetails(listId) {
    return firebase.firestore().collection('lists').doc(listId).get()
      .then(l => l.data())
  },
  getArticles(listId) {
    return firebase.firestore().collection('articles').where('listId', '==', listId).orderBy('updated_at', 'asc').get()
      .then(collection =>
        collection.docs.reduce((articles, doc) => {
          articles.push(fromJS({ id: doc.id, ...doc.data() }))
          return articles
        }, []))
      .then((articles) => List(articles))
  },
  addArticle: article => (
    firebase.firestore().collection('articles').doc(article.id).set(article)
  ),
  updateArticle: (id, data) => (
    new Promise((resolve) => {
      firebase.firestore().collection('articles').doc(id).update(data)
        .then(res => resolve(res))
    })
  ),
  // addToken: (userId, token) => {
  //   return firebase.firestore().collection('users').doc(userId).set({ token })
  // },
  // deleteToken: () => (
  //   new Promise((resolve) => {
  //     firebase.firestore().collection('users').doc(firebase.auth().currentUser).update({ token: firebase.firestore.FieldValue.delete() })
  //       .then(res => resolve(res))
  //   })
  // ),
}