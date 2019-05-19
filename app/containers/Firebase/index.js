import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/messaging'

import { fromJS, List, Map, OrderedMap } from 'immutable'
import { DEBUG, URL } from 'utils/config'

const config = {
  apiKey: 'AIzaSyAEky8TexWlTfJYkcUCmSMfcqdxoFeZOXA',
  authDomain: 'zettl-835a3.firebaseapp.com',
  databaseURL: 'https://zettl-835a3.firebaseio.com',
  projectId: 'zettl-835a3',
  storageBucket: 'zettl-835a3.appspot.com',
  messagingSenderId: '211177511834',
  appId: '1:211177511834:web:d2a0112906690b2f',
  serverKey: 'AAAAMSspG5o:APA91bGu3UzX5czt1FX7-v0QP-QAqOlVnqq432iQ1kxpgv5zG_r2AuMT44VU1FOD-ReF9QzowBk4qZ5KE19DY7N736BG2NH7SEOaW0-Th4Z1neWHLEGGFLRBq3c7HWtzSGMpHTlnC2uW',
}

// Initialize firebase
if(!firebase.apps.length) {
  firebase.initializeApp(config)
  
  // Cache firestore data for offline usage
  firebase.firestore().enablePersistence()
    .catch(err => {
      console.error(err)
    })
}

export default {
  auth: () => firebase.auth(),
  db: firebase.firestore(),
  messaging: firebase.messaging.isSupported() ? firebase.messaging() : null,
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
    signInSuccessUrl: URL,
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
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
                id: listId,
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
  addList(userId, list) {
    firebase.firestore().collection('lists').doc(list.id).set(list)
    this.addUserToList(userId, list.id)
  },
  addUserToList: (userId, listId) => (
    firebase.firestore().collection('user_list').doc().set({
      userId,
      listId,
    })
  ),
  addArticle: article => (
    firebase.firestore().collection('articles').doc(article.id)
      .set(article)
      .then(() => true)
  ),
  updateArticle: (id, data) => (
    firebase.firestore().collection('articles').doc(id).update(data)
  ),
  addUser() {
    return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
      currentList: null,
      notificationStatus: false,
    })
  },
  getCurrentUser() {
    return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
      .then(u => u.data())
  },
  getUser(userId) {
    return firebase.firestore().collection('users').doc(userId).get()
      .then(u => u.data())
  },
  updateUser: (id, data) => (
    firebase.firestore().collection('users').doc(id).update(data)
  ),
  updateCurrentUser: (data) => (
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update(data)
  ),
  joinList(userId, key) {
    return new Promise(async (resolve, reject) => {
      // Check if passed id is valid
      // in this case if the list exists
      // TODO: This should be done via own join_links collection
      // or something like that
      const list = await firebase.firestore().collection('lists').doc(key).get()
        .then(doc => {
          if (!doc.exists) {
            return null
          }
          return doc.data()
        })

      if(!list) {
        return reject(new Error('Invalid join link'))
      }

      const { id, owner, title } = list

      // User is the owner himself
      if(userId === owner) {
        return reject(new Error('You are the owner of this list'))
      }

      // Check if user is already part of the list
      const res = await firebase.firestore().collection('user_list')
        .where('userId', '==', userId)
        .where('listId', '==', id).get()
        .then(doc => {
          if(doc.empty) {
            // User is not in the list
            return null
          }
          // User is already in the list
          return true
        })
        
      if(res) {
        return reject(new Error('You already joined this list'))
      }

      this.addUserToList(userId, id)
      return resolve(`Successfully joined '${title}'`)
    })
  },
  subscribeUserToLists(token, topics) {
    return Promise.all(topics.map(t => (
      fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${t}`, {
        method: 'POST',
        headers: new Headers({
          'Authorization': `key=${config.serverKey}`,
        }),
      }).then(response => {
        if (response.status < 200 || response.status >= 400) {
          throw new Error(`Error subscribing to topic: ${response.status} - ${response.text()}`)
        }
        if(DEBUG) {
          console.log('User subscribed to topic', t)
        }
      }).catch(err => {
        console.error(err)
      })
    )))
  },
  unsubscribeUserFromLists(token, topics) {
    return Promise.all(topics.map(t => (
      fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${t}`, {
        method: 'DELETE',
        headers: new Headers({
          'Authorization': `key=${config.serverKey}`,
        }),
      }).then(response => {
        if (response.status < 200 || response.status >= 400) {
          throw new Error(`Error unsubscribing from topic: ${response.status} - ${response.text()}`)
        }
        if(DEBUG) {
          console.log('User unsubscribed from topic', t)
        }
      }).catch(err => {
        console.error(err)
      })
    )))
  },
  saveToken: token => (
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({ token })
  ),
  deleteToken: () => (
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({ token: firebase.firestore.FieldValue.delete() })
  ),
}