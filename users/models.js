'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    people: [{peopleType: mongoose.Schema.Types.ObjectId, ref: "Person", required: true}]
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        people: this.people
    };
};

userSchema.pre('find', function(next) {
    this.populate('people');
    next();
})

userSchema.pre('findById', function(next) {
    this.populate('people');
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = {User};