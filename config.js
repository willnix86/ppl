'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/pplDb';
//exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-pplDb';
exports.PORT = process.env.PORT || 8080;