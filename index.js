require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

const comicsRoutes = require("./routes/comics");
const charactersRoutes = require("./routes/charaters");
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

app.listen(3000, () => {
  console.log("Server started ✅");
});
