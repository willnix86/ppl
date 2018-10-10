'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { User } = require('../users/models');
const { Person } = require('../people/models');
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
        myPeople: [
            {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            },
            {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            },
            {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            },
            {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            },
            {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            }
        ]
    }
};

//SEED PEOPLE DATA
function seedPeopleData() {
    console.log('Seeding people data...');
    const seedData = [];
    for (let i = 0; i <= 10; i++) {
        seedData.push(generatePeopleData());
    };
    return Person.insertMany(seedData);
}

//GENERATE PEOPLE DATA
function generatePeopleData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        type: "Congregant",
        user: `${faker.name.firstName()} ${faker.name.lastName()}`,
        notes: [
            {
                content: faker.lorem.sentence,
                createdAt: faker.date.recent
            }, {
                content: faker.lorem.sentence,
                createdAt: faker.date.recent
            }, {
                content: faker.lorem.sentence,
                createdAt: faker.date.recent
            },{
                content: faker.lorem.sentence,
                createdAt: faker.date.recent
            }
        ],
        goals: [
            {
                goal: faker.lorem.sentence,
                createdAt: faker.date.recent,
                completeBy: faker.date.soon,
                completed: faker.random.boolean
            }, {
                goal: faker.lorem.sentence,
                createdAt: faker.date.recent,
                completeBy: faker.date.soon,
                completed: faker.random.boolean
            }, {
                goal: faker.lorem.sentence,
                createdAt: faker.date.recent,
                completeBy: faker.date.soon,
                completed: faker.random.boolean
            }
        ],
        files: [
            {
                name: faker.system.fileName,
                ext: faker.system.fileExt,
                uploaded: faker.date.recent
            }, {
                name: faker.system.fileName,
                ext: faker.system.fileExt,
                uploaded: faker.date.recent
            }, {
                name: faker.system.fileName,
                ext: faker.system.fileExt,
                uploaded: faker.date.recent
            }, {
                name: faker.system.fileName,
                ext: faker.system.fileExt,
                uploaded: faker.date.recent
            }
        ],
        meetings: [
            {
                user: `${faker.name.firstName()} ${faker.name.lastName()}`,
                person: `${faker.name.firstName()} ${faker.name.lastName()}`,
                date: faker.date.past
            }, {
                user: `${faker.name.firstName()} ${faker.name.lastName()}`,
                person: `${faker.name.firstName()} ${faker.name.lastName()}`,
                date: faker.date.recent
            }, {
                user: `${faker.name.firstName()} ${faker.name.lastName()}`,
                person: `${faker.name.firstName()} ${faker.name.lastName()}`,
                date: faker.date.recent
            }, {
                user: `${faker.name.firstName()} ${faker.name.lastName()}`,
                person: `${faker.name.firstName()} ${faker.name.lastName()}`,
                date: faker.date.soon
            },
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

})