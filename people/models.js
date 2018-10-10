'use strict';

const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

const goalSchema = mongoose.Schema({
    goal: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    completeBy: {type: Date, required: true},
    completed: {type: Boolean, default: false}
});

// const fileSchema <----- COME BACK TO!

const meetingSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    person: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true},
    date: {type: Date, required: true}
});

const personSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
    },
    notes: [noteSchema],
    goals: [goalSchema],
    //files: [fileSchema],
    meetings: [meetingSchema],
});

personSchema.pre('find', function(next) {
    this.populate('user');
    next();
})

personSchema.pre('findById', function(next) {
    this.populate('user');
    next();
})

meetingSchema.virtual('personName').get(function() {
    return `${this.person.firstName} ${this.person.lastName}`.trim();
});

meetingSchema.virtual('userName').get(function() {
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

meetingSchema.methods.serialize = function() {
    return {
        user: this.userName,
        person: this.personName,
        date: this.date
    };
};

const Person = mongoose.model('Person', personSchema);

module.exports = {Person};