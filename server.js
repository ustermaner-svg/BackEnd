const express = require("express"); // this is like #include in c++
const axios = require("axios"); // this is like #include in c++
const app = express(); //this is like creating an object of the class express in js
const cors = require("cors"); // this is like #include in c++
app.use(cors()); // this is like #include in c++
app.use(express.json()); // this tells the code to be ready to handle json

// Root endpoint
app.get("/", (req, res) => {
    res.send("Hello from Node.js backend!"); // confirmation that the server is running and can respond to requests
});
app.get("/version", (req,res)=>{
    res.send("Version 1.7 BACKEND");
});
const ACCESS_KEY = 'VT9QiRxg_zkaEx5z2PAO3tAJ-2XSwLgdGapDJ9orNo8';
// Age + Gender endpoint
app.post("/getAgeGender", async (req, res) => {
    console.log("REQUEST BODY:", req.body);
    const { name, query } = req.body;
    try {
        console.log("Fetching age...");
        const ageResponse = await axios.get(`https://api.agify.io?name=${name}`);
        console.log("Age OK:", ageResponse.data);
        console.log("Fetching gender...");
        const genderResponse = await axios.get(`https://api.genderize.io?name=${name}`);
        console.log("Gender OK:", genderResponse.data);
        console.log("Fetching Unsplash...");
        const imageResponse = await axios.get(
            `https://api.unsplash.com/photos/random?query=${query}`,
            { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
        );
        console.log("Unsplash OK");
        const result = {
            name,
            age: ageResponse.data.age,
            gender: genderResponse.data.gender,
            probability: genderResponse.data.probability,
            url: imageResponse.data?.urls?.small || null
        };
        console.log("RESULT:", result);
        res.json(result);
    } catch (error) {
        console.error("ERROR STACK:", error.response?.data || error.message);
        res.status(500).json({
            error: "Backend failed",
            details: error.response?.data || error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});






