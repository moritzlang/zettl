const path = require('path')

module.exports = {
  manifest: {
    name: 'zettl',
    short_name: 'zettl',
    description: 'A fully offline shopping list app. Like a real piece of paper but on your phone.',
    background_color: '#F9F7F3',
    theme_color: '#F9F7F3',
    gcm_sender_id: '103953800507',
    inject: true,
    ios: true,
    icons: [
      {
        src: path.resolve('app/images/icon-512x512.png'),
        sizes: [72, 96, 128, 144, 192, 384, 512],
      },
      {
        src: path.resolve('app/images/icon-512x512.png'),
        sizes: [120, 152, 167, 180],
        ios: true,
      },
    ],
  },
  offlinePlugin: {
    relativePaths: false,
    publicPath: '/',
    appShell: '/',
    ServiceWorker: {
      events: true,
      entry: path.join(process.cwd(), 'app/service-worker.js'),
    },

    // No need to cache .htaccess. See http://mxs.is/googmp,
    // this is applied before any match in `caches` section
    excludes: ['.htaccess'],

    caches: {
      main: [':rest:'],

      // All chunks marked as `additional`, loaded after main section
      // and do not prevent SW to install. Change to `optional` if
      // do not want them to be preloaded at all (cached only when first loaded)
      additional: ['*.chunk.js'],
    },

    // Removes warning for about `additional` section usage
    safeToUseOptionalCaches: true,
  },
}