const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = Generator.extend({
    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(`Welcome to the impeccable ${chalk.red('generator-express-pgp-typescript')} generator!`));

        const prompts = [{
            type: 'input',
            name: 'name',
            message: 'Project name?',
            default: this.appname,
        }, {
            type: 'input',
            name: 'dbHost',
            message: 'Database host?',
            default: 'localhost',
        }, {
            type: 'input',
            name: 'dbPort',
            message: 'Database port?',
            default: '5432',
        }, {
            type: 'input',
            name: 'dbName',
            message: 'Database name?',
            default: this.appname,
        }, {
            type: 'input',
            name: 'dbUser',
            message: 'Database user name?',
            default: 'pinkbean',
        }];

        return this.prompt(prompts).then((props) => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    },

    writing() {
        this.fs.copyTpl(
            this.templatePath('src'),
            this.destinationPath('src'),
            this.props);
        this.fs.copy(
            this.templatePath('.gitignore'),
            this.destinationPath('.gitignore'));
        this.fs.copy(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js'));
        this.fs.copy(
            this.templatePath('tsconfig.json'),
            this.destinationPath('tsconfig.json'));
        this.fs.copy(
            this.templatePath('tslint.json'),
            this.destinationPath('tslint.json'));
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            this.props);
        this.fs.copy(
            this.templatePath('yarn.lock'),
            this.destinationPath('yarn.lock'));
    },

    install() {
        this.yarnInstall();
    },
});
