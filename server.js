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

// Age + Gender endpoint
app.post("/getAgeGender", async (req, res) => {
    const { name } = req.body;
    try {
        const ageResponse = await axios.get(`https://api.agify.io?name=${name}`);
        const genderResponse = await axios.get(`https://api.genderize.io?name=${name}`);

        const result = {
            name, 
            age: ageResponse.data.age,
            gender: genderResponse.data.gender,
            probability: genderResponse.data.probability
        };
        res.json(result);
    } catch (error) {
        console.error(error);
        console.log(error);// If there's an error, send a 500 status code with an error message
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
