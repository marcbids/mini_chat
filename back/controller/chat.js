const Chat = require("../model/chat");

module.exports.newChat = (params) => {
  const chat = new Chat(params);
  return chat.save().then((chat, err) => {
    return err ? err : chat;
  });
};

module.exports.getChat = (params) => {
  return Chat.find({ conversationId: params }).then((chat, err) => {
    return err ? err : chat;
  });
};

module.exports.delete = (params) => {
  return Chat.deleteMany({ conversationId: params }).then((err) => {
    if (err) return err;
    return true;
  });
};
