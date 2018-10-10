'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('Load static pages', function() {
    it('should load the landing page HTML successfully', function() {
        let res;
        chai.request('http://localhost:8080')
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
        chai.request('http://localhost:8080')
        .get('/user.html')
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
        chai.request('http://localhost:8080')
        .get('/person.html')
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