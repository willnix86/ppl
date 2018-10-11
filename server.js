'use strict';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { People } = require('./people/models');
const { User } = require('./users/models');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(morgan("common"));

//get users
app.get('/users', (req, res) => {
    User.find({}, '-__v')
    .then(users => {
        res.json(
            users.map((users) => users.serialize())
        );
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    });
});

// get users by ID
app.get('/users/:id', (req, res) => {
    User.findById(req.params.id, '-__v')
    .then(user => {
        res.json(user.serialize());
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    })
})

// get people
app.get('/people', (req, res) => {
    People.find({}, '-__v')
    .limit(10)
    .then(people => {
        res.json(
            people.map((people) => people.serialize())
        );
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    });
});

// get person by ID

// post new person

// post new user
app.post('/users', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'userName', 'password'];
    for (let i = 0; i < requiredFields; i++){
        let field = requiredFields[i];
        if (!(field in req.body)) {
            let message = `Missing ${field} in request parameters`;
            console.err(message);
            res.status(400).send(message);
        }
    }
    User.findOne({userName: req.body.userName})
    .then(user => {
        if (user) {
            let message = `Username (${req.body.userName}) is already taken.`;
            console.error(message);
            res.status(400).send(message);
        } else {
            User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: req.body.password,
                people: req.body.people,
                meetings: req.body.meetings
            })
            .then(user => {
                res.status(201).json(user.serialize());
            })
        }
    })
    .catch(err => res.status(500).send({message: 'Internal server error. Please try again later.'}))
});

// post new goal to person

// post new activity to person

// post new note to person

// post new file

// post new meeting to person

// put person by ID

// put user by ID

// put goal by id and person id

// put activity by id and person id

// put note by id and person id

// put file by id

// put meeting by id and person id

// delete person by ID

// delete user by ID

//.........THE FOLLOWING CAN USE $PULL..........//

// delete goal by id and person id

// delete activity by id and person id

// delete note by id and person id

// delete file by id

// delete meeting by id and person id



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