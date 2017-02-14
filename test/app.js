/* global describe before it */
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-express-pgp-typescript:app', () => {
    before(() => helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
            name: 'yoshi',
        })
        .toPromise());

    it('creates files', () => {
        assert.file([
            'src',
            '.gitignore',
            'gulpfile.js',
            'tsconfig.json',
            'tslint.json',
            'package.json',
            'yarn.lock',
            '.editorconfig',
        ]);
    });
});
