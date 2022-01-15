import GpxParser, { Point } from 'gpxparser';
import { Activity } from '../models/Activity';
import { RequestError } from './RequestError';

export const parseGpxData = (_activity: string): Activity => {
    const gpx = new GpxParser();
    const activity = new Activity();
    try {
        gpx.parse(_activity);
        activity.distance = gpx.tracks[0].distance.total;
        activity.elevationGain = gpx.tracks[0].elevation.avg;

        console.log(gpx.tracks[0].points);

        const gain = calcElevationGain(gpx.tracks[0].points);
        console.log(gain);
        console.log(gpx.tracks[0].slopes);
        console.log(gpx.tracks[0].elevation);

        console.log(activity);
        return activity;
    } catch (error) {
        console.log(error);
        throw new RequestError('Error parsing run data');
    }
};

const calcElevationGain = (points: Point[]): number => {
    let gain = 0;
    let loss = 0;
    let previousElevation = points[0].ele * 10;
    points.forEach((point, i) => {
		if (i%5 !== 0) return;
        const currentElevation = point.ele * 10;
        if (currentElevation - previousElevation > 1) {
            gain += currentElevation - previousElevation;
        } else if (previousElevation) {
            loss += currentElevation - previousElevation;
        }
        previousElevation = currentElevation;
    });
    console.log(loss);
    return gain;
};
