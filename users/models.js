'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    myPeople: [{type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true}]
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        myPeople: this.myPpl
    };
};

const User = mongoose.model('User', userSchema);

module.exports = {User};