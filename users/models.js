'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    people: [peopleSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };