const faker = require('faker');
const mongoose = require('mongoose');
const { User } = require('../users/models');
const { People } = require('../people/models');

const seeders = {

    tearDownDb: function() {
        console.log('Deleting database...');
        return mongoose.connection.dropDatabase();
    },

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

    seedUserWithSpecificData: function() {
        console.log('Seeding user with specific data...');
        const seedData = [];
        seedData.push(seeders.generateUserWithSpecificData());
        return seedData;
    },

    generateUserWithSpecificData: function() {
        return {
            _id: "5bbfbe91f60377afff6deca9",
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            userName: `${faker.name.firstName()}.${faker.name.lastName()}`,
            password: faker.internet.password()
        }
    },

    seedPeopleData: function(userData) {
        console.log('Seeding people data...');
        const seedData = [];
        for (let i = 0; i < 10; i++) {
            seedData.push(seeders.generatePeopleData(userData, i));
        };
        return People.insertMany(seedData);
    },

    generateUserUpdateData: function() {
        return {
            lastName: faker.name.lastName(),
            password: faker.internet.password()
        }
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

    seedPeopleWithSpecificUsers: function(userData) {
        console.log('Seeding people data with specific users...');
        const seedData = [];
        for (let i = 0; i < 10; i++) {
            seedData.push(seeders.generatePeopleDataWithSetUsers(userData));
        };
        return People.insertMany(seedData);
    },

    generatePeopleDataWithSetUsers: function(userData) {
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
    }
}

module.exports = { seeders };