'use strict';
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Person } = require('./people');
const { User } = require('./users');

const app = express();
app.use(express.static('public'));
app.use(express.json());