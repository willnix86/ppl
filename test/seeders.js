const faker = require('faker');
const mongoose = require('mongoose');
const { People } = require('../people/models');
const { Meeting } = require('../meetings/models')

const seeders = {

    tearDownDb: function() {
        console.log('Deleting database...');
        return mongoose.connection.dropDatabase();
    },

// SEEDERS FOR USER TESTS

    seedUserData: function() {
        console.log('Seeding user data...');
        const seedData = [];
        for (let i = 0; i < 10; i++) {
            seedData.push(seeders.generateUserData());
        };
        return seedData;
    },

    generateUserData: function() {
        return {
            _id: mongoose.Types.ObjectId(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            userName: `${faker.name.firstName()}.${faker.name.lastName()}`,
            password: faker.internet.password()
        }
    },

    generateUserUpdateData: function() {
        return {
            lastName: faker.name.lastName(),
            password: faker.internet.password()
        }
    },

// SEEDERS FOR PEOPLE TESTS

    seedPeopleData: function(userData) {
        console.log('Seeding people data...');
        const seedData = [];
        for (let i = 0; i < 10; i++) {
            seedData.push(seeders.generatePeopleData(userData, i));
        };
        return People.insertMany(seedData);
    },

    generatePeopleData: function(userData, index) {
        return {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            user: userData[index]._id,
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
        }
    },

    seedUserWithSpecificId: function() {
        console.log('Seeding user with specific data...');
        const seedData = [];
        seedData.push(seeders.generateUserWithSpecificId());
        return seedData;
    },

    generateUserWithSpecificId: function() {
        return {
            _id: "5bbfbe91f60377afff6deca9",
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            userName: `${faker.name.firstName()}.${faker.name.lastName()}`,
            password: faker.internet.password()
        }
    },

    seedPeopleWithSpecificUserIds: function(userData) {
        console.log('Seeding people data with specific users...');
        const seedData = [];
        for (let i = 0; i < 10; i++) {
            seedData.push(seeders.generatePeopleWithSpecificUserIds(userData));
        };
        return People.insertMany(seedData);
    },

    generatePeopleWithSpecificUsersIds: function(userData) {
        return {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            user: userData[0]._id,
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
        }
    },

    generatePeopleUpdateData: function() {
        return {
            lastName: faker.name.lastName()
        }
    },

// SEEDERS FOR MEETING TESTS

    seedFiveUsers: function() {
        console.log('Seeding five users\' data...');
        const userData = [];
        for (let i = 0; i < 5; i++) {
            userData.push(seeders.generateFiveUsers(i));
        };
        return userData;
    },

    generateFiveUsers: function(index) {
        return {
            _id: `5bbfbe91f60377afff6decb${index}`,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            userName: `${faker.name.firstName()}.${faker.name.lastName()}`,
            password: faker.internet.password()
        }
    },

    seedFivePeople: function() {
        console.log('Seeding five peoples\' data...');
        const peopleData = [];
        for (let i = 0; i < 5; i++) {
            peopleData.push(seeders.generateFivePeople(i));
        };
        return peopleData;
    },

    generateFivePeople: function(index) {
        return {
            _id: `7bbfbe91f60${index}77afff6deca6`,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            user: mongoose.Types.ObjectId(),
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
        }
    },

    generateAndSeedMeetingsData: function(users, people) {

        const seedData = [];

        for (let i = 0; i < 5; i++) {

            for (let j = 0; j < 5; j++) {
                let meeting = {
                    host: users[j]._id,
                    person: people[j]._id,
                    date: faker.date.recent()
                }
    
                seedData.push(meeting);
            }
    
        }

        return Meeting.insertMany(seedData);

    }

}

module.exports = { seeders };