import { expect } from 'chai';
import fs from 'fs';
import { parseGpx } from '../../src/utils/parseGpx';

describe('test accuracy', function () {
    let test_run: string;
    const DISTANCE_DELTA = 0.02;
    const ELEVATION_DELTA = 0.1;
    const MOVING_TIME_DELTA = 0.02;
    const ELAPSED_TIME_DELTA = 0.02;
    before(() => {
        test_run = fs
            .readFileSync(
                process.cwd() + '/test/data/test_runs2/test_run16.gpx'
            )
            .toString();
    });
    it('test_run', () => {
        const distance = 20750;
        const elevationGain = 73;
        const elapsed_time = 6897;
        const moving_time = 6721;
        const parsedActivity = parseGpx(test_run);
        const track = parsedActivity.tracks[0];
        expect(track.distance.total).to.approximately(
            distance,
            distance * DISTANCE_DELTA
        );
        expect(track.elevation.gain).to.approximately(
            elevationGain,
            elevationGain * ELEVATION_DELTA
        );
        expect(track.time.elapsed_time).to.approximately(
            elapsed_time,
            elapsed_time * ELAPSED_TIME_DELTA
        );
        expect(track.time.moving_time).to.approximately(
            moving_time,
            moving_time * MOVING_TIME_DELTA
        );
        expect(parsedActivity.metadata.time).to.equal('2017-09-06T09:38:00Z');
    });
});
