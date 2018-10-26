'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { User } = require('../users/models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { seeders } = require('./seeders');

const config = require('../config');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

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

        // GET USER BY ID
        it('should return the correct user from database', function() {
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
                .get(`/users/protected/${id}`)
                .set('Authorization', `Bearer ${token}`)
            })
            .then(function(res) {
                res.should.have.status(200);
                res.body.id.should.equal(id);
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'firstName', 'lastName', 'userName');
            });
        })

        it('should return user with all the right fields', function() {
            let id;
            let token;
            let resUser;
            let user;
            return User.findOne()
            .then(function(user) {
                resUser = user;
                id = user.id;
                token = jwt.sign({user}, config.JWT_SECRET, {
                    subject: user.userName,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256'
                    });
                return chai.request(app)
                .get(`/users/protected/${id}`)
                .set('Authorization', `Bearer ${token}`)
            })
            .then(function(res) {
                resUser = res.body;
                resUser.id.should.equal(res.body.id);
                resUser.firstName.should.equal(res.body.firstName);
                resUser.lastName.should.equal(res.body.lastName);
                resUser.userName.should.equal(res.body.userName);
            })
        });

    });

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

    });

    // PUT ENDPOINTS
    describe('PUT endpoints', function() {
        it('should update users in the database', function() {
            const updateData = seeders.generateUserUpdateData();
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
                .get(`/users/protected/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .then(function(res) {
                    updateData.id = res.body.id;
                    return chai.request(app)
                    .put(`/users/${updateData.id}`)
                    .send(updateData)
                })
                .then(function(res) {
                    res.should.have.status(204);
                    User.findById(updateData.id)
                    .then(function(user) {
                        user.lastName.should.equal(updateData.lastName);
                        user.password.should.equal(updateData.password);
                    });
                })
            });
        });

    });

    // DELETE ENDPOINTS
    describe('DELETE endpoints', function() {
        it('should remove correct user from database', function() {
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
                .get(`/users/protected/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .then(function(res) {
                    user = res.body.id;
                    return chai.request(app)
                    .delete(`/users/${user}`)
                    .then(function(res){
                        res.should.have.status(204);
                    })
                })
                .then(function() {
                    return chai.request(app)
                    .get(`/users/protected/${id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .then(function(res) {
                        res.should.have.status(500);
                    })
                    .then(function() {
                        return chai.request(app)
                        .get(`/people/user/${user}`)
                        .then(function(res) {
                            res.should.have.status(404);
                        })
                    })
                })
            })
        })
    });

});