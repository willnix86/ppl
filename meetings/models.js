'use strict';

const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    person: {type: mongoose.Schema.Types.ObjectId, ref: 'People'},
    date: {type: Date, required: true}
});

meetingSchema.pre('find', function(next) {
    this.populate('host', '-userName -password -__v');
    this.populate('person', '-files -goals -notes -user -__v');
    next();
})

meetingSchema.pre('findOne', function(next) {
    this.populate('host', '-userName -password -__v');
    this.populate('person', '-files -goals -notes -user -__v');
    next();
})


const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = {Meeting};