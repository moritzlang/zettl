const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.sendNotification = functions.firestore.document('articles/{articleId}').onCreate((snap, context) => {
    const article = snap.data()
    const firstName = article.creator.displayName.split(' ')[0]
  
    const message = {
      condition: `!('${article.creator.userId}' in topics) && '${article.listId}' in topics`,
      data: {
        title: `${firstName} added a new article`,
        body: article.value,
      },
    }
    
    return admin.messaging().send(message)
      .then(res => {
        console.log('Successfully sent message:', res)
        return res
      })
      .catch(err => {
        console.log('Error sending message:', err)
      })
})

exports.updateArticle = functions.firestore.document('articles/{articleId}').onCreate((snap, context) => {
  const article = snap.data()
  return admin.firestore().collection('articles').doc(article.id)
    .update({
      success: true,
      processing: false,
    })
})