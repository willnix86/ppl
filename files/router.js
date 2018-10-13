const express = require('express');
const { File } = require('./models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//get all files associated with a person
router.get('/:id', (req, res) => {
    // Meeting.find({host: req.params.id}, '-__v')
    // .then(meeting => {
    //     res.json(meeting);
    // })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    });
});

// upload a new file
router.post('/', jsonParser, (req, res) => {
    // const requiredFields = ['host', 'person'];
    // for (let i = 0; i < requiredFields; i++){
    //     let field = requiredFields[i];
    //     if (!(field in req.body)) {
    //         let message = `Missing ${field} in request parameters`;
    //         console.err(message);
    //         res.status(400).send(message);
    //     }
    // }
    // Meeting.create({
    //     host: req.body.host,
    //     person: req.body.person,
    //     date: req.body.date
    // })
    // .then(meeting => {
    //     res.status(201).json(meeting);
    // })
    .catch(err => res.status(500).send({message: 'Internal server error. Please try again later.'}))
});

// delete a file

module.exports = router;