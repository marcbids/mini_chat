const express = require("express");
const router = express.Router();
const conversationController = require("../controller/conversation");
const conversation = require("../model/conversation");

router.post("/", (req, res) => {
  conversationController
    .newConversation(req.body)
    .then((result) => res.status(200).send(result))
    .catch((e) => res.status(500).send(e));
});

router.get("/:userId", (req, res) => {
  conversationController
    .getConversation(req.params.userId)
    .then((result) => res.status(200).send(result))
    .catch((e) => res.status(500).send(e));
});

router.get("/find/:firstUserId/:secondUserId", (req, res) => {
  conversationController
    .getConv(req.params)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((e) => res.status(500).send(e));
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let result = await conversationController.delete(req.params.id);
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;
