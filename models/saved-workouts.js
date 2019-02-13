"use strict";

const mongoose = require('mongoose');


const savedWorkoutsSchema = new mongoose.Schema({
    label: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    loggedInUserName: {
        type: String,
        required: false
    }
});
const savedWorkouts = mongoose.model('saved-workouts', savedWorkoutsSchema);

module.exports = savedWorkouts;
