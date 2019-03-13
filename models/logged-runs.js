"use strict";

const mongoose = require('mongoose');


const loggedRunasSchema = new mongoose.Schema({
    distance: {
        type: String
    },
    time:{
        type:String
    }
});
const loggedRuns = mongoose.model('logged-runs', loggedRunasSchema);

module.exports = loggedRuns;
