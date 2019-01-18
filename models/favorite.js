"use strict";

const mongoose = require('mongoose');


const favoriteSchema = new mongoose.Schema({
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
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
