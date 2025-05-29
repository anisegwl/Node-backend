const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const app = express();
app.use(cors())

dotenv.config();
connectDB();
const port = process.env.PORT;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello chiatra class ");
});

app.use("/api/auth", require("./routes/Auth"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});