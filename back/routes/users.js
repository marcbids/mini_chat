const express = require("express");
const router = express.Router();
const userController = require("../controller/users");
const auth = require("../auth");

router.post("/email-exists", (req, res) => {
  UserController.emailExists(req.body).then((result) => res.send(result));
});

router.post("/signup", (req, res) => {
  userController.emailExists(req.body).then((result) => {
    if (result) {
      res.send({ error: `Email already exist` });
      return;
    }
    userController
      .addUser(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((e) => {
        const { keyValue } = e;
        res.send({ error: `Email ${keyValue.email} already exist` });
      });
  });
});

router.post("/login", (req, res) => {
  userController
    .login(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

router.get("/details", auth.verify, (req, res) => {
  const token = req.headers.authorization;
  const user = auth.decode(token).id;
  userController
    .getDetails(user)
    .then((result) => {
      return res.send(result);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});
router.get("/other/:id", (req, res) => {
  userController
    .getOthers(req.params.id)
    .then((result) => {
      return res.send(result);
    })
    .catch((e) => res.send.status(500).send(e));
});

router.get("/all", (req, res) => {
  userController
    .getAll()
    .then((result) => {
      return res.send(result);
    })
    .catch((e) => res.status(500).send(e));
});

router.post("/update", (req, res) => {
  console.log(req);
  const token = req.headers.authorization;
  const user = auth.decode(token).id;

  userController
    .update({ id: user, data: req.body })
    .then((result) => res.send(result))
    .catch((e) => res.status(500).send(e));
});
module.exports = router;
