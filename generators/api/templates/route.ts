import { Router, Request, Response, NextFunction } from 'express';
import { Model, <%= interfaceName %> } from '../../model';
import { Errors } from '../error';
import * as Joi from 'joi';

export class <%= interfaceName %>Router {
    router: Router;

    constructor() {
        this.router = Router();
        this.run();
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const <%= pluralCamelName %> = await Model.<%= modelName %>.all();
            res.status(200).send({
                message: 'Success',
                <%= pluralCamelName %>,
            });
        } catch (err) {
            next(err);
        }
    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.params.id;
            const <%= modelName %> = await Model.<%= modelName %>.find(query);
            if (<%= modelName %>) {
                res.status(200).send({
                    message: 'Success',
                    <%= modelName %>,
                });
            } else {
                res.status(404).send({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }
        } catch (err) {
            next(err);
        }
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        try {
            const input: <%= interfaceName %> = req.body;
            const <%= modelName %> = await Model.<%= modelName %>.add(input);
            res.status(200).send({
                message: 'Success',
                <%= modelName %>,
            });
        } catch (err) {
            next(err);
        }
    }

    public async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.params.id;
            if (await Model.<%= modelName %>.remove(query)) {
                res.status(200).send({
                    message: 'Success',
                });
            } else {
                res.status(404).send({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }
        } catch (err) {
            next(err);
        }
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.params.id;
            const input: <%= interfaceName %> = req.body;
            const <%= modelName %> = await Model.<%= modelName %>.edit(query, input);
            if (<%= modelName %>) {
                res.status(200).send({
                    message: 'Success',
                    <%= modelName %>,
                });
            } else {
                res.status(404).send({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }
        } catch (err) {
            next(err);
        }
    }

    private inputValidator(req: Request, res: Response, next: NextFunction) {
        const <%= modelName %> = req.body;
        const schema = Joi.object().keys({
<%= inputSchema %>        });
        req.body = Joi.attempt(<%= modelName %>, schema);
        next();
    }

    private uuidValidator(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const schema = Joi.string().guid();
        Joi.assert(id, schema);
        next();
    }

    run() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.uuidValidator, this.getOne);
        this.router.post('/', this.inputValidator, this.add);
        this.router.delete('/:id', this.uuidValidator, this.remove);
        this.router.put('/:id', [this.uuidValidator, this.inputValidator], this.edit);
    }

}

const <%= modelName %>Routes = new <%= interfaceName %>Router();

export default <%= modelName %>Routes.router;
