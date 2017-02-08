import { Request, Response, NextFunction } from 'express';
import { Errors } from './factory';
import App from '../index';

export function NotFoundError(req: Request, res: Response, next: NextFunction) {
    next(new Errors.NotFoundError('Not Found'));
}

export function ErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof SyntaxError) {
        res.status(400).json({
            errorMessages: ['Malformed JSON data']
        });
        return;
    }

    if (err.isJoi) {
        err.status = 400;
    }

    // Process errors.
    if (!err.status) {
        err.status = 500;
    }

    if (!err.message) {
        err.message = 'Unknown error';
    }

    const errorMessages = err.errorMessages ? err.errorMessages : [err.message];

    res.status(err.status);
    if (App.get('env') === 'development' && err.status.toString()[0] === '5') {
        console.error(err);
        res.json({
            errorMessages: errorMessages,
            stack: err.stack,
            error: err,
        });
    } else {
        if (err.status.toString()[0] === '5') {
            console.error(err);
        }

        res.json({
            errorMessages: errorMessages,
        });
    }
}
