import { APIGatewayEvent } from 'aws-lambda';
import { expect } from 'chai';
import sinon from 'sinon';
import { lambdaHandler } from '../../src/controllers/helloWorld';
import * as service from '../../src/services/helloWorld';
import _event from '../data/event.json';

describe('helloWorld Controller', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return corrent response', async () => {
        const serviceStub = sinon.stub(service, 'helloWorldService');
        serviceStub.onFirstCall().returns('Hello World!');
        const event = _event as unknown as APIGatewayEvent;
        const result = await lambdaHandler(event);
        expect(result.body).to.equal(JSON.stringify({ data: 'Hello World!' }));
        expect(serviceStub.calledOnce).to.be.true;
    });
});
