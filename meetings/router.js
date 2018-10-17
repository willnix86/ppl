const express = require('express');
const { Meeting } = require('./models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// GET ALL MEETINGS
router.get('/', (req, res) => {
    Meeting.find({}, '-__v')
    .then(meeting => {
        res.json(meeting);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    });
});

// GET ALL MEETING BY USER ID
router.get('/userId/:id', (req, res) => {
    Meeting.find({host: req.params.id}, '-__v')
    .then(meeting => {
        res.json(meeting);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    });
});

// GET ALL MEETINGS BY PERSON ID
router.get('/personId/:id', (req, res) => {
    Meeting.find({person: req.params.id}, '-__v')
    .then(meeting => {
        res.json(meeting);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error, please try again later."})
    });
});

// CREATE A NEW MEETING
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['host', 'person', 'date'];
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
        person: req.body.person,
        date: req.body.date
    })
    .then(meeting => {
        res.status(201).json(meeting);
    })
    .catch(err => res.status(500).send({message: 'Internal server error. Please try again later.'}))
});

// EDIT A MEETING BY ID
router.put('/:id', jsonParser, (req, res) => {

    if (!(req.params.id && req.body.id === req.body.id)) {
        let message = 'Request path id and request body id must match';
        console.error(message);
        res.status(400).send(message);
    }

    let updated = {};
    const updatableFields = ['host', 'person', 'date'];

    updatableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Meeting.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true})
    .then(updatedMeeting => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong.'}))
})

// DELETE A MEETING BY ID
router.delete('/:id', (req, res) => {
    Meeting.findByIdAndRemove(req.params.id)
    .then(() => {
        console.log(`Deleted meeting with id (${req.params.id})`);
        res.status(204).end();
        })
    .catch(err => res.status(500).json({message: 'Internal server error.'}));
});


module.exports = router;