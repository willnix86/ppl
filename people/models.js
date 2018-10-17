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
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    notes: [noteSchema],
    goals: [goalSchema],
    //files: [fileSchema]
});

peopleSchema.methods.serialize = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        user: this.user,
        notes: this.notes,
        goals: this.goals,
        files: this.files
    }
}

peopleSchema.pre('find', function(next) {
    this.populate('user', '-userName -password -__v');
    next();
})

peopleSchema.pre('findOne', function(next) {
    this.populate('user', '-userName -password -__v');
    next();
})

const People = mongoose.model('People', peopleSchema, 'people');

module.exports = {People};