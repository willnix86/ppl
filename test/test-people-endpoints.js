'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { User } = require('../users/models');
const { People } = require('../people/models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { seeders } = require('./seeders');

const config = require('../config');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

chai.use(chaiHttp);

describe('People API Resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    afterEach(function() {
        return seeders.tearDownDb();
    });

    after(function() {
        return closeServer();
    });

// GET ENDPOINTS
    context('GET endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserWithSpecificId();
            return Promise.all(
                [
                    User.insertMany(userData),
                    seeders.seedPeopleWithSpecificUserIds(userData)
                ]
            );
        });

        // GET ALL PEOPLE ASSOCIATED WITH SPECIFIC USER
        it('should return the correct people from the database', function() {
            let id = "5bbfbe91f60377afff6deca9";
            let token;
            let res;
            return User.findOne()
            .then(function(user) {
                token = jwt.sign({user}, config.JWT_SECRET, {
                    subject: user.userName,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256'
                    });
            return chai.request(app)
            .get(`/people/protected/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .then(function(_res) {
                res = _res;
                res.should.have.status(200);
                res.body.should.have.lengthOf.at.least(1);
                return People.countDocuments();
            })
            .then(function(count) {
                res.body.should.have.lengthOf(count);
            })
            })
        })

        it('should return people with all the right fields', function() {
            let id = "5bbfbe91f60377afff6deca9";
            let token;
            let resPerson;
            return User.findOne()
            .then(function(user) {
                token = jwt.sign({user}, config.JWT_SECRET, {
                    subject: user.userName,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256'
                    });
            return chai.request(app)
            .get(`/people/protected/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.lengthOf.at.least(1);
                res.body.forEach(function(person){
                    person.should.be.a('object');
                    person.should.include.keys('id', 'firstName', 'lastName');
                    person.user._id.should.equal(id);
                    person.notes.should.be.a('array');
                    person.goals.should.be.a('array');
                })
                resPerson = res.body[0];
                return People.findOne({_id: resPerson.id});
            })
            .then(function(person) {
                resPerson.id.should.equal(person.id);
                resPerson.firstName.should.equal(person.firstName);
                resPerson.lastName.should.equal(person.lastName);
                resPerson.user.firstName.should.equal(person.user.firstName);
                resPerson.user.lastName.should.equal(person.user.lastName);
            })
        });
        })
});

// POST ENDPOINTS
    context('Generic POST endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserData();
            return User.insertMany(userData);
        });

        // POST NEW PERSON
        it('should add a new person', function() {
            let res;
            let newPerson = {};
            return User.findOne()
            .then(function(user) {
                newPerson = seeders.generatePeopleData(user);
                return chai.request(app)
                .post('/people')
                .send(newPerson)
                .then(function(_res) {
                    res = _res;
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'firstName', 'lastName', 'user');
                    res.body.firstName.should.equal(newPerson.firstName);
                    res.body.lastName.should.equal(newPerson.lastName);
                    res.body.id.should.not.be.null;
                    return People.findOne({_id: res.body.id});
                })
                .then(function(person) {
                    person.firstName.should.equal(newPerson.firstName);
                    person.lastName.should.equal(newPerson.lastName);
                    person.user.firstName.should.equal(user.firstName);
                    person.user.lastName.should.equal(user.lastName);
                });
            }) 
        });

    });

// PUT ENDPOINT
    context('Generic PUT endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserData();
            return User.insertMany(userData)
            .then((docs) => seeders.seedPeopleData(docs));
        });

        it('should update people in the database', function() {
            const updateData = seeders.generatePeopleUpdateData();
            let id;
            let token;
            return User.findOne()
            .then(function(user) {
                id = user.id;
                token = jwt.sign({user}, config.JWT_SECRET, {
                    subject: user.userName,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256'
                    });
            return chai.request(app)
            .get(`/people/protected/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                .put(`/people/${updateData.id}`)
                .send(updateData)
            })
            .then(function(res) {
                res.should.have.status(204);
                return People.findById(updateData.id)
                .then(function(person) {
                    person.lastName.should.equal(updateData.lastName);
                });
            })
            });
        })
    });

// DELETE ENDPOINTS
    context('DELETE endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserData();
            return User.insertMany(userData)
            .then((docs) => seeders.seedPeopleData(docs));
        });

        it('should remove correct person from database', function() {
            let person;
            let id;
            let token;
            return User.findOne()
            .then(function(user) {
                id = user.id;
                token = jwt.sign({user}, config.JWT_SECRET, {
                    subject: user.userName,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256'
                    });
            return chai.request(app)
            .get(`/people/protected/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .then(function(res) {
                person = res.body[0];
                return chai.request(app)
                    .delete(`/people/${person.id}`)
                    .then(function(res){
                        res.should.have.status(204);
                    })
                })
                .then(function() {
                    return chai.request(app)
                    .get(`/people/${person.id}`)
                    .then(function(res) {
                        res.should.have.status(500);
                    })
                })
            })
        })
    })
});