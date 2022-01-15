import { CustomError } from './CustomError';

export class RequestError extends CustomError {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 400;
    }
}
