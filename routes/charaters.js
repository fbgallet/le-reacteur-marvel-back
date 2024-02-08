const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters", async (req, res) => {
  try {
    const limit = "100";
    const { page, title } = req.body;
    const queryString = `${
      page ? "&limit=" + limit + "&skip=" + ((page - 1) * limit).toString() : ""
    }${title ? "&title=" + title : ""}`;
    const { data } = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}${queryString}`
    );
    // console.log(data);
    res.status(200).json({ message: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/character/:characterId", async (req, res) => {
  try {
    // ex. de params: 5fcf91f4d8a2480017b91453
    const { characterId } = req.params;
    const { data } = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    console.log(data);
    res.status(200).json({ message: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
