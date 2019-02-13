"use strict";

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
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

const Videos = mongoose.model('Video', videoSchema);

exports.Videos = Videos;
