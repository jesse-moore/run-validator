import { APIGatewayEvent } from 'aws-lambda';
import { expect } from 'chai';
import sinon from 'sinon';
import { lambdaHandler } from '../../src/controllers/validateRun';
import { Activity } from '../../src/models/Activity';
import * as service from '../../src/services/validateRun';
import _event from '../data/event.json';

describe('helloWorld Controller', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return correct response', async () => {
        const serviceStub = sinon.stub(service, 'validateRun');
        const testActivity = new Activity();
        serviceStub.onFirstCall().returns(testActivity);
        const event = _event as unknown as APIGatewayEvent;
        const result = await lambdaHandler(event);
        expect(result.body).to.equal(
            JSON.stringify({ activity: testActivity })
        );
        expect(serviceStub.calledOnce).to.be.true;
    });
});
