'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { User } = require('../users/models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { seeders } = require('./seeders');

chai.use(chaiHttp);

describe('Users API Resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        const userData = seeders.seedUserData();
        return User.insertMany(userData)
    });

    afterEach(function() {
        return seeders.tearDownDb();
    });

    after(function() {
        return closeServer();
    })

    // GET ENDPOINTS
    describe('GET endpoints', function() {

        // GET ALL USERS
        it('should return all users from database', function() {
            let res;
            return chai.request(app)
            .get('/users')
            .then(function(_res) {
                res = _res;
                res.should.have.status(200);
                res.body.should.have.lengthOf.at.least(1);
                return User.countDocuments();
            })
            .then(function(count) {
                res.body.should.have.lengthOf(count);
            })
        });
        
        it('should return users with all the right fields', function() {
            let resUser;
            return chai.request(app)
            .get('/users')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.lengthOf.at.least(1);

                res.body.forEach(function(user) {
                    user.should.be.a('object');
                    user.should.include.keys('id', 'firstName', 'lastName', 'userName');
                });

                resUser = res.body[0];
                return User.findById(resUser.id);
            })
            .then(function(user) {
                resUser.id.should.equal(user.id);
                resUser.firstName.should.equal(user.firstName);
                resUser.lastName.should.equal(user.lastName);
                resUser.userName.should.equal(user.userName);
            })
        });

        // GET USER BY ID
        it('should return the correct user from database', function() {
            let id;
            return User.findOne()
            .then(function(user) {
                id = user.id;
                return chai.request(app)
                .get(`/users/${id}`)
            })
            .then(function(res) {
                res.should.have.status(200);
                res.body.id.should.equal(id);
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'firstName', 'lastName', 'userName');
            });
        })

    })

    // POST ENDPOINTS
    describe('POST endpoints', function() {
    
        // POST NEW USER
        it('should add a new user', function() {
            const newUser = seeders.generateUserData();
            let res;
            return chai.request(app)
            .post('/users')
            .send(newUser)
            .then(function(_res) {
                res = _res;
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'firstName', 'lastName', 'userName');
                res.body.firstName.should.equal(newUser.firstName);
                res.body.lastName.should.equal(newUser.lastName);
                res.body.userName.should.equal(newUser.userName);
                res.body.id.should.not.be.null;
                return User.findById(res.body.id);
            })
            .then(function(user) {
                user.firstName.should.equal(newUser.firstName);
                user.lastName.should.equal(newUser.lastName);
                user.userName.should.equal(newUser.userName);
            });
        });

    })

    
})