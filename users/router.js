const express = require('express');
const { User } = require('./models');
const { People } = require('../people/models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//GET ALL USERS
router.get('/', (req, res) => {
    User.find(
        {}, '-__v'
    )
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

// GET A USER BY ID
router.get('/:id', (req, res) => {
    User.findOne(
        { _id: req.params.id }, '-__v'
    )
    .then(user => {
        res.json(user.serialize());
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    })
});

// CREATE A NEW USER
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'userName', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        let field = requiredFields[i];
        if (!(field in req.body)) {
            let message = `Missing ${field} in request parameters`;
            console.error(message);
            res.status(400).send(message);
        }
    }
    User.findOne(
        {userName: req.body.userName}
    )
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

// EDIT A USER BY ID
router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id === req.body.id)) {
        let message = 'Request path id and request body id values must match';
        console.error(message);
        res.status(400).send(message);
    }

    const updated = {};
    const updatableFields = ['firstName', 'lastName', 'password'];

    updatableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    User
    .findOneAndUpdate(
        {_id: req.params.id},
        {$set: updated},
        {new: true}
    )
    .then(updatedUser => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong.'}));
});

// DELETE A USER BY ID (AND REMOVE ASSOCIATED PEOPLE ALONG WITH IT)
router.delete('/:id', (req, res) => {
    People.remove(
        {user: req.params.id}
    )
    .then(() => {
        User.findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleted user with id (${req.params.id})`);
            res.status(204).end();
            })
    })
    .catch(err => res.status(500).json({message: 'Internal server error.'}));
});

module.exports = router;