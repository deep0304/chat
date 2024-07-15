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
const Messages = require("./models/Messages.js");
const Conversations = require("./models/conversations.js");

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
app.post("/api/create/conversations", async (req, res) => {
  const { senderId, recieverId } = req.body;
  console.log(req.body);
  try {
    if (senderId == recieverId) {
      const existTheMainUser = await Conversations.findOne({
        members: [senderId, recieverId],
      });
      if (existTheMainUser) {
        res.status(400).send(" you are already created chat with yourself");
      } else {
        const newMainConversation = await Conversations.create({
          members: [senderId, recieverId],
        });
        res.status(200).json({
          message: "created self chat",
        });
      }
    } else {
      const existingConversation = await Conversations.findOne({
        members: { $all: [senderId, recieverId] },
      });

      if (existingConversation) {
        res.status(400).send("conversation exist already");
      } else {
        try {
          const newConversation = await Conversations.create({
            members: [senderId, recieverId],
          });
          console.log("coneversatuons: " + newConversation);
          res.status(200).json({
            message: "conversation created successfully",
          });
        } catch (error) {
          console.log(error);
          res.status(400).send("apologies.. something went wrong");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("aplogies .. conjversations not created ");
  }
});

app.get("/api/get/conversations/:userid", async (req, res) => {
  const params = req.params;
  const userId = params.userid;
  console.log(userId);
  const conversations = await Conversations.find({
    members: userId,
  });
  res.json({
    message: "something herer ",
  });
});
app.post("/api/messages/:senderId", async (req, res) => {
  const senderId = req.params.senderId;
  const conversations = await Conversations.find({
    members: { $in: [senderId] },
  });
  console.log(conversations);
  console.log("----------------------");
  conversations.map(async (conver) => {
    console.log(conver.members);
    const senderUser = await Users.findById({ _id: conver.members[0] });
    const recieverUser = await Users.findById({ _id: conver.members[1] });
    if (recieverUser._id == senderId && senderUser._id == senderId) {
      console.log("it is you, yourself");
    } else {
      console.log({
        conver: conver._id,
        senderUsername: senderUser.username,
        recieverUsername: recieverUser.username,
      });
    }
  });
  //   console.log(conversations);
  res.json({
    message: "you are tryng ",
  });
});
app.listen(port, () => {
  console.log("the port is running at port " + port);
});
