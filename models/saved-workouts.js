"use strict";

const mongoose = require('mongoose');


const savedWorkoutsSchema = new mongoose.Schema({
    videoId: {
        type: String
    },
    title:{
        type:String
    },
    thumbnail:{
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const savedWorkouts = mongoose.model('saved-workouts', savedWorkoutsSchema);

module.exports = savedWorkouts;
