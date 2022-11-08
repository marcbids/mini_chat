const Conversation = require("../model/conversation");

// create a new converstaion
module.exports.newConversation = (params) => {
  const { senderId, receiverId } = params;
  const conversation = new Conversation({
    members: [senderId, receiverId],
  });
  return conversation.save().then((data, err) => {
    return err ? err : data;
  });
};
// get conversation

module.exports.getConversation = (params) => {
  return Conversation.find({
    members: { $in: [params] },
  }).then((data, err) => {
    return err ? err : data;
  });
};

module.exports.getConv = ({ firstUserId, secondUserId }) => {
  return Conversation.findOne({
    members: { $all: [firstUserId, secondUserId] },
  }).then((data, err) => {
    return err ? err : data;
  });
};

module.exports.delete = (params) => {
  return Conversation.findByIdAndDelete(params).then((err) => {
    if (err) return err;
    return true;
  });
};
