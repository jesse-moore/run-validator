import { APIGatewayEvent } from 'aws-lambda';
// import { validateRun } from '../services/validateRun';

let response;

export const lambdaHandler = async (event: APIGatewayEvent) => {
    try {
        response = {
            statusCode: 200,
            body: JSON.stringify({
                data: 'data',
            }),
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
