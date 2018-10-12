'use strict';

const mongoose = require('mongoose');

// MAKE MEETINGS IT'S OWN COLLECTION

const meetingSchema = mongoose.Schema({
    person: {type: mongoose.Schema.Types.ObjectId, ref: 'People'},
    date: {type: Date, required: true}
});

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    meetings: [meetingSchema]
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        meetings: this.meetings
    };
};

userSchema.pre('find', function(next) {
    this.populate('meetings.person', {files: 0, goals: 0, notes: 0, user: 0, __v: 0});
    next();
})

userSchema.pre('findOne', function(next) {
    this.populate('meetings.person', {files: 0, goals: 0, notes: 0, user: 0, __v: 0});
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = {User};