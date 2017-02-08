const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const co = require('co');
const rewrite = require('./util').rewrite;

module.exports = Generator.extend({
    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(`Welcome to the top-notch ${chalk.red('generator-express-pgp-typescript')} generator!`));

        const self = this;
        return co(function* () {
            const props = yield self.prompt([{
                type: 'input',
                name: 'name',
                message: 'Model name?',
            }, {
                type: 'confirm',
                name: 'rest',
                message: 'Create REST API?',
            }]);
            props.properties = [];
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
                        message: 'Property name? (leave blank for done)',
                    });
                    if (!property.name) {
                        break;
                    }
                    Object.assign(property, yield self.prompt([{
                        type: 'input',
                        name: 'type',
                        message: 'Property type?',
                        default: 'string',
                    }, {
                        type: 'confirm',
                        name: 'required',
                        message: 'Required?',
                    }]));
                    props.properties.push(property);
                }
            }
            self.props = props;
        });
    },

    writing() {
        const props = this.props;
        const args = {
            modelName: props.name,
            interfaceName: props.name.charAt(0).toUpperCase() + props.name.slice(1),
            pluralName: props.plural,
            properties: 'id?: string;\n    create_time: Date;',
            inputSchema: '',
            keys: '',
        };
        args.columns = props.properties.map(property => property.name).join(', ');
        args.values = props.properties.map(property => `\${${property.name}}`).join(', ');
        props.properties.forEach((property) => {
            args.properties = args.properties.concat(`\n    ${property.name}${property.required ? '' : '?'}: ${property.type};`);
            args.inputSchema = args.inputSchema.concat(`            ${property.name}: Joi.${property.type}()${property.required ? '.required()' : ''},\n`);
            args.keys = args.keys.concat(`                    '${property.name}'\n`);
        });
        this.fs.copyTpl(
            this.templatePath('repo.ts'),
            this.destinationPath(`src/model/repos/${props.name}.ts`),
            args);
        rewrite({
            file: 'src/model/index.ts',
            needle: '// import repos here',
            splicable: [
                `import { ${args.interfaceName}Repo } from './repos/${args.modelName}';`,
            ],
        });
        rewrite({
            file: 'src/model/index.ts',
            needle: '// declare repos here',
            splicable: [
                `${args.modelName}: ${args.interfaceName}Repo;`,
            ],
        });
        rewrite({
            file: 'src/model/index.ts',
            needle: '// create repos here',
            splicable: [
                `obj.${args.modelName} = new ${args.interfaceName}Repo(obj, pgp);`,
            ],
        });
        rewrite({
            file: 'src/model/index.ts',
            needle: '// export interfaces here',
            splicable: [
                `export { ${args.interfaceName} } from './repos/${args.modelName}';`,
            ],
        });
        console.log(`   ${chalk.yellow('update')} src/model/index.ts`);
        if (props.rest) {
            this.fs.copyTpl(
                this.templatePath('route.ts'),
                this.destinationPath(`src/routes/${props.name}/index.ts`),
                args);
            this.fs.copyTpl(
                this.templatePath('spec.ts'),
                this.destinationPath(`src/routes/${props.name}/index.spec.ts`),
                args);
            rewrite({
                file: 'src/routes/index.ts',
                needle: '// import routes here',
                splicable: [
                    `import ${args.interfaceName}Router from './${args.modelName}';`,
                ],
            });
            rewrite({
                file: 'src/routes/index.ts',
                needle: '// use routes here',
                splicable: [
                    `this.express.use('/api/v1/${args.pluralName}', ${args.interfaceName}Router);`,
                ],
            });
            console.log(`   ${chalk.yellow('update')} src/routes/index.ts`);
        }
    },
});
