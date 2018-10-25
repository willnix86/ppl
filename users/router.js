const express = require('express');
const { User } = require('./models');
const { People } = require('../people/models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

// CREATE A NEW USER
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'userName', 'password'];
    const missingField = requiredFields.find(
        field => !(field in req.body)
    );

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        })
    }

    const stringFields = ['firstName', 'lastName', 'password', 'userName'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string' 
    );

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected String',
            location: nonStringField
        })
    };

    const explicitlyTrimmedFields = ['userName', 'password'];
    const nonTrimmedField = explicitlyTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        })
    };

    const sizedFields = {
        userName: {
            min: 1
        },
        password: {
            min: 8,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(
        field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
    );

    const tooBigField = Object.keys(sizedFields).find(
        field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooBigField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
            ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
            : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooBigField
        });
    };

    let {userName, password, firstName = '', lastName = ''} = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();

    return User.find({userName: userName})
    .countDocuments()
    .then(count => {
        if (count > 0) {
            return Promise.reject({
                code: 422,
                reason: 'ValidationError',
                message: 'Username already taken',
                location: 'userName'
            });
        }
        
        return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                firstName,
                lastName,
                userName,
                password: hash
            })
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            console.log(err);
            res.status(500).json({code: 500, message: 'Internal server error'});
        });
});

// GET A USER BY ID
router.get('/protected/:id', jwtAuth, (req, res) => {
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