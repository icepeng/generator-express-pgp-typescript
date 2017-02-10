const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const co = require('co');
const rewrite = require('./util').rewrite;

function snakeToCamel(s) {
    return s.replace(/(_\w)/g, m => m[1].toUpperCase());
}

function kebabToCamel(s) {
    return s.replace(/(-\w)/g, m => m[1].toUpperCase());
}

function toCapital(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = Generator.extend({
    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(`Welcome to the top-notch ${chalk.red('generator-express-pgp-typescript')} generator!`));

        const self = this;
        return co(function* () {
            const props = yield self.prompt([{
                type: 'input',
                name: 'basicName',
                message: 'Model name? (snake_case)',
            }, {
                type: 'confirm',
                name: 'rest',
                message: 'Create REST API?',
            }]);
            if (props.rest) {
                props.plural = (yield self.prompt({
                    type: 'input',
                    name: 'plural',
                    message: 'Plural name? (kebab-case)',
                })).plural;
            }
            props.properties = [];
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
            self.props = props;
        });
    },

    writing() {
        const props = this.props;
        const args = {
            tableName: props.basicName,
            modelName: snakeToCamel(props.basicName),
            interfaceName: toCapital(snakeToCamel(props.basicName)),
            properties: 'id?: string;\n    create_time: Date;',
            inputSchema: '',
            keys: '',
        };
        args.columns = props.properties.map(property => property.name).join(', ');
        args.values = props.properties.map(property => `\${${property.name}}`).join(', ');
        props.properties.forEach((property) => {
            args.properties = args.properties.concat(`\n    ${property.name}${property.required ? '' : '?'}: ${property.type};`);
            args.inputSchema = args.inputSchema.concat(`            ${property.name}: Joi.${property.type}()${property.required ? '.required()' : ''},\n`);
            args.keys = args.keys.concat(`                    '${property.name}',\n`);
        });

        this.fs.copyTpl(
            this.templatePath('repo.ts'),
            this.destinationPath(`src/model/repos/${props.basicName}.ts`),
            args);
        try {
            rewrite({
                file: 'src/model/index.ts',
                needle: '// import repos here',
                splicable: [
                    `import { ${args.interfaceName}Repo } from './repos/${args.tableName}';`,
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
                    `export { ${args.interfaceName} } from './repos/${args.tableName}';`,
                ],
            });
            console.log(`   ${chalk.yellow('update')} src/model/index.ts`);
        } catch (err) {
            console.log(`   ${chalk.red('error')} src/model/index.ts not exist`);
        }

        if (props.rest) {
            args.pluralName = props.plural;
            args.pluralCamelName = kebabToCamel(props.plural);
            this.fs.copyTpl(
                this.templatePath('route.ts'),
                this.destinationPath(`src/routes/${props.basicName}/index.ts`),
                args);
            this.fs.copyTpl(
                this.templatePath('spec.ts'),
                this.destinationPath(`src/routes/${props.basicName}/index.spec.ts`),
                args);
            try {
                rewrite({
                    file: 'src/routes/index.ts',
                    needle: '// import routes here',
                    splicable: [
                        `import ${args.interfaceName}Router from './${args.tableName}';`,
                    ],
                });
                rewrite({
                    file: 'src/routes/index.ts',
                    needle: '// use routes here',
                    splicable: [
                        `this.express.use('/api/v1/${args.pluralCamelName}', ${args.interfaceName}Router);`,
                    ],
                });
                console.log(`   ${chalk.yellow('update')} src/routes/index.ts`);
            } catch (err) {
                console.log(`   ${chalk.red('error')} src/routes/index.ts not exist`);
            }
        }
    },
});
