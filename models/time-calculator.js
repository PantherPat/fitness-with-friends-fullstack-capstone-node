"use strict";

const mongoose = require('mongoose');

// endpoints for time-calculator. Tracks distance and time
const timeCalculatorSchema = new mongoose.Schema({
    distance: {
        type: String
    },
    time: {
        type: String
    },
    avgTime: {
        type: String
    }
});
const timeCalculator = mongoose.model('time-calculator', timeCalculatorSchema);

module.exports = timeCalculator;
