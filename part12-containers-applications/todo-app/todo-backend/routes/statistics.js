const express = require('express');
const router = express.Router();
const redis  = require('../redis');

router.get('/', async (req, res) => {
  try {
    let todoCount = await redis.getAsync('todoCount');
    if (todoCount == null) {
      todoCount = 0;
    }
    res.send({ 'added_todos': todoCount });
  } catch(error) {
    console.error("Error with todoCount:", error);
    res.status(500).send({error: "Error with todoCount" });
  }
});

module.exports = router;
