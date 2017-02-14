import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { Model, <%= interfaceName %> } from '../../model';

import app from '../';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/<%= pluralName %>', () => {
    before(() => {
        return Model.query('BEGIN')
            .then(() => chai.request(app)
                .post('/api/v1/<%= pluralName %>')
                .send({
                    // add test input here
                }));
    });

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

    after(() => {
        return Model.query('ROLLBACK');
    });
});

describe('GET api/v1/<%= pluralName %>/:id', () => {
    let <%= modelName %>ID: string;

    before(() => {
        return Model.query('BEGIN')
            .then(() => chai.request(app)
                .post('/api/v1/<%= pluralName %>')
                .send({
                    // add test input here
                })
                .then(res => {
                    <%= modelName %>ID = res.body.<%= modelName %>.id;
                }));
    });

    it('responds with JSON object', () => {
        return chai.request(app).get(`/api/v1/<%= pluralName %>/${<%= modelName %>ID}`)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body.<%= modelName %>).to.be.an('object');
            });
    });

    it('should include <%= interfaceName %>', () => {
        return chai.request(app).get(`/api/v1/<%= pluralName %>/${<%= modelName %>ID}`)
            .then(res => {
                const <%= interfaceName %> = res.body.<%= modelName %>;
                expect(<%= interfaceName %>).to.exist;
                expect(<%= interfaceName %>).to.have.all.keys([
                    'id',
                    'create_time',
<%- keys %>                ]);
            });
    });

    after(() => {
        return Model.query('ROLLBACK');
    });
});

describe('POST api/v1/<%= pluralName %>', () => {
    before(() => {
        return Model.query('BEGIN');
    });

    it('responds with JSON object', () => {
        return chai.request(app).post('/api/v1/<%= pluralName %>').send({
            // add test input here
        }).then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body.<%= modelName %>).to.be.an('object');
        });
    });

    it('should include <%= interfaceName %>', () => {
        return chai.request(app).post('/api/v1/<%= pluralName %>').send({
            // add test input here
        }).then(res => {
                const <%= interfaceName %> = res.body.<%= modelName %>;
                expect(<%= interfaceName %>).to.exist;
                expect(<%= interfaceName %>).to.have.all.keys([
                    'id',
                    'create_time',
<%- keys %>                ]);
            });
    });

    after(() => {
        return Model.query('ROLLBACK');
    });
});

describe('DELETE api/v1/<%= pluralName %>/:id', () => {
    let <%= modelName %>ID: string;

    beforeEach(() => {
        return Model.query('BEGIN')
            .then(() => chai.request(app)
                .post('/api/v1/<%= pluralName %>')
                .send({
                    // add test input here
                })
                .then(res => {
                    <%= modelName %>ID = res.body.<%= modelName %>.id;
                }));
    });

    it('responds with 200', () => {
        return chai.request(app).del(`/api/v1/<%= pluralName %>/${<%= modelName %>ID}`)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
            });
    });

    it('should return 404 when <%= modelName %> not exist', () => {
        return chai.request(app).del(`/api/v1/<%= pluralName %>/ae1ba13d-867e-474e-ab00-8f3762ecf00b`)
            .then(res => {
                throw res;
            })
            .catch(res => {
                expect(res.status).to.equal(404);
            });
    });

    afterEach(() => {
        return Model.query('ROLLBACK');
    });
});

describe('PUT api/v1/<%= pluralName %>/:id', () => {
    let <%= modelName %>ID: string;

    before(() => {
        return Model.query('BEGIN')
            .then(() => chai.request(app)
                .post('/api/v1/<%= pluralName %>')
                .send({
                    // add test input here
                })
                .then(res => {
                    <%= modelName %>ID = res.body.<%= modelName %>.id;
                }));
    });

    it('responds with JSON object', () => {
        return chai.request(app).put(`/api/v1/<%= pluralName %>/${<%= modelName %>ID}`).send({
            // add test input here
        }).then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body.<%= modelName %>).to.be.an('object');
        });
    });

    it('should include edited <%= modelName %>', () => {
        return chai.request(app).put(`/api/v1/<%= pluralName %>/${<%= modelName %>ID}`).send({
            // add test input here
        }).then(res => {
            const <%= interfaceName %> = res.body.<%= modelName %>;
            expect(<%= interfaceName %>).to.exist;
            expect(<%= interfaceName %>).to.have.all.keys([
                'id',
                'create_time',
<%- keys %>                ]);
            // check edited values here
        });
    });

    after(() => {
        return Model.query('ROLLBACK');
    });
});
