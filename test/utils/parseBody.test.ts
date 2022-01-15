import { expect } from 'chai';
import fs from 'fs';
import { parseBody } from '../../src/utils/parseBody';
import { RequestError } from '../../src/utils/RequestError';
import eventBody from '../data/eventBody.json';

describe('parse event body', () => {
    it('should return parsed event body', () => {
        const test_run = fs
            .readFileSync(process.cwd() + '/test/data/test_run.gpx')
            .toString();
        const result = parseBody(eventBody);
        expect(result.activity).to.equal(test_run);
    });
    it("should throw error if activity isn't base64 encoded", () => {
        const invalidBody = { activity: 'zzz' };
        expect(parseBody.bind(parseBody, invalidBody)).to.throw(
            'Activity needs to be base64 encoded'
        );
        try {
            parseBody(invalidBody);
        } catch (error) {
            expect(error).to.be.instanceOf(RequestError);
            expect(error.statusCode).to.equal(400);
        }
    });
    it("should throw error if activity isn't a string", () => {
        const invalidBody = { activity: Buffer.from('data') };
        expect(parseBody.bind(parseBody, invalidBody)).to.throw(
            'Activity Missing'
        );
        try {
            parseBody(invalidBody);
        } catch (error) {
            expect(error).to.be.instanceOf(RequestError);
            expect(error.statusCode).to.equal(400);
        }
    });
});
