// database authentication

require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3200;

const dbURL = process.env.MONGO_URL;

const User = require("./models/user.model");

mongoose.connect(dbURL)
    .then(() => {
        console.log("MongoDB Atlas Connected Succcessfully");
    })
    .catch((err) => {
        console.log("Error -> " + err);
    })

app.get("/", (req, res) => {
    // res.send("Home route");
    res.sendFile(__dirname + "/./views/index.html");
})

app.post("/register", async (req, res) => {
    /* res.status(201).json({
        message: "User Created"
    }) */

    // const {username, password} = req.body;
    // res.status(201).json({username, password});
    try {
        const newUser = new User(req.body);
        // console.log("New User:", newUser);
        await newUser.save();
        res.status(201).json(newUser);

    } catch (error) {
        res.status(500).json(error.message);
    }
})
app.post("/login", async (req, res) => {
    /* res.status(200).json({
        message: "User Logged in"
    }) */
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (user && user.password === password) {
            res.status(200).json({ status: "Valid User- Log in Successful" });
        }
        else {
            res.status(404).json({ status: "InValid User- Failed" });
        }
    } catch (error) {
        console.log("Error -> "+error);
    }
})

// route not found 
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not Found! Error 404"
    })
})
// handling error
app.use((err, req, res, next) => {
    res.status(500).json({
        message: "Something Error"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
})
