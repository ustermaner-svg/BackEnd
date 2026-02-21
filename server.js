const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const fs = require("fs");
const path = require("path");
const VERSION = "1.10";
const UNSPLASH_ACCESS_KEY = 'VT9QiRxg_zkaEx5z2PAO3tAJ-2XSwLgdGapDJ9orNo8';

app.get("/", (req, res) => res.send("Hello from Node.js backend!"));
app.get("/version", (req, res) => res.send("Version " + VERSION + " BACKEND"));

const COUNTER_FILE = path.join(__dirname, "counter.json");

const readCounter = () => {
  try {
    const data = fs.readFileSync(COUNTER_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return { count: 0, lastReset: Date.now() };
  }
}
const writeCounter = counter => {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(counter), "utf8");
}
app.post("/getAgeGender", async (req, res) => {
    console.log("REQUEST BODY:", req.body);
    const { name, query } = req.body;
    let counter = readCounter();
    const now = Date.now();

    let age, gender, probability, imageUrl = null;

    try {
        const imgResp = await axios.get(
            `https://api.unsplash.com/photos/random?query=${query}`,
            { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
        );
        imageUrl = imgResp.data?.urls?.small || null;
        console.log("Unsplash OK:", imageUrl);
    } catch (err) {
        console.warn("Unsplash failed or no photo found:", err.response?.data || err.message);
        imageUrl = null;
    }

    try {
        const ageResp = await axios.get(`https://api.agify.io?name=${name}`);
        age = ageResp.data.age;

        const genderResp = await axios.get(`https://api.genderize.io?name=${name}`);
        gender = genderResp.data.gender;
        probability = genderResp.data.probability;
  
          if (now - counter.lastReset > 24 * 60 * 60 * 1000) {
                counter.count = 0;
                counter.lastReset = now;
          }

          counter.count++;

          writeCounter(counter);
          console.log("Agify/Genderize OK:", age, gender, probability);
 
    } catch (err) {
        console.warn("Agify/Genderize failed or limit reached:", err.response?.data || err.message);
    }
    const agOK = (age !==null)&&(age !== undefined);
    const gnOK = (gender!==null)&&(gender!==undefined)&&(probability!==null)&&(probability!==undefined);
    const result = { name, age, gender, probability, url: imageUrl, agOK, gnOK, DRC: counter.count};

    res.json(result); 
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

