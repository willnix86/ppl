const express = require('express');
const { User } = require('./models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//get users
router.get('/', (req, res) => {
    User.find({}, '-__v')
    .limit(10)
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

// get user by ID
router.get('/:id', (req, res) => {
    User.findOne( { _id: req.params.id }, '-__v')
    .then(user => {
        res.json(user.serialize());
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    })
});

// create a new user
router.post('/', jsonParser, (req, res) => {
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
                meetings: req.body.meetings
            })
            .then(user => {
                res.status(201).json(user.serialize());
            })
        }
    })
    .catch(err => res.status(500).send({message: 'Internal server error. Please try again later.'}))
});

module.exports = router;