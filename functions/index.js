const functions = require('firebase-functions');

const express = require('express');
const app = express();

const cors = require('cors');

const hellowordRouter = require("./controllers/helloword.js");
const userRouter = require("./controllers/user");

app.use( cors( { origin: true }));
app.use('/hello-world', hellowordRouter);
app.use("/login", userRouter);

exports.api = functions.https.onRequest(app);
