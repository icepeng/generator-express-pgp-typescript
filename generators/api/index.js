const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const co = require('co');

module.exports = Generator.extend({
    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the top-notch ' + chalk.red('generator-express-pgp-typescript') + ' generator!'
        ));

        const self = this;
        return co(function*() {
            const props = yield self.prompt([{
                type: 'input',
                name: 'name',
                message: 'Model name?',
            }, {
                type: 'confirm',
                name: 'rest',
                message: 'Create REST API?',
            }]);
            if (props.rest) {
                props.plural = (yield self.prompt({
                    type: 'input',
                    name: 'plural',
                    message: 'Plural name? (REST collection)',
                })).plural;
                while (true) {
                    const property = yield self.prompt({
                        type: 'input',
                        name: 'name',
                        message: 'Property name?',
                    });
                    if (!property.name) {
                        break;
                    }
                    Object.assign(property, yield self.prompt({
                        type: 'input',
                        name: 'type',
                        message: 'Property type?',
                        default: 'string',
                    }, {
                        type: 'confirm',
                        name: 'required',
                        message: 'Required?',
                    }));
                }
            }
            self.props = props;
        });
    },

    writing() {
        // this.fs.copy(
        //   this.templatePath('dummyfile.txt'),
        //   this.destinationPath('dummyfile.txt'));
    },

    install() {
        this.yarnInstall();
    },
});
