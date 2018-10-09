'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('Load HTML', function() {
    it('should load HTML successfully', function() {
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
})