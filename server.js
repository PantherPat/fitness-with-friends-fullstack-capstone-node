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
const {
    PORT,
    DATABASE_NAME,
    CLIENT_ORIGIN
} = require('./config');

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

app.get('/get-leaderboard-scores', function (req, res) {
    console.log("we get here")
    
    timeCalculator
        .find({})
        
        // .sort("avgTime")
        .then(function (leaderBoardScores) {
            console.log(leaderBoardScores)
            let totalTime = 0;
            let totalDistance = 0;
            let sumOfAvgTime = 0;
            
            for(let i = 0; i < leaderBoardScores.length; i++){
                totalTime += parseFloat(leaderBoardScores[i].time)
                totalDistance += parseFloat(leaderBoardScores[i].distance)
                sumOfAvgTime += parseFloat(leaderBoardScores[i].avgTime)
            }
            console.log(totalTime,totalDistance,sumOfAvgTime)
            res.json({
                totalTime,totalDistance,sumOfAvgTime
            });
        })

        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Data set not found'
            });
        });
});

app.post('/time-calculator', (req, res) => {

    let distance = req.body.distance;
    let time = req.body.time;
    console.log(distance, time, "LOOK HERE");
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