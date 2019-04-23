const request = require("request");
//const User = require('./models/user');
//const savedWorkout = require('./models/saved-workouts');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const timeCalculator = require('./models/time-calculator');
const BasicStrategy = require('passport-http').BasicStrategy;
const express = require('express');
const app = express();
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyCclIq-RF7zhCJ_JnoXJBLdGvz-v2nzCB0');
const { PORT, DATABASE_NAME, CLIENT_ORIGIN } = require('./config');

const auth = require('./routers/auth');
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/auth', auth);
require('./passport');


mongoose.Promise = global.Promise;

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server = undefined;

function runServer(urlToUse) {
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                console.log(`Listening on localhost:${config.PORT}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

// ---------------USER ENDPOINTS-------------------------------------
// POST -----------------------------------
// creating a new user
//app.post('/users/create', (req, res) => {
//
//    //take the name, username and the password from the ajax api call
//    let username = req.body.username;
//    let password = req.body.password;
//
//
//    //exclude extra spaces from the username and password
//    //how do I do this with React?
//
//    //create an encryption key
//    bcrypt.genSalt(10, (err, salt) => {
//
//        //if creating the key returns an error...
//        if (err) {
//
//            //display it
//            return res.status(500).json({
//                message: 'Encryption Key Error'
//            });
//        }
//
//        //using the encryption key above generate an encrypted pasword
//        bcrypt.hash(password, salt, (err, hash) => {
//
//            //if creating the ncrypted pasword returns an error..
//            if (err) {
//
//                //display it
//                return res.status(500).json({
//                    message: 'Encrypted Password Error'
//                });
//            }
//
//            //using the mongoose DB schema, connect to the database and create the new user
//            User.create({
//                username,
//                password: hash,
//            }, (err, item) => {
//
//                //if creating a new user in the DB returns an error..
//                if (err) {
//                    //display it
//                    return res.status(500).json({
//                        message: 'Creating New User in DB Error'
//                    });
//                }
//                //if creating a new user in the DB is succefull
//                if (item) {
//
//                    //display the new user
//                    console.log(`User \`${username}\` created.`);
//                    return res.json(item);
//                }
//            });
//        });
//    });
//});
//
////// signing in a user
//app.post('/users/login', function (req, res) {
//
//    //take the username and the password from the ajax api call
//    const username = req.body.username;
//    const password = req.body.password;
//    console.log(username, password);
//    //using the mongoose DB schema, connect to the database and the user with the same username as above
//    User.findOne({
//        username: username
//    }, function (err, items) {
//
//        //if the there is an error connecting to the DB
//        if (err) {
//
//            //display it
//            return res.status(500).json({
//                message: "Error connecting to the database"
//            });
//        }
//        // if there are no users with that username
//        if (!items) {
//            //display it
//            return res.status(401).json({
//                message: "Invalid Username"
//            });
//        }
//        //if the username is found
//        else {
//
//            //try to validate the password
//            items.validatePassword(password, function (err, isValid) {
//
//                //if the connection to the DB to validate the password is not working
//                if (err) {
//
//                    //display error
//                    return res.status(500).json({
//                        message: "Could not connect to the DB to validate the password"
//                    });
//
//                }
//
//                //if the password is not valid
//                if (!isValid) {
//
//                    //display error
//                    return res.status(401).json({
//                        message: "Password Invalid"
//                    });
//                }
//                //if the password is valid
//                else {
//                    //return the logged in user
//                    console.log(`User \`${username}\` logged in.`);
//                    return res.json(items);
//                }
//            });
//        };
//    });
//});

app.get('/youtube/:keyword', function (req, res) {
    youtube.searchVideos('Centuries', 4)
        .then(results => {
            res.json(results);
        })
        .catch(function (err) {
            res.status(500).json({
                message: 'Err'
            });
        });

});

// -------------entry ENDPOINTS------------------------------------------------
// POST -----------------------------------------
// saving video to saved workout section
app.post('/saved-workout/create', (req, res) => {
    let videoId = req.body.videoId;
    let title = req.body.url;
    let thumbnail = req.body.thumbnail;
    let user = req.body.user;

    savedVideo.create({
            videoId,
            title,
            thumbnail,
            user
        },
        (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error saving recipe to favorites'
                });
            }
            if (item) {
                return res.json(item);
            }
        });
});


app.get('/get-leaderboard-scores', function (req, res) {
    timeCalculator
    .find()
    .sort('avgTime')
        .then(function (leaderBoardScores) {
            console.log(leaderBoardScores);
            res.json({
                leaderBoardScores
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});

app.post('/time-calculator', (req, res) => {
    console.log("HELLO")
    let distance = req.body.distance;
    let time = req.body.time;
    console.log(distance, time,"LOOK HERE");
    timeCalculator.create({
            distance,
            time,
            avgTime: (distance / time)
        },
        (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error logging runs to tracked information'
                });
            }
            if (item) {
                return res.json(item);
            }
        });
});

app.get('/time-calculator/:loggedInUserName',
    function (req, res) {
        console.log(req.params.loggedInUserName)
        timeCalculator.find({
                logUser: req.params.logUser
            })
            .then(function (loggedRuns) {
                res.json({
                    timeCalculator
                });
            })
            .catch(function (err) {
                console.error(err);
                res.status(500).json({
                    message: 'Internal server error'
                });
            });
    });


//
app.get('/saved-workouts/:loggedInUserName', function (req, res) {
    console.log(req.params.loggedInUserName)
    savedWorkouts
        .find({
            logUser: req.params.logUser
        })
        .then(function (youtubeVideos) {
            res.json({
                youtubeVideos
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});
//
//
//
//
//
//
//
//
//
// DELETE ----------------------------------------
// deleting an achievement by id
app.delete('/saved-workout/:id', function (req, res) {
    savedWorkout.findByIdAndRemove(req.params.id).exec().then(function (savedVideo) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});
//
// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;
