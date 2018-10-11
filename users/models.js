'use strict';

const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    person: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    date: {type: Date, required: true}
});

meetingSchema.virtual('personName').get(function() {
    return `${this.person.firstName} ${this.person.lastName}`.trim();
});

meetingSchema.methods.serialize = function() {
    return {
        person: this.personName,
        date: this.date
    };
};

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    people: [{type: mongoose.Schema.Types.ObjectId, ref: "People", required: true}],
    meetings: [meetingSchema]
});

userSchema.virtual('userFullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
})

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        people: this.people,
        meetings: this.meetings
    };
};

userSchema.pre('find', function(next) {
    this.populate('people');
    this.populate('meetings');
    next();
})

userSchema.pre('findById', function(next) {
    this.populate('people');
    this.populate('meetings');
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = {User};