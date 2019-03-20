"use strict";

const mongoose = require('mongoose');


const ShowSavedWorkoutsSchema = new mongoose.Schema({
    videoId: {
        type: String
    },
    title: {
        type: String
    },
    thumbnail: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const ShowSavedWorkouts = mongoose.model('show-saved-workouts', ShowSavedWorkoutsSchema);

module.exports = ShowSavedWorkouts;
