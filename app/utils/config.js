export const DEBUG = process.env.NODE_ENV === 'development'
export const URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://zettl-835a3.firebaseapp.com'