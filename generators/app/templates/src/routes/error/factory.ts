class ErrorFactory {

    getError(errorName: string, status: number): any {
        class NestedError extends Error {
            errorMessages: any;
            status: number;
            constructor(msg: any) {
                super(`${errorName}: ${msg.toString()}`);
                if (!(msg instanceof String) && msg instanceof Array) {
                    this.errorMessages = msg;
                }

                if (undefined !== status) {
                    this.status = status;
                }
            }
        }
        return NestedError;
    }


}

const errorArr = [
    { name: 'NoEmailError', code: 401 },
    { name: 'PasswordMismatchError', code: 401 },
    { name: 'DuplicatedEntryError', code: 409 },
    { name: 'InvalidArgumentError', code: 400 },
    { name: 'InsufficientPermissionError', code: 403 },
    { name: 'NotFoundError', code: 404 },
    { name: 'NotAllowedError', code: 405 },
    { name: 'DuplicatedIssueError', code: 400 },
];

const errors: any = {};
const errorFactory = new ErrorFactory();

errorArr.forEach((error) => {
    errors[error.name] = errorFactory.getError(error.name, error.code);
});

export { errors as Errors };
