'use strict';
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { PORT, DATABASE_URL } = require('./config');
const userRouter = require('./users/router');
const peopleRouter = require('./people/router');
const meetingRouter = require('./meetings/router');

const app = express();

app.use(express.static('public'));
app.use('/users', userRouter);
app.use('/people', peopleRouter);
app.use('/meetings', meetingRouter);

app.use(morgan("common"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/views/user.html');
})

app.get('/person', (req, res) => {
    res.sendFile(__dirname + '/views/person.html');
})

// CRUD for Meetings

// CRUD for Files

// post new goal to person

// post new note to person

// put goal by id and person id

// put note by id and person id

// put meeting by id and person id

//.........THE FOLLOWING CAN USE $PULL..........//

// delete goal by id and person id

// delete note by id and person id


let server;

function runServer(databaseURL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseURL,
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