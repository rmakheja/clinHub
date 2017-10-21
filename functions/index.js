
// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const gcs = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision')();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Adds a message that welcomes new users into the chat.
exports.addWelcomeMessages = functions.auth.user().onCreate(event => {
  const user = event.data;
  console.log('A new user signed in for the first time.');
  const fullName = user.displayName || 'Anonymous';

  admin.database().ref('messageThreads/').push({
      messages :{
        0:{
          from: "ClinHub",
          text: "Welcome to clinhub"
        }
      },
      user1: -1, 
      user2: currentUser.key
    })
    }
)

exports.sendNotifications = functions.database.ref('/messageThreads/{messageThreadId}/messages/{messageId}').onWrite(event => {
  const snapshot = event.data;
  // Only send a notification when a new message has been created.
  if (snapshot.previous.val()) {
    return;
  }

  // Notification details.
  const text = snapshot.val().text;
  const userkey = snapshot.val().to;
  const payload = {
    notification: {
      title: `${snapshot.val().from} sent a message`,
      body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
      icon: '/images/icon16.png',
      click_action: `https://${functions.config().firebase.authDomain}`
    }
  };

  // Get the list of device tokens.
  return admin.database().ref('fcmTokens').once('value').then(allTokens => {
    if (allTokens.val()) {
      tokensVal = allTokens.val();
      // Listing all tokens.
      const tokens = [];
      for (var token in tokensVal){
        if(tokensVal.hasOwnProperty(token)){
          if(tokensVal[token] == userkey){
            tokens.push(token);
          }
        }
      }

      // Send notifications to all tokens.
      return admin.messaging().sendToDevice(tokens, payload).then(response => {
        // For each message check if there was an error.
        const tokensToRemove = [];
        response.results.forEach((result, index) => {
          const error = result.error;
          if (error) {
            console.error('Failure sending notification to', tokens[index], error);
            // Cleanup the tokens who are not registered anymore.
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
              tokensToRemove.push(allTokens.ref.child(tokens[index]).remove());
            }
          }
        });
        return Promise.all(tokensToRemove);
      });
    }
  });
});