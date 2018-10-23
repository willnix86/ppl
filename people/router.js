const express = require('express');
const passport = require('passport');
const { People } = require('./models');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const ObjectId = require('mongodb').ObjectID;
const jwtAuth = passport.authenticate('jwt', { session: false });

// GET ALL PEOPLE ASSIGNED TO PARTICULAR USER
router.get('/userId/:id', jwtAuth, (req,res) => {
    People.find(
        {user: req.params.id}, '-__v'
    )
    .sort({firstName: 1})
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
    for (let i = 0; i < requiredFields.length; i++) {
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

    People.findOneAndUpdate(
        {_id: req.params.id},
        {$set: updated},
        {new: true}
    )
    .then(updatedPerson => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong.'}))
});

// DELETE A PERSON BY ID
router.delete('/:id', (req, res) => {
    People.findByIdAndRemove(req.params.id)
    .then(() => {
        console.log(`Deleted user with id (${req.params.id})`);
        res.status(204).end();
        })
    .catch(err => res.status(500).json({message: 'Internal server error.'}));
});

// CREATE A NEW NOTE
router.put('/:id/addNotes', jsonParser, (req, res) => {
    
    if(!(req.params.id && req.body.id === req.body.id)) {
        let message = 'Request path id and request body id must match';
        console.error(message);
        res.status(400).send(message);
    }

    let newNote = {};
    const noteFields = ['content', 'createdAt'];

    noteFields.forEach(field => {
        if (field in req.body) {
            newNote[field] = req.body[field];
        }
    });

    People.findByIdAndUpdate(
        {_id: req.params.id},
        {$push: {notes: newNote}},
        {new: true}
    )
    .then(note => res.status(204).end())
    .catch(err => releaseEvents.status(500).json({message: 'Something went wrong.'}))
});

// DELETE A NOTE
router.put('/:personId/removeNotes/:noteId', (req, res) => {
    People.findOneAndUpdate(
        {_id: req.params.personId}, 
        { $pull: 
            {notes: { _id: req.params.noteId} }
        }
    )
    .then(() => {
        console.log(`Deleted note with id (${req.params.id})`);
        res.status(204).end();
    })
    .catch(err => res.json({message: 'Internal server error.'}));
})

// CREATE A NEW GOAL
router.put('/:id/addGoals', jsonParser, (req, res) => {
    
    if(!(req.params.id && req.body.id === req.body.id)) {
        let message = 'Request path id and request body id must match';
        console.error(message);
        res.status(400).send(message);
    }

    let newGoal = {};
    const goalFields = ['goal', 'createdAt', 'completeBy'];

    goalFields.forEach(field => {
        if (field in req.body) {
            newGoal[field] = req.body[field];
        }
    });

    People.findByIdAndUpdate(
        {_id: req.params.id},
        {$push: {goals: newGoal}},
        {new: true}
    )
    .then(goal => res.status(204).end())
    .catch(err => releaseEvents.status(500).json({message: 'Something went wrong.'}))
});

// MARK A GOAL AS COMPLETE
router.put('/:personId/goalStatus/:goalId', jsonParser, (req, res) => {

    People.findOneAndUpdate(
        { "_id": ObjectId(req.params.personId), "goals._id": ObjectId(req.params.goalId)}, 
        { 'goals.$.completed': req.body.completed },
        {new: true}
    )
    .then(updatedGoal => res.status(204).end())
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Something went wrong."})
    })

});

// DELETE A GOAL
router.put('/:personId/removeGoals/:goalId', (req, res) => {
    People.findOneAndUpdate(
        {_id: req.params.personId},
        { $pull: 
            {goals: { _id: req.params.goalId} } 
        }
    )
    .then(() => {
        console.log(`Deleted note with id (${req.params.id})`);
        res.status(204).end();
    })
    .catch(err => res.json({message: 'Internal server error.'}));
})

module.exports = router;