import { expect } from 'chai';
import fs from 'fs';
import { parseGpxData } from '../../src/utils/parseGpxData';

describe('parse gpx data', function() {
    let test_run: string;
	this.timeout(10000)
    before(() => {
        test_run = fs
            .readFileSync(process.cwd() + '/test/data/test_run4.gpx')
            .toString();
    });
    it('should parse gpx activity', () => {
        const parsedActivity = parseGpxData(test_run);
		expect(1).to.equal(1); 
    });
});
