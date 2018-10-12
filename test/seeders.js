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

    seedPeopleData: function(userData) {
        console.log('Seeding people data...');
        const seedData = [];
        for (let i = 0; i < 10; i++) {
            seedData.push(seeders.generatePeopleData(userData, i));
        };
        return People.insertMany(seedData);
    }
    

}

module.exports = { seeders };