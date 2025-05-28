const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const { chats } = require("./data/data");
const app = express();

dotenv.config();
connectDB();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello chiatra class ");
});
app.get("/about", (req, res) => {
  res.send("This is about page");
});
app.get("/contact/address", (req, res) => {
  res.send("i am from kathmandu");
});
app.get("/chats", (req, res) => {
  res.send({ chats });
});
app.get("/chats/:id", (req, res) => {
  // console.log(req.params.id);
  const singleChat = chats.find((chat) => chat._id === req.params.id);
  res.send({ singleChat });
});

app.use("/api/auth", require("../backend/routes/Auth"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});