const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
const port = process.env.PORT || 8000;
const url =
  "mongodb+srv://marcbids:marcbids@cluster0.z5jb0.mongodb.net/chat?retryWrites=true&w=majority";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "Connection Error")
);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas.")
);

const userRoutes = require("./routes/users");
const conversationRouter = require("./routes/conversation");
const chatRouter = require("./routes/chat");

app.use("/api/chat", chatRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
