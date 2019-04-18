const { User} = require("../models/user");
const {Logged} = require("../models/userLoggedIn");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
    JWT_SECRET
} = require("../config");


// require('./passport');
// const BasicStrategy = require('passport-http').BasicStrategy;


router.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.create({
            username: req.body.username,
            password: req.body.password
        })
        .then(user => {
            console.log("signup suc")
            const body = user.serialize();
            // Generate jwt with the contents of user object
            const token = jwt.sign(body, JWT_SECRET);
            return res.json({
                token
            });
        })
        .catch(err => {
            if (err.code === 11000) {
                res.statusMessage = "Username or Email already exists.";
                return res.status(400).json(res.statusMessage);
            }
            alert(err);
            res.status(500).json(err)
        });
});

router.post("/login", function (req, res, next) {
    console.log("inside log req=",req.body);
    passport.authenticate("login", {
        session: false
    }, (err, user, info) => {
        console.log("inside login user=",user);
        console.log("inside login info=",info);
        console.log("inside login error=",err);
        if (err || !user) {
            res.statusMessage = info.message;
            return res.status(400).json(res.statusMessage);
        }

        req.login(user, {
            session: false
        }, err => {
            if (err) {
                console.log("login fail");
                res.status(400).json(err);
            }
            console.log("login suc");
            const body = user.serialize();
            console.log(body);
            // Generate jwt with the contents of user object
            const token = jwt.sign(body, JWT_SECRET);
            console.log(token);
            return res.json({
                token
            });
        });
    })
    (req,res,next)
},
function(err, req, res, next) {
  // failure in login test route
  return res.send({'status':'err','message':err.message});
});

router.get("/userLoggedIn", function (req, res) {
    Logged.find({})
        .then(users => {
            res.json({
                loggedIn: users
            });
        })
        .catch(err => {
            return res.status(400).json(res.statusMessage);
        });
});

router.post("/userLoggedIn", function (req, res) {
    Logged.create({
            usersLoggedIn: req.body.user
        })
        .then(user => {
            Logged.find({})
                .then(users => {
                    res.json({
                        loggedIn: users
                    });
                });
        })
        .catch(err => {
            return res.status(400).json(res.statusMessage);
        });
});

router.delete("/userLoggedIn", function (req, res) {
    console.log(req.body.user);
    Logged.deleteMany({
            usersLoggedIn: req.body.user
        })
        .then(user => {
            console.log(`Deleted ${user}!`);
        })
        .catch(err => {
            return res.status(400).json(res.statusMessage);
        });
});

module.exports = router;
