/* eslint-disable no-restricted-globals */

import icon from 'images/icon-512x512.png'
import badge from 'images/icon-128x128.png'

import { DEBUG } from 'utils/config'

// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js')

const config = {
  apiKey: 'AIzaSyAEky8TexWlTfJYkcUCmSMfcqdxoFeZOXA',
  authDomain: 'zettl-835a3.firebaseapp.com',
  databaseURL: 'https://zettl-835a3.firebaseio.com',
  projectId: 'zettl-835a3',
  storageBucket: 'zettl-835a3.appspot.com',
  messagingSenderId: '211177511834',
  appId: '1:211177511834:web:d2a0112906690b2f',
}
// eslint-disable-next-line no-undef
firebase.initializeApp(config)
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()


const SUFFIX = new Date().toISOString()
const CACHE_NAME = `zettl-app-cache-${SUFFIX}`
const DATA_CACHE_NAME = `zettl-data-cache-${SUFFIX}`

const { assets } = global.serviceWorkerOption
const assetsToCache = ['/', ...assets]

// Gets triggered when service worker executes
// This only gets called once per service worker
// Do caching of key resources here
self.addEventListener('install', e => {
  if(DEBUG) {
    console.log('[SW] Install')
  }

  e.waitUntil(
    global.caches.open(CACHE_NAME)
      .then(cache => {
        if(DEBUG) {
          console.log('[SW] Caching app shell')
        }
        return cache.addAll(assetsToCache)
      })
      // Don't wait for page reload to activate the service worker
      // Activate new service worker right away
      .then(() => self.skipWaiting())
      .catch(err => console.error(err))
  )
})

// Triggered on every start up
// Do cleanup of previous runs here
self.addEventListener('activate', e => {
  if(DEBUG) {
    console.log('[SW] Activate')
  }

  e.waitUntil(
    global.caches.keys().then(cacheNames => (
      Promise.all(cacheNames.map(cacheName => {
        if(cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
          if(DEBUG) {
            console.log('[SW] Removing old cache', cacheName)
          }
          return global.caches.delete(cacheName)
        }
        return null
      }))
    ))
  )

  // Don't wait for page reload
  // Go through all clients and attempt to have the
  // currently executing service worker take control
  return self.clients.claim()
})


/*
  Fetch allows to intercept any network requests
  and handle them by ourself.

  In this case the cache-first strategy is used
  for the static all shell files.

  For API calls the stale-while-revalidate strategy is used
  which means try to fetch from network if possible otherwise
  retrieve data from the cache.
*/
self.addEventListener('fetch', e => {
  const { request } = e
  const requestUrl = new URL(request.url)

  // Ignore non GET request
  if(request.method !== 'GET') {
    return
  }

  // Handle API requests to different origin
  // and store their results in cache
  const handleApiCall = global.caches.open(DATA_CACHE_NAME).then(cache => (
    fetch(e.request)
      .then((response) => {
        // If the response was good, clone it and store it in the cache
        if(response.status === 200) {
          if (DEBUG) {
            console.log('[SW] Cache asset', e.request.url)
          }
          cache.put(e.request.url, response.clone())
        }
        return response
      })
      .catch(() => (
        // Network request failed, try to get it from the cache
        global.caches.match(e.request)
      ))
  ))

  const handleResource = global.caches.match(request).then(response => response || fetch(e.request))

  // Prevent default fetch handling from browser
  if(requestUrl.origin !== location.origin) {
    // Do not cache requests from firestore because
    // firestore is handling persistence by itself
    if(requestUrl.origin.indexOf('firestore') < 0) {
      e.respondWith(handleApiCall)
    }
  } else {
    e.respondWith(handleResource)
  }
})


// Show push notification unless
// client has the site already open and focused
messaging.setBackgroundMessageHandler(payload => {
  if(DEBUG) {
    console.log('[SW] Push Received', payload.data)
  }

  // eslint-disable-next-line no-undef
  const title = payload.data.title || 'zettl'
  const options = {
    body: payload.data.body || 'You have a new notification.',
    icon: payload.data.icon || icon,
    badge: payload.data.icon || badge,
  }

  // TODO: Add action at notification to delete the new article from the list

  return self.registration.showNotification(title, options)
})


// Open new tab when user clicks on the notification
// or focus on the tab if it already exists
self.addEventListener('notificationclick', e => {
  if(DEBUG) {
    console.log('[SW] User clicked on notification')
  }

  const urlToOpen = new URL('/', self.location.origin).href
  
  e.notification.close()
  
  // eslint-disable-next-line no-undef
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  })
    .then(windowClients => {
      let matchingClient = null

      for(let i = 0; i < windowClients.length; i += 1) {
        const windowClient = windowClients[i]
        if(windowClient.url === urlToOpen) {
          matchingClient = windowClient
          break
        }
      }

      if(matchingClient) {
        return matchingClient.focus()
      }

      // eslint-disable-next-line no-undef
      return clients.openWindow(urlToOpen)
    })

  e.waitUntil(promiseChain)
})