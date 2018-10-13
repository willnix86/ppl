const express = require('express');
const { People } = require('./models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// GET ALL PEOPLE
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
        res.status(500).json({message: 'Internal server error, please try again later.'})
    });
});

// GET ALL PEOPLE ASSIGNED TO PARTICULAR USER
router.get('/userId/:id', (req,res) => {
    People.find({user: req.params.id}, '-__v')
    .then(people => {
        res.json(
            people.map((people) => people.serialize())
        );
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error, please try again later.'})
    })
})

// GET PERSON BY ID
router.get('/:id', (req, res) => {
    People.findById(req.params.id, '-__v')
    .then(person => {
        res.json(person.serialize());
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error, please try again later.'})
    })
})

// CREATE A NEW PERSON
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

// EDIT A PERSON BY ID
router.put('/:id', jsonParser, (req, res) => {

    if (!(req.params.id && req.body.id === req.body.id)) {
        let message = 'Request path id and request body id must match';
        console.error(message);
        res.status(400).send(message);
    }

    let updated = {};
    const updatableFields = ['firstName', 'lastName', 'user'];

    updatableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    People.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true})
    .then(updatedPerson => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong.'}))
})

// DELETE A PERSON BY ID

module.exports = router;