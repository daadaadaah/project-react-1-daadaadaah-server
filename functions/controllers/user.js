const db = require("../database");
const express = require("express");
const router = express.Router();

router.post("/", async (request, response) =>  {

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
      return response.status(500).send({ error: error});  
  }
});

module.exports = router;