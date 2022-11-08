const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let users = [];

// when connection
// take user ud abd socket id
// send and get message
// when disconnect

io.on("connection", (socket) => {
  console.log("A user has been connected");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("ping", (test) => {
    const user = getUser(test);
    if (user) {
      io.to(user.socketId).emit("pong", "A chat has been deleted");
    }
  });

  socket.volatile.on("sendMessage", ({ sender, receiver, message }) => {
    const user = getUser(receiver);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        sender,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user has been disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const addUser = (userId, socketId) => {
  if (userId) {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  }
};

httpServer.listen(8900);
