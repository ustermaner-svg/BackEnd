const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const VERSION = "1.9";
const UNSPLASH_ACCESS_KEY = 'VT9QiRxg_zkaEx5z2PAO3tAJ-2XSwLgdGapDJ9orNo8';

// Root endpoint
app.get("/", (req, res) => res.send("Hello from Node.js backend!"));
app.get("/version", (req, res) => res.send("Version " + VERSION + " BACKEND"));

// Age + Gender + Unsplash endpoint
app.post("/getAgeGender", async (req, res) => {
    console.log("REQUEST BODY:", req.body);
    const { name, query } = req.body;

    let age, gender, probability, imageUrl = null;

    try {
        // Fetch age
        const ageResp = await axios.get(`https://api.agify.io?name=${name}`);
        age = ageResp.data.age;

        // Fetch gender
        const genderResp = await axios.get(`https://api.genderize.io?name=${name}`);
        gender = genderResp.data.gender;
        probability = genderResp.data.probability;

    } catch (err) {
        console.warn("Agify/Genderize failed or limit reached:", err.response?.data || err.message);
    }

    try {
        // Fetch Unsplash image
        const imgResp = await axios.get(
            `https://api.unsplash.com/photos/random?query=${query}`,
            { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
        );
        imageUrl = imgResp.data?.urls?.small || null;
    } catch (err) {
        console.warn("Unsplash failed or no photo found:", err.response?.data || err.message);
        imageUrl = null; // If Unsplash fails, just return null
    }

    const result = { name, age, gender, probability, url: imageUrl };

    // If both Agify and Genderize failed completely
    if (age === undefined && gender === undefined) {
        return res.status(502).json({ error: "Agify/Genderize APIs failed or limit reached", result });
    }

    res.json(result);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
