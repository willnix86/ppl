'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { User } = require('../users/models');
const { People } = require('../people/models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

//SEED USER DATA
function seedUserData() {
    console.log('Seeding user data...');
    const seedData = [];
    for (let i = 0; i <= 10; i++) {
        seedData.push(generateUserData());
    };
    return User.insertMany(seedData);
};

//GENERATE USER DATA
function generateUserData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: `${faker.name.firstName()}.${faker.name.lastName()}`,
        password: faker.internet.password(),
        meetings: [
            {
                person: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName()
                },
                date: faker.date.past()
            }, 
            {
                person: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName()
                },
                date: faker.date.recent()
            },
            {
                person: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName()
                },
                date: faker.date.recent()
            },
            {
                person: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName()
                },
                date: faker.date.recent()
            },
            {
                person: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName()
                },
                date: faker.date.recent()
            }]
    }
};

//SEED PEOPLE DATA
function seedPeopleData() {
    console.log('Seeding people data...');
    const seedData = [];
    for (let i = 0; i <= 10; i++) {
        seedData.push(generatePeopleData());
    };
    return People.insertMany(seedData);
}

//GENERATE PEOPLE DATA
function generatePeopleData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        type: "Congregant",
        notes: [
            {
                content: faker.lorem.sentence(),
                createdAt: faker.date.recent()
            }, {
                content: faker.lorem.sentence(),
                createdAt: faker.date.recent()
            }, {
                content: faker.lorem.sentence(),
                createdAt: faker.date.recent()
            },{
                content: faker.lorem.sentence(),
                createdAt: faker.date.recent()
            }
        ],
        goals: [
            {
                goal: faker.lorem.sentence(),
                createdAt: faker.date.recent(),
                completeBy: faker.date.recent(),
                completed: faker.random.boolean()
            }, {
                goal: faker.lorem.sentence(),
                createdAt: faker.date.recent(),
                completeBy: faker.date.recent(),
                completed: faker.random.boolean()
            }, {
                goal: faker.lorem.sentence(),
                createdAt: faker.date.recent(),
                completeBy: faker.date.recent(),
                completed: faker.random.boolean()
            }
        ],
        files: [
            {
                name: faker.system.fileName(),
                ext: faker.system.fileExt(),
                uploaded: faker.date.recent()
            }, {
                name: faker.system.fileName(),
                ext: faker.system.fileExt(),
                uploaded: faker.date.recent()
            }, {
                name: faker.system.fileName(),
                ext: faker.system.fileExt(),
                uploaded: faker.date.recent()
            }, {
                name: faker.system.fileName(),
                ext: faker.system.fileExt(),
                uploaded: faker.date.recent()
            }
        ]
    }
};

function tearDownDb() {
    console.log('Deleting database...');
    return mongoose.connection.dropDatabase();
}

describe('Ppl API Resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedUserData();
    });

    beforeEach(function() {
        return seedPeopleData();
    });

    afterEach(function() {
        return tearDownDb();
    })

    after(function() {
        return closeServer();
    })

// GET ALL USERS
    it('should return all users from database', function() {
        let res;
        return chai.request(app)
        .get('/users')
        .then(function(_res) {
            res = _res;
            res.should.have.status(200);
            res.body.should.have.lengthOf.at.least(1);
            return User.count();
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
                user.should.include.keys('id', 'firstName', 'lastName', 'userName', 'meetings');
                user.people.should.be.a('array');
                user.meetings.should.be.a('array');
            });

            resUser = res.body[0];
            return User.findById(resUser.id);
        })
        .then(function(user) {
            resUser.id.should.equal(user.id);
            resUser.firstName.should.equal(user.firstName);
            resUser.lastName.should.equal(user.lastName);
            resUser.userName.should.equal(user.userName);
            // console.log(resUser);
            // console.log(user)
            // resUser.meetings.should.equal(user.meetings);
        })
    })

// GET USER BY ID
    it('should return the correct user from database', function() {
        let id;
        User.findOne()
        .then(function(user) {
            id = user.id;
            return chai.request(app)
            .get(`/users/${id}`)
        })
        .then(function(res) {
            res.should.have.status(200);
            console.log(res.body);
            res.body.id.should.equal(id);
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'firstName', 'lastName', 'userName', 'meetings');
            res.body.meetings.should.be.a('array');
        })
    })

// GET ALL PEOPLE

})