//Create a js file that will contain the logic for authentication and authorization via tokens and create a function to create an access tokens
const jwt = require("jsonwebtoken");
const secret = "CrushAkoNgCrushKo";

//create JWT
module.exports.createAccessToken = (user) => {
  //specify the information to encoded in the JWT payload
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  //sign the JWT that specifies data as payload
  //(payload, secretkey, options)
  return jwt.sign(data, secret, {});
  //reference: search google= jsonwebtoken npm
};

//verify authenticity of JWT
//next, it passes on the request to the next middleware function/route/request handler in the stack
module.exports.verify = (req, res, next) => {
  //get the token
  let token = req.headers.authorization;

  if (typeof token !== "undefined") {
    //use JS string method slice() to obtain a string's substring of the authorization property of the header
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjdlOGQwMmRhNWM1MTUxMGYxYTgxNSIsImVtYWlsIjoianVhbkBtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2MTAzMjk2NzF9.bz3sRMj7rTqn_Qvi9Nw5gf0pIxS_gfLxTtypnLup17w
    //removes the "Bearer " from the received token. To used the token only

    token = token.slice(7, token.length);

    //once we have the token substring, we can now verify it using the verify() method of the jsonwebtoken package
    return jwt.verify(token, secret, (err, data) => {
      return err ? res.send({ auth: "failed" }) : next();
    });
  } else {
    //there was No token in the request
    return res.send({ auth: "failed" });
  }
};

//decode JWT to get information from it(some user info is encoded in the payload)
module.exports.decode = (token) => {
  //the tokens parameter is for passing in the actual token value as an argument
  if (typeof token !== "undefined") {
    token = token.slice(7, token.length);
    return jwt.verify(token, secret, (err, data) => {
      //if verification results is error, do NOT decode
      return err ? null : jwt.decode(token, { complete: true }).payload;
      //{complete: true} grabs both the request headr and the payload
    });
  } else {
    return null;
  }
};

//fjdslkjfiodhvdkskj3i4736487 =
