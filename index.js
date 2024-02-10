require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

// mongoose.connect(process.env.MONGODB_URI + "Marvel");
mongoose.connect("mongodb://localhost:27017/Marvel"); // 127.0.0.1

const userRoutes = require("./routes/user");
const comicsRoutes = require("./routes/comics");
const charactersRoutes = require("./routes/charaters");
app.use(userRoutes);
app.use(comicsRoutes);
app.use(charactersRoutes);

// Welcome Route
app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Welcome on the server 👋" });
  } catch (error) {
    res.status(500).json({ message: error.response });
  }
});

// All other routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist ⛔" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started ✅");
});
