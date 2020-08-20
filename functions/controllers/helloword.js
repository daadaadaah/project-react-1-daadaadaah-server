const express = require('express');
const router = express.Router();


router.get("/", async (req, response, next) => {

  console.log("router : ","router");

  try {
    return response.status(200).send('[concerns] Hello World!!');
  } catch (error) {
    console.error(error);
    return response.status(500).send(error);  
  }
});

module.exports = router;
