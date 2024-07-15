//imports
//imports of express and dotenv\
const express = require("express");
require("dotenv").config();

//encyrption imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// functions imports
const userExistForRegister = require("./middlewares/userExistForRegister.js");
const userExistForLogin = require("./middlewares/userExistForLogin.js");
const generateJWTtoken = require("./functions/generateJWTtoken.js");

// database imports
require("./db/connection.js");
const Users = require("./models/User.js");

//app defining
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
  const newUser = await Users.create({ username, email });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(
      `username:${username},password:${password}`,
      salt,
      (err, hashedToken) => {
        newUser.set("password", hashedToken);
        console.log(hashedToken);
        newUser.save();
        console.log(newUser);
      }
    );
  });
  const payload = {
    _id: newUser._id,
    username: newUser.username,
  };
  const tokenJWT = generateJWTtoken(payload);
  const updateduser = await Users.updateOne(
    {
      _id: payload._id,
      username: payload.username,
    },
    {
      $set: {
        token: tokenJWT,
      },
    },
    {
      upsert: true,
    }
  );
  return res.status(200).json({
    message: "User registered successfully",
    credentials: {
      _id: payload._id,
      username: payload.username,
      token: tokenJWT,
    },
  });
});
app.get("/app/login", userExistForLogin, async (req, res, isExist) => {
  const { username, password } = req.body;
  const userFromDb = await Users.findOne({ username: username });
  //taking password form the database
  const passwordFromDb = userFromDb.password;
  //validatring the user for generating the token
  const validateuser = await bcrypt.compare(
    `username:${username},password:${password}`,
    passwordFromDb
  );
  if (!validateuser) {
    res
      .status(400)
      .send("password not matched...try Again or Use forgot password");
  } else {
    const payload = {
      _id: userFromDb._id,
      username: userFromDb.username,
    };

    //generating and saving the token in the db
    const tokenJWT = generateJWTtoken(payload);
    try {
      const updateduser = await Users.updateOne(
        { _id: payload._id, username: payload.username },
        {
          $set: { token: tokenJWT },
        },
        {
          upsert: true,
        }
      );

      console.dir(updateduser);
    } catch (error) {
      res.status(400).json({
        message: "somthing went wrong",
      });
    }

    res.status(200).json({
      userId: userFromDb._id,
      username: userFromDb.username,
      token: tokenJWT,
    });
  }
});
app.listen(port, () => {
  console.log("the port is running at port " + port);
});
