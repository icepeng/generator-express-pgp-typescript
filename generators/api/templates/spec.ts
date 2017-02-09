import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/app';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/<%= pluralName %>', () => {

    it('responds with JSON array', () => {
        return chai.request(app).get('/api/v1/<%= pluralName %>')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body.<%= pluralName %>).to.be.an('array');
            });
    });

    it('should include <%= interfaceName %>', () => {
        return chai.request(app).get('/api/v1/<%= pluralName %>')
            .then(res => {
                const <%= interfaceName %> = res.body.<%= pluralCamelName %>[0];
                expect(<%= interfaceName %>).to.exist;
                expect(<%= interfaceName %>).to.have.all.keys([
                'id',
                'create_time',
<%- keys %>                ]);
            });
    });

});
