const Users = require("../models/User.js");
const getUserData = async ({ senderId, conversation }) => {
  const senderUserId = senderId;
  const recieverUserId = conversation.members[1];
  const recieverUser = await Users.findById(recieverUserId);
  const senderUser = await Users.findById(senderUserId);
  if (senderId === conversation.members[0]) {
    return [senderUser, recieverUser];
  } else {
    return [recieverUser, senderUser];
  }
};
module.exports = getUserData;
