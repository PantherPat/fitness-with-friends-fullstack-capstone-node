"use strict";

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    searchInput: {
        type: String,
        required: false
    },
    loggedInUserName: {
        type: String,
        required: false
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
