'use strict';

const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    person: {type: mongoose.Schema.Types.ObjectId, ref: 'People'},
    date: {type: Date, required: true}
});

meetingSchema.pre('find', function(next) {
    this.populate('person', {files: 0, goals: 0, notes: 0, user: 0, __v: 0});
    this.populate('host', {userName: 0, password: 0, __v: 0});
    next();
})

meetingSchema.pre('findOne', function(next) {
    this.populate('person', {files: 0, goals: 0, notes: 0, user: 0, __v: 0});
    this.populate('host', {userName: 0, password: 0, __v: 0});
    next();
})


const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = {Meeting};