const request = require("request");
const User = require('./models/user');
const Recipe = require('./models/recipe');
const Favorite = require('./models/favorite');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));


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
app.post('/users/create', (req, res) => {

    //take the name, username and the password from the ajax api call
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    //exclude extra spaces from the username and password
    username = username.trim();
    password = password.trim();

    //create an encryption key
    bcrypt.genSalt(10, (err, salt) => {

        //if creating the key returns an error...
        if (err) {

            //display it
            return res.status(500).json({
                message: 'Encryption Key Error'
            });
        }

        //using the encryption key above generate an encrypted pasword
        bcrypt.hash(password, salt, (err, hash) => {

            //if creating the ncrypted pasword returns an error..
            if (err) {

                //display it
                return res.status(500).json({
                    message: 'Encrypted Password Error'
                });
            }

            //using the mongoose DB schema, connect to the database and create the new user
            User.create({
                name,
                username,
                password: hash,
            }, (err, item) => {

                //if creating a new user in the DB returns an error..
                if (err) {
                    //display it
                    return res.status(500).json({
                        message: 'Creating New User in DB Error'
                    });
                }
                //if creating a new user in the DB is succefull
                if (item) {

                    //display the new user
                    console.log(`User \`${username}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});

// signing in a user
app.post('/users/login', function (req, res) {

    //take the username and the password from the ajax api call
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    //using the mongoose DB schema, connect to the database and the user with the same username as above
    User.findOne({
        username: username
    }, function (err, items) {

        //if the there is an error connecting to the DB
        if (err) {

            //display it
            return res.status(500).json({
                message: "Error connecting to the database"
            });
        }
        // if there are no users with that username
        if (!items) {
            //display it
            return res.status(401).json({
                message: "Invalid Username"
            });
        }
        //if the username is found
        else {

            //try to validate the password
            items.validatePassword(password, function (err, isValid) {

                //if the connection to the DB to validate the password is not working
                if (err) {

                    //display error
                    return res.status(500).json({
                        message: "Could not connect to the DB to validate the password"
                    });

                }

                //if the password is not valid
                if (!isValid) {

                    //display error
                    return res.status(401).json({
                        message: "Password Invalid"
                    });
                }
                //if the password is valid
                else {
                    //return the logged in user
                    console.log(`User \`${username}\` logged in.`);
                    return res.json(items);
                }
            });
        };
    });
});

app.get('/edamam/:ingredient', function (req, res) {

    request({
        method: 'GET',
        uri: 'https://api.edamam.com/search?q=' + req.params.ingredient + '&app_id=6571a93b&app_key=fb779a44b1eb7dc5918482cf5f2f5c0f&from=0&to=15&calories=591-722&health=alcohol-free',
        gzip: true
    }, function (error, response, body) {
        // Use external API results to save them in the database
        res.json(JSON.parse(body));
        //        res.json(body);
    });

});

// -------------entry ENDPOINTS------------------------------------------------
// POST -----------------------------------------
// creating a new Entry
app.post('/favorite/create', (req, res) => {
    let label = req.body.label;
    let url = req.body.url;
    let loggedInUserName = req.body.loggedInUserName;
    console.log(label, url, loggedInUserName);

    Favorite.create({
            label,
            url,
            loggedInUserName
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

app.get('/favorite/get/:loggedInUserName', function (req, res) {

    Favorite
        .find({
            loggedInUserName: req.params.loggedInUserName
        })
        .then(function (favoritesOutput) {
            res.json({
                favoritesOutput
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});









// DELETE ----------------------------------------
// deleting an achievement by id
app.delete('/favorite/delete/:id', function (req, res) {
    Favorite.findByIdAndRemove(req.params.id).exec().then(function (favorite) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
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
