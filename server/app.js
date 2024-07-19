//imports
//imports of express and dotenv\
const express = require("express");
require("dotenv").config();
const cors = require("cors");

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
const getUserData = require("./functions/getuserData.js");
const sendNewMessage = require("./functions/sendNewMessage.js");

//app defining
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());
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
app.post("/api/login", userExistForLogin, async (req, res, isExist) => {
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
      user: {
        username: userFromDb.username,
        email: userFromDb.email,
        id: userFromDb._id,
      },
      token: tokenJWT,
    });
  }
});
app.post("/api/create/conversations", async (req, res) => {
  const { senderId, recieverId } = req.body;
  console.log(req.body);
  try {
    if (senderId === recieverId) {
      const existTheMainUser = await Conversations.findOne({
        members: { $all: [senderId, recieverId] },
      });
      if (existTheMainUser) {
        res.status(400).send(" you are already created chat with yourself");
      } else {
        const newMainConversation = await Conversations.create({
          members: [senderId, recieverId],
        });
        return res.status(200).json({
          message: "created self chat",
          conversation: newMainConversation,
        });
      }
    } else {
      const existingConversation = await Conversations.findOne({
        members: { $all: [senderId, recieverId] },
      });

      if (existingConversation) {
        return res.status(400).send("conversation exist already");
      } else {
        try {
          const newConversation = await Conversations.create({
            members: [senderId, recieverId],
          });
          console.log("coneversations: " + newConversation);
          return res.status(200).json({
            message: "conversation created successfully",
            conversation: newConversation,
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

app.get("/api/get/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });
    if (!conversations) {
      res.status(400).json({
        message: "something went wromng while finding conversations",
      });
    } else {
      const conversationDeatials = await Promise.all(
        conversations.map(async (conver) => {
          console.log(conver.members);
          const senderUser = await Users.findById({ _id: conver.members[0] });
          const recieverUser = await Users.findById({ _id: conver.members[1] });
          const otherUser =
            userId === senderUser._id.toString() ? recieverUser : senderUser;
          return {
            conversationId: conver._id,
            email: otherUser.email,
            username: otherUser.username,
          };
        })
      );
      return res.json(conversationDeatials);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "errror in server fetching details",
    });
  }
});
app.post("/api/sendMessage", async (req, res) => {
  //   const senderId = req.params.senderId;
  const { ConversationId, senderId, message, recieverId } = req.body;

  if (!senderId || !message) {
    return res.status(400).json({
      message: "please fill sender and message field",
    });
  }
  try {
    let conversationId = ConversationId;

    if (!conversationId || conversationId == "") {
      const existingConversation = await Conversations.findOne({
        members: { $all: [senderId, recieverId] },
      });
      console.log("existing Conversation: ", existingConversation);
      if (existingConversation) {
        conversationId = existingConversation._id;
      } else {
        const newConversation = await Conversations.create({
          members: [senderId, recieverId],
        });
        conversationId = newConversation._id;
        conversationId = conversationId;
      }
    }
    console.log("Conversation id : ", conversationId.toString());
    const newMessage = await sendNewMessage({
      conversationId,
      senderId,
      message,
      Messages,
    });

    console.log("newMesage", newMessage);
    if (newMessage) {
      return res.status(200).json({
        info: "message saved successFully",
        message: newMessage,
      });
    } else {
      return res.status(400).json({
        message: "something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("couldnt send the message");
  }
  //   console.log(conversations);
});
app.post("/api/messages", async (req, res) => {
  const { ConversationId, senderId } = req.body;
  if (!ConversationId || !senderId) {
    return res
      .status(400)
      .json({ message: "ConversationId and senderId are required." });
  }
  try {
    const conversation = await Conversations.findById(ConversationId);
    if (!conversation) {
      return res.status(400).json({ message: "conversation not found" });
    }
    const usersArray = await getUserData({
      senderId,
      conversation,
    });
    const recieverUserForFrontendId =
      senderId === conversation.members[0]
        ? conversation.members[1]
        : conversation.members[0];
    const recieverUserForFrontend = await Users.findById(
      recieverUserForFrontendId
    );
    if (usersArray.length < 2) {
      return res.status(400).json({ message: "users not found" });
    }
    const senderUser = usersArray[0];
    const recieverUser = usersArray[1];
    const messages = await Messages.find({
      ConversationId,
    });
    if (!messages || !conversation) {
      res.status(400).json("Message or conversations not found");
    }
    const allMessages = await Promise.all(
      messages.map((messageWithIds) => {
        if (senderId === messageWithIds.senderId) {
          return {
            idType: "sender",
            senderId: senderId,
            username: senderUser.username,
            message: messageWithIds.message,
          };
        } else {
          return {
            idType: "reciever",
            recieverId: recieverUser.id,
            username: recieverUser.username,
            message: messageWithIds.message,
          };
        }
      })
    );
    return res.status(200).json({
      allMessages,
      recieverUserForFrontend: {
        id: recieverUserForFrontendId,
        username: recieverUserForFrontend.username,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
//bnana h kya :- suggestion field
app.get("/api/suggestions", async (req, res) => {
  try {
    const allUsers = await Users.find({});

    allUsers.map((user) => {
      console.log({
        username: user.username,
        userId: user._id.toString(),
      });
    });
    res.status(200).json("All suggestions listed");
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log("the port is running at port " + port);
});
