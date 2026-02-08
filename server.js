const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const VERSION = "1.10";
const UNSPLASH_ACCESS_KEY = 'VT9QiRxg_zkaEx5z2PAO3tAJ-2XSwLgdGapDJ9orNo8';

app.get("/", (req, res) => res.send("Hello from Node.js backend!"));
app.get("/version", (req, res) => res.send("Version " + VERSION + " BACKEND"));

app.post("/getAgeGender", async (req, res) => {
    console.log("REQUEST BODY:", req.body);
    const { name, query } = req.body;

    let age, gender, probability, imageUrl = null;

    // First, fetch Unsplash independently
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

    // Then, fetch Agify and Genderize
    try {
        const ageResp = await axios.get(`https://api.agify.io?name=${name}`);
        age = ageResp.data.age;

        const genderResp = await axios.get(`https://api.genderize.io?name=${name}`);
        gender = genderResp.data.gender;
        probability = genderResp.data.probability;

        console.log("Agify/Genderize OK:", age, gender, probability);

    } catch (err) {
        console.warn("Agify/Genderize failed or limit reached:", err.response?.data || err.message);
        // Don't return early — still return Unsplash image
    }
    const agOK = (age !==null)&&(age !== undefined);
    const gnOK = (gender!==null)&&(gender!==undefined)&&(probability!==null)&&(probability!==undefined);
    const result = { name, age, gender, probability, url: imageUrl, agOK, gnOK};

    res.json(result); // Always include the image URL, even if age/gender are missing
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
