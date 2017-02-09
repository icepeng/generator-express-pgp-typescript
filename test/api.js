/* global describe before it */
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-express-pgp-typescript:api', () => {
    before(() => helpers.run(path.join(__dirname, '../generators/api'))
        .withPrompts({
            basicName: 'yoshi',
            rest: false,
        })
        .withPrompts({
            name: '',
        })
        .toPromise());

    it('creates files', () => {
        assert.file([
            'src/model/repos/yoshi.ts',
        ]);
    });
});
