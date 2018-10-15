'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { User } = require('../users/models');
const { People } = require('../people/models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { seeders } = require('./seeders');

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
    context('Generic GET endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserData();
            return Promise.all(
                [
                    User.insertMany(userData),
                    seeders.seedPeopleData(userData)
                ]
            );
        });

        // GET ALL PEOPLE
        it('should return all people from the database', function(){
            let res;
            return chai.request(app)
            .get('/people')
            .then(function(_res) {
                res = _res;
                res.should.have.status(200);
                res.body.should.have.lengthOf.at.least(1);
                return People.countDocuments();
            })
            .then(function(count) {
                res.body.should.have.lengthOf(count);
            })
        });

        it('should return people with all the right fields', function() {
            let resPerson;
            return chai.request(app)
            .get('/people')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.lengthOf.at.least(1);
                res.body.forEach(function(person){
                    person.should.be.a('object');
                    person.should.include.keys('id', 'firstName', 'lastName', 'user', 'notes', 'goals');
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
                //resPerson.user.should.equal(person.user);
            })
        });

        // GET PERSON BY ID
        it('should return the correct person from database', function() {
            let id;
            People.findOne()
            .populate('user', '-password -userName -__v -meetings')
            .then(function(person) {
                id = person.id;
                return chai.request(app)
                .get(`/people/${id}`)
            })
            .then(function(res) {
                res.should.have.status(200);
                res.body.id.should.equal(id);
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'firstName', 'lastName', 'user', 'notes', 'goals', 'files');
                res.body.notes.should.be.a('array');
                res.body.goals.should.be.a('array');
                res.body.files.should.be.a('array');
            })
        });

    });

    context('Specialized GET endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserWithSpecificData();
            return Promise.all(
                [
                    User.insertMany(userData),
                    seeders.seedPeopleWithSpecificUsers(userData)
                ]
            );
        });

        // GET ALL PEOPLE ASSOCIATED WITH SPECIFIC USER
        it('should return the correct people from the database', function() {
            let id = "5bbfbe91f60377afff6deca9";
            let res;
            return chai.request(app)
            .get(`/people/userId/${id}`)
            .then(function(_res) {
                res = _res;
                res.should.have.status(200);
                res.body.should.have.lengthOf.at.least(1);
                return People.countDocuments();
            })
            .then(function(count) {
                res.body.should.have.lengthOf(count);
            })
        });

        it('should return people with all the right fields', function() {
            let id = "5bbfbe91f60377afff6deca9";
            let resPerson;
            return chai.request(app)
            .get(`/people/userId/${id}`)
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
                //resPerson.user.should.equal(person.user);
            })
        });

    })

// POST ENDPOINTS
    context('Generic POST endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserData();
            return Promise.all(
                [
                    User.insertMany(userData),
                    seeders.seedPeopleData(userData)
                ]
            );
        });

        // POST NEW PERSON
        it('should add a new person', function() {
            const userData = seeders.seedUserData();
            const newPerson = seeders.generatePeopleData(userData, 0);
            let res;
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
                //person.user.should.equal(newPerson.user);
            });
        });

    });

// PUT ENDPOINT
    context('Generic PUT endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserData();
            return Promise.all(
                [
                    User.insertMany(userData),
                    seeders.seedPeopleData(userData)
                ]
            );
        });

        it('should update people in the database', function() {
            const updateData = seeders.generatePeopleUpdateData();
            return chai.request(app)
            .get('/people')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                .put(`/people/${updateData.id}`)
                .send(updateData)
            })
            .then(function(res) {
                res.should.have.status(204);
                People.findById(updateData.id)
                .then(function(person) {
                    person.lastName.should.equal(updateData.lastName);
                    person.password.should.equal(updateData.password);
                });
            })
        });
    });

// DELETE ENDPOINTS
    context('DELETE endpoints', function() {

        beforeEach(function() {
            const userData = seeders.seedUserData();
            return Promise.all(
                [
                    User.insertMany(userData),
                    seeders.seedPeopleData(userData)
                ]
            );
        });

        it('should remove correct user from database', function() {
            let person;
            return (
                chai.request(app)
                .get('/people')
                .then(function(res) {
                    person = res.body[0].id;
                    return chai.request(app)
                    .delete(`/people/${person}`)
                    .then(function(res){
                        res.should.have.status(204);
                    })
                })
                .then(function() {
                    return chai.request(app)
                    .get(`/people/${person}`)
                    .then(function(res) {
                        res.should.have.status(500);
                    })
                })
            )
        })
    })
});