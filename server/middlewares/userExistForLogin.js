const Users = require("../models/User");
async function userExistForLogin(req, res, next) {
  // const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  if (!password || !username) {
      return res.status(400).send("Please fill all required fields");
  }

  const user = await Users.findOne({ username: username });
  if (user) {
    return next();
  } else {
    return res.send("Please register and then login");
  }
}

module.exports = userExistForLogin;