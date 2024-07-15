const Users = require("../models/User");
async function userExistForRegister(req, res, next) {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  if (!email || !password || !username) {
    return res.status(400).send("Please fill all required fields");
  }
  const isExist = await Users.findOne({ email: email });
  if (isExist) {
    return res.send("User exist already");
  } else {
    next();
  }
}

module.exports = userExistForRegister;
