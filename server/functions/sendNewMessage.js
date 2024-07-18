const sendNewMessage = async ({
  conversationId,
  senderId,
  message,
  Messages,
}) => {
  try {
    const newMessage = await Messages.create({
      ConversationId: conversationId,
      senderId,
      message,
    });

    return newMessage;
  } catch (error) {
    console.log(error);
  }
};
module.exports = sendNewMessage;
