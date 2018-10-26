'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { User } = require('../users/models');
const { People } = require('../people/models');
const { Meeting } = require('../meetings/models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { seeders } = require('./seeders');

const config = require('../config');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

chai.use(chaiHttp);

describe('Meeting API Resource', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

// GET ENDPOINTS
    describe('Generic GET endpoints', function() {

        before(function() {
            const userData = seeders.seedFiveUsers();
            const peopleData = seeders.seedFivePeople();
            return Promise.all(
                [
                    User.insertMany(userData),
                    People.insertMany(peopleData),
                    seeders.generateAndSeedMeetingsData(userData, peopleData)
                ]
            );
        });
    
        after(function() {
            return seeders.tearDownDb();
        });

        it('should get all meetings by user ID', function() {
            let dbUser;
            let token;
            return User.findOne()
            .then(function(user) {
                dbUser = user;
                token = jwt.sign({user}, config.JWT_SECRET, {
                    subject: user.userName,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256'
                    });
                return chai.request(app)
                .get(`/meetings/protected/userId/${user._id}`)
                .set('Authorization', `Bearer ${token}`)
            })
            .then(function(res) {
                res.should.have.status(200);
                res.body.should.have.lengthOf.at.least(1);
                res.body.forEach(meeting => {
                    meeting.host._id.should.equal("" + dbUser._id); //same as .toString()
                });
            }) 

        });

    })

})