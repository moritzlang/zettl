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
  serviceWorker: {
    entry: path.join(process.cwd(), 'app/sw.js'),
    excludes: ['**/.*', '**/*.map'],
  },
}