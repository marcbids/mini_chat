const Users = require("../model/users");
const bcrypt = require("bcrypt");
const auth = require("../auth");

//check for duplicate email
module.exports.emailExists = (params) => {
  return Users.find({ email: params.email }).then((result) => {
    return result.length > 0 ? true : false;
  });
};

module.exports.addUser = async (params) => {
  const { email, password, name } = params;
  if (!email && !password) {
    return res.status(400).send({ error: "Data not formatted properly" });
  }
  let user = new Users({
    name: name,
    email: email,
    username: email,
    password: bcrypt.hashSync(password, 10),
    active: true,
  });
  return user.save().then((user, err) => {
    return err ? err : true;
  });
};

module.exports.login = async (params) => {
  const { email, password } = params;
  return Users.findOne({ email: email }).then(async (user, err) => {
    if (user) {
      const isPasswordMatched = bcrypt.compareSync(password, user.password);
      return isPasswordMatched
        ? { accessToken: auth.createAccessToken(user) }
        : false;
    } else {
      return false;
    }
  });
};

module.exports.getDetails = (params) => {
  return Users.findById(params).then((user, err) => {
    if (err) return;
    user.password = undefined;
    return user;
  });
};

module.exports.getOthers = (params) => {
  return Users.findById(params).then((user, err) => {
    if (err) return;
    user.password = undefined;
    return user;
  });
};

module.exports.getAll = (params) => {
  return Users.find().then((user, err) => {
    if (err) return;
    user.password = undefined;
    return user;
  });
};

module.exports.update = (params) => {
  const { id, data } = params;
  if (data.password) data.password = bcrypt.hashSync(data.password, 10);
  return Users.findByIdAndUpdate(id, data, { new: true }).then((user) => {
    return user;
  });
};
