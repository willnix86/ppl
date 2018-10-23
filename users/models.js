'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName
    };
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };