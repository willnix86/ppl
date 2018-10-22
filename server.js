'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const userRouter = require('./users/router');
const peopleRouter = require('./people/router');
const meetingRouter = require('./meetings/router');
const { authRouter, localStrategy, jwtStrategy } = require('./auth');
const { PORT, DATABASE_URL } = require('.config');

const app = express();
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use('/users', userRouter);
app.use('/people', peopleRouter);
app.use('/meetings', meetingRouter);
app.user('/auth', authRouter);

app.use(morgan("common"));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// CRUD for Files

// edit goal by id and person id

// edit note by id and person id

let server;

function runServer(databaseURL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseURL,
            { useNewUrlParser: true },
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                .listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err=> {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer };