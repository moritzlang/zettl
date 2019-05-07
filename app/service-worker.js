/* eslint-disable no-restricted-globals */

import icon from 'images/icon-512x512.png'
import badge from 'images/icon-128x128.png'


self.addEventListener('install', () => {
  console.log('[SW] Install Test')
})

// Show push notification unless
// client has the site already open and focused
self.addEventListener('push', e => {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${e.data.text()}"`)

  // TODO: Get url from push
  // const urlToOpen = new URL('/', self.location.origin).href

  const title = 'zettl'
  const options = {
    body: 'Yay it works.',
    icon,
    badge,
  }

  const promiseChain = isClientFocused()
    .then(clientIsFocused => {
      if(clientIsFocused) {
        return
      }
      // Client isn't focused, we need to show a notification.
      // eslint-disable-next-line consistent-return
      return self.registration.showNotification(title, options)
    })

  e.waitUntil(promiseChain)
})

function isClientFocused() {
  // eslint-disable-next-line no-undef
  return clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  })
    .then(windowClients => {
      let clientIsFocused = false
      for(let i = 0; i < windowClients.length; i += 1) {
        const windowClient = windowClients[i]
        if(windowClient.focused) {
          clientIsFocused = true
          break
        }
      }
      return clientIsFocused
    })
}

// Open new tab when user clicks on the notification
// or focus on the tab if it already exists
self.addEventListener('notificationclick', e => {
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