import { APIGatewayEvent } from 'aws-lambda';
import { helloWorldService } from '../services/helloWorld';

let response;

export const lambdaHandler = async (event: APIGatewayEvent) => {
    try {
        const data = helloWorldService();
        response = {
            statusCode: 200,
            body: JSON.stringify({
                data,
            }),
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
