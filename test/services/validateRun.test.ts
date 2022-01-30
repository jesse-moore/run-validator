import fs from 'fs';
import { expect } from 'chai';
import { Activity } from '../../src/models/Activity';
import { validateRun } from '../../src/services/validateRun';
import { EventBody } from '../../src/types';

describe('validate run service', () => {
    let test_run: string;
    before(() => {
        test_run = fs
            .readFileSync(
                process.cwd() + '/test/data/test_runs2/test_run16.gpx'
            )
            .toString();
    });
    it('should return an Activity', () => {
        const event: EventBody = { activity: test_run };
        const activity = validateRun(event);
        expect(activity).to.be.an.instanceOf(Activity);
    });
});
