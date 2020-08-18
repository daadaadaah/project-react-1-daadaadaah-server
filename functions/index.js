const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./devConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(...serviceAccount,
    {
      private_key: serviceAccount.private_key.replace(/\\n/g, '\n')
    }   
)});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use( cors( { origin: true }));

// Routes
app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!1');
})

app.post('/user', (req, res) => {

  (async () => {
    try {
      await db.collection('user').doc('/'+req.body.uid+'/')
      .create({
          uid: req.body.uid,
          email: req.body.email,
          photoURL: req.body.photoURL
      })
      return res.status(200).send();

    } catch(error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();

})

// Export the API to Firebase Cloud Functions
exports.api = functions.https.onRequest(app);