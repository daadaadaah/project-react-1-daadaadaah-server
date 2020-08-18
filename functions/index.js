const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./devConfig.json");

admin.initializeApp({
  credential: admin.credential.cert({
    "type": serviceAccount.type,
    "project_id": serviceAccount.project_id,
    "private_key_id": serviceAccount.private_key_id,
    "private_key": serviceAccount.private_key.replace(/\\n/g, '\n'),
    "client_email": serviceAccount.client_email,
    "client_id": serviceAccount.client_id,
    "auth_uri": serviceAccount.auth_uri,
    "token_uri": serviceAccount.token_uri,
    "auth_provider_x509_cert_url": serviceAccount.auth_provider_x509_cert_url,
    "client_x509_cert_url": serviceAccount.client_x509_cert_url  
  }  
)});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use( cors( { origin: true }));

// Routes
app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World! - /'+serviceAccount.project_id+"/");
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