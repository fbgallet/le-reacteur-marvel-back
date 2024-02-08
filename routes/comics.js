const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/comics", async (req, res) => {
  try {
    const limit = "100";
    const { page, title } = req.body;
    const queryString = `${
      page ? "&limit=" + limit + "&skip=" + ((page - 1) * limit).toString() : ""
    }${title ? "&title=" + title : ""}`;
    const { data } = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}${queryString}`
    );
    // console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/comics/:characterId", async (req, res) => {
  try {
    // ex. de params: 5fcf91f4d8a2480017b91454
    const { characterId } = req.params;
    const { data } = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    console.log(data);
    res.status(200).json({ message: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

https: router.get("/comic/:comicId", async (req, res) => {
  try {
    // ex. de params: 5fce17e278edeb0017c93def
    const { comicId } = req.params;
    const { data } = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${comicId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    console.log(data);
    res.status(200).json({ message: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
