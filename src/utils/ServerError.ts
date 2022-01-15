import { CustomError } from './CustomError';

export class ServerError extends CustomError {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 500;
    }
}
