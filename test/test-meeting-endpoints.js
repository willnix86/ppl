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

        it('should return all meetings from database', function() {
            let res;
            return chai.request(app)
            .get('/meetings')
            .then(function(_res) {
                res = _res;
                res.should.have.status(200);
                res.body.should.have.lengthOf.at.least(1);
                return Meeting.countDocuments();
            }) 
            .then(function(count) {
                res.body.should.have.lengthOf(count);
            })
        });

        it('should get all meetings by user ID', function() {
            let dbUser;
            return User.findOne()
            .then(function(user) {
                dbUser = user;
                return chai.request(app)
                .get(`/meetings/userId/${user._id}`)
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