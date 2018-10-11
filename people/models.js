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

const peopleSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    notes: [noteSchema],
    goals: [goalSchema],
    //files: [fileSchema]
});

peopleSchema.pre('find', function(next) {
    this.populate('user');
    next();
})

peopleSchema.pre('findById', function(next) {
    this.populate('user');
    next();
})

const People = mongoose.model('People', peopleSchema);

module.exports = {People};