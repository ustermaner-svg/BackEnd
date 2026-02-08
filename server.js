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
    res.send("Version 1.4 BACKEND");
});
const ACCESS_KEY = 'VT9QiRxg_zkaEx5z2PAO3tAJ-2XSwLgdGapDJ9orNo8';
// Age + Gender endpoint
app.post("/getAgeGender", async (req, res) => {
    const { name } = req.body;
    const {query} = req.body;
    try {
        const ageResponse = await axios.get(`https://api.agify.io?name=${name}`);
        const genderResponse = await axios.get(`https://api.genderize.io?name=${name}`);
        const response = await axios.get(`https://api.unsplash.com/photos/random?query=${query}`, {
            headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
        });
        const result = {
            name, 
            age: ageResponse.data.age,
            gender: genderResponse.data.gender,
            probability: genderResponse.data.probability,
            url: response.data.urls.small
        };
        if (result.age === undefined && result.gender === undefined && result.probability === undefined) {
            return res.status(502).json({ error: "External API failed or limit reached" });
        };
        res.json(result);
    }
    catch (error) {
        console.error(error);
        console.log(error);// If there's an error, send a 500 status code with an error message
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});




