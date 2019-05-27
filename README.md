# zettl 📝
A fully offline shopping list app. Like a real piece of paper but on your phone.

[Demo](https://zettl-835a3.firebaseapp.com)

# 🚀 Installation and Usage
First install all dependencies:
```
npm install
```
To run the app locally start the dev-server:
```
npm start
```
To deploy the app:
```
npm run deploy
```

# 🎢 Features
- It works offline
- Firebase Authentication
- Add to Homescreen install button
- Share your lists with other users (Web Share API)
- Receive notifications on list change (Using FCM)
- Add/edit list items while being offline

# 🏗 Possible improvements
- [x] Add fallback for Web Share API
- [ ] Turn notifications on/off for individual lists
- [ ] User can manually recreate join link
- [ ] Make join links invalid after some time
- [ ] Users can be removed from list
- [x] Keep 'undelivered' state of article after page reload
- [ ] Don't fetch all lists at once
- [ ] User can delete lists
- [x] User can delete articles
- [ ] Do un- and subscribing on server side because of exposed serverKey
- [ ] Redirect to the affected list on notificationclick

# © License
This project is released under the [MIT License](LICENSE.md).
