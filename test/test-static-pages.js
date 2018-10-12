'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

describe('Load static pages', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });
    
    it('should load the landing page HTML successfully', function() {
        let res;
        chai.request(app)
        .get('/')
        .then((_res) => {
            res = _res;
            res.should.have.status(200);
            res.should.be.html;
        })
        .catch(err => {
            console.log(err);
        })
    })

    it('should load the user admin page HTML successfully', function() {
        let res;
        chai.request(app)
        .get('/user')
        .then((_res) => {
            res = _res;
            res.should.have.status(200);
            res.should.be.html;
        })
        .catch(err => {
            console.log(err);
        })
    })

    it('should load the person profile page HTML successfully', function() {
        let res;
        chai.request(app)
        .get('/person')
        .then((_res) => {
            res = _res;
            res.should.have.status(200);
            res.should.be.html;
        })
        .catch(err => {
            console.log(err);
        })
    })
})