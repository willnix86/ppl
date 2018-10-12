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

    beforeEach(function() {
        const userData = seeders.seedUserData();
        return Promise.all(
            [
                User.insertMany(userData),
                seeders.seedPeopleData(userData)
            ]
        );
        
    });

    afterEach(function() {
        return seeders.tearDownDb();
    });

    after(function() {
        return closeServer();
    });

// GET ENDPOINTS
    describe('GET endpoints', function() {

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
                console.log(res.body);
                res.body.id.should.equal(id);
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'firstName', 'lastName', 'user', 'notes', 'goals', 'files');
                res.body.notes.should.be.a('array');
                res.body.goals.should.be.a('array');
                res.body.files.should.be.a('array');
            })
        });

    });

// POST ENDPOINTS
    describe('POST endpoints', function() {

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
    
});