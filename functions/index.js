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
const { user } = require('firebase-functions/lib/providers/auth');
app.use( cors( { origin: true }));

// Routes
// Hello-world
app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!! /'+serviceAccount.project_id+"/");
})

// User
app.post("/login", async (request, response) =>  {

  const user = {
    uid: request.body.uid,
    email: request.body.email,
    photoURL: request.body.photoURL
  };

  const isDoc = await db.collection('user').doc(`/${user.uid}/`).get();

  if(isDoc.exists) { // 이미 가입된 회원이 로그인 한 경우
    
    return response.status(201).json({ 
      message: "login successfully",
      body : {
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
      }
    });
  }

  const newUser = {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: new Date().toISOString()
  };

  try {
    
    const signup = await db.collection('user').doc(`/${user.uid}/`).set(newUser);

    return response.status(201).json({ 
      message: "signup successfully",
      body : {
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
      }
    });

  } catch (error) { // TODO : 에러 헨들링 더 공부 후 수정하기
      console.error(error);
      return response.status(500).send(error);  
  }
});

exports.api = functions.https.onRequest(app);
