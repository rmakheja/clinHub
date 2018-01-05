
// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const gcs = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision')();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'clinhub.sbu@gmail.com',
                          pass: 'clinhubSbu1!'
                        }
                      });
// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'SBU-Clinhub';



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
  const from = snapshot.val().from;
  const payload_title = `${snapshot.val().from} sent a message`
  return notify(text, userkey, from, payload_title)  
});


sendEmail = function(to, text, from){
  return admin.database().ref('users/'+ to + '/email').once('value').then(emailId => {
    email = emailId.val()
    const mailOptions = {
      from: `${APP_NAME} <noreply@firebase.com>`,
      to: email
    };
   
    mailOptions.subject = `${from} sent a message on Clinhub`;
    mailOptions.text = text;
    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('New welcome email sent to:', email);
    });
  });
}



exports.sendReminder = functions.database.ref('/surveys/{year}/{userId}/send_email').onUpdate(event => {
  const snapshot = event.data;
  // Only send a notification when a new message has been created.
  const userkey = event.params.userId;
  if (snapshot.val() == "no") {
    return;
  }
  admin.database().ref('surveys/'+event.params.year +'/'+userkey+'/send_email/').set("no")
  // Notification details.
  const text = "You have pending surveys. Please log in to Clinhub to access the links"
  const payload_title = `Pending Surveys`
  const from = 'ClinHub'
  return notify(text, userkey, from, payload_title)  
});

notify = function(text, userKey, from, payload_title){
  const payload = {
    notification: {
      title: payload_title,
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
          if(tokensVal[token] == userKey){
            tokens.push(token);
          }
        }
      }

      if(tokens.length == 0){
        return sendEmail(userKey, text, from)
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

}