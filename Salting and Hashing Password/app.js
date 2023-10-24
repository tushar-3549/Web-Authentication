// Salting and hashing password

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/user.model");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const PORT = process.env.PORT || 7800;
const dbURL = process.env.MONGO_URL;
mongoose
    .connect(dbURL)
    .then(() => {
        console.log("mongodb atlas is connected");
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/./views/index.html");
});

app.post("/register", async (req, res) => {
    try {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
            // Store hash in your password DB.
            const newUser = new User({
                email: req.body.email,
                password: hash,
            });
            await newUser.save();
            res.status(201).json(newUser);
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (user) {
            bcrypt.compare(password, hash, function(err, result) {
                // result == true
                if(result === true) {
                    res.status(200).json({ status: "Valid user" });
                }
            });
        } else {
            res.status(404).json({ status: "Invalid user" });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// route not found error
app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found",
    });
});

//handling server error
app.use((err, req, res, next) => {
    res.status(500).json({
        message: "something broke",
    });
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});

// password checker: http://password-checker.online-domain-tools.com/
// used: https://www.npmjs.com/package/bcrypt
