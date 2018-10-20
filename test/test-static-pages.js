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
        return chai.request(app)
        .get('/')
        .then((_res) => {
            res = _res;
            res.should.have.status(200);
            res.should.have.header('content-type');
            res.header['content-type'].should.equal('text/html; charset=UTF-8');
        })
        .catch(err => {
            console.log(err);
        })
    })

})