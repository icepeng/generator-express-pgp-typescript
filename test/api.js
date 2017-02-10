/* global describe before after it */
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');

describe('generator-express-pgp-typescript:api', () => {
    it('creates model files', () => helpers.run(path.join(__dirname, '../generators/api'))
        .inTmpDir((dir) => {
            fs.copySync(path.join(__dirname, '../generators/app/templates'), dir);
        })
        .withPrompts({
            basicName: 'yoshi',
            rest: false,
        })
        .withPrompts({
            name: '',
        })
        .toPromise()
        .then(() => {
            assert.file([
                'src/model/repos/yoshi.ts',
            ]);
        }));

    it('creates model and route files', () => helpers.run(path.join(__dirname, '../generators/api'))
        .inTmpDir((dir) => {
            fs.copySync(path.join(__dirname, '../generators/app/templates'), dir);
        })
        .withPrompts({
            basicName: 'yoshi',
            rest: true,
            plural: 'yoshies',
        })
        .withPrompts({
            name: '',
        })
        .toPromise()
        .then(() => {
            assert.file([
                'src/model/repos/yoshi.ts',
                'src/routes/yoshi/index.ts',
            ]);
        }));
});
