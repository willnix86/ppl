const express = require('express');
const { People } = require('./models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// get people
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
    People.findById(req.params.id, '-__v')
    .then(person => {
        res.json(person.serialize());
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    })
})

// create a new person
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'user'];
    for (let i = 0; i < requiredFields; i++) {
        let field = requiredFields[i];
        if (!(field in req.body)) {
            let message = `Missing ${field} in request parameters`;
            console.error(message);
            res.status(400).send(message);
        }
    }
    People.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        user: req.body.user,
        notes: req.body.notes,
        goals: req.body.goals
    })
    .then(person => {
        res.status(201).json(person.serialize());
    })
    .catch(err => res.status(500).send({message: 'Internal server error. Please try again later.'}))
})

module.exports = router;