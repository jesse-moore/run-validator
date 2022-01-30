import { APIGatewayEvent } from 'aws-lambda';
import { validateRun } from '../services/validateRun';
import { CustomError } from '../utils/CustomError';
import { parseBody } from '../utils/parseBody';
import { RequestError } from '../utils/RequestError';

let response;

export const lambdaHandler = async (event: APIGatewayEvent) => {
    try {
        if (event.body === null) throw new RequestError('Body missing');
        const body = parseBody(event.body);
        const activity = validateRun(body);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                activity,
            }),
        };
    } catch (err: any) {
        if (err instanceof CustomError) {
            return {
                statusCode: err.statusCode,
                body: JSON.stringify({ error: err.message }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Something went wrong' }),
            };
        }
    }

    return response;
};
