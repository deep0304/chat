const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const userExistForRegister = require("./middlewares/userExistForRegister.js");
const userExistForLogin = require("./middlewares/userExistForLogin.js")

//imports
require("./db/connection.js");
const Users = require("./models/User.js");

const app = express();
const port = 3001;
app.use(express.json());
app.get("/", (req, res) => {
  return res.json({
    message: "hi   what is this message i want to share to you",
  });
});
app.post("/api/register", userExistForRegister, async (req, res) => {
  const { username, email, password } = req.body;
  // if (!email || !username || !password) {
  //   res.status(400).send("Please fill required filled");
  // } else {
  //   const isExist = await Users.findOne({ email: email });

  //   if (isExist) {
  //     console.log("exist: ", isExist.email);
  //     return res.status(400).send("User already exists");
  //   } else {
  const newUser = await Users.create({ username, email });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(
      `email:${email},password:${password}`,
      salt,
      (err, hashedToken) => {
        newUser.set("password", hashedToken);
        console.log(hashedToken);
        newUser.save();
        console.log(newUser);
      }
    );
  });
  return res.status(200).send("User registered successfully");
});
app.get("/app/login",userExistForLogin,(req, res,isExist) => {
  const user


});
app.listen(port, () => {
  console.log("the port is running at port " + port);
});
