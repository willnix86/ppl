const express = require('express');
const { Meeting } = require('./models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//get all meetings user is involved in
router.get('/:id', (req, res) => {
    // User.find({}, '-__v')
    // .limit(10)
    // .then(users => {
    //     res.json(
    //         users.map((users) => users.serialize())
    //     );
    // })
    // .catch(err => {
    //     console.error(err);
    //     res.status(500).json({message: "Internal server error, please try again later."})
    // });
});

// create a new meeting
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['host', 'person'];
    for (let i = 0; i < requiredFields; i++){
        let field = requiredFields[i];
        if (!(field in req.body)) {
            let message = `Missing ${field} in request parameters`;
            console.err(message);
            res.status(400).send(message);
        }
    }
    Meeting.create({
        host: req.body.host,
        person: req.body.person
    })
    .then(user => {
        res.status(201).json(user.serialize());
    })
    .catch(err => res.status(500).send({message: 'Internal server error. Please try again later.'}))
});

module.exports = router;