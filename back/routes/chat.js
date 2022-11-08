const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat");

router.post("/", (req, res) => {
  chatController
    .newChat(req.body)
    .then((result) => res.status(200).send(result))
    .catch((e) => res.status(500).send(e));
});

router.get("/:conversationId", (req, res) => {
  chatController
    .getChat(req.params.conversationId)
    .then((result) => res.status(200).send(result))
    .catch((e) => res.status(500).send(e));
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let result = await chatController.delete(req.params.id);
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
