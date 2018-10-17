'use strict';

const mongoose = require('mongoose');

const filesSchema = mongoose.Schema({
    name: {type: String, required: true},
    person: {type: mongoose.Schema.Types.ObjectId, ref: 'People'},
    extension: {type: String, required: true}
});

filesSchema.pre('find', function(next) {
    this.populate('person', {files: 0, goals: 0, notes: 0, user: 0, __v: 0});
    next();
})

filesSchema.pre('findOne', function(next) {
    this.populate('person', {files: 0, goals: 0, notes: 0, user: 0, __v: 0});
    next();
})


const Files = mongoose.model('Files', filesSchema);

module.exports = {Files};