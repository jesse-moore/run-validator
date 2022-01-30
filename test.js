const dayjs = require('dayjs');
var duration = require('dayjs/plugin/duration');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
const { find } = require('geo-tz');
const data = require('./test/data/test_runs2.json');

const red = '\x1b[1m\x1b[31m';
const green = '\x1b[1m\x1b[32m';
const reset = '\x1b[0m';

const DISTANCE_DELTA = 0.02;
const ELEVATION_DELTA = 0.1;

const calcElevationGain = (points, spread, tolerance) => {
    let gain = 0;
    let loss = 0;
    let previousElevation = points[0].ele * 10;
    points.forEach((point, i) => {
        if (i % spread !== 0) return;
        const currentElevation = point.ele * 10;
        if (currentElevation - previousElevation > tolerance) {
            gain += currentElevation - previousElevation;
        } else if (previousElevation) {
            loss += currentElevation - previousElevation;
        }
        previousElevation = currentElevation;
    });
    return gain / 10;
};

const calcDiff = (expected, actual) => {
    if (actual < expected) return 0;
    return Number(
        Number((actual - Math.abs(actual - expected)) / actual).toFixed(3)
    );
};

const logDiff = (a, b, d) => {
    console.log(`Expected: ${a}, Actual: ${Number(b).toFixed(2)}`);
    const delta = d ? a * d : 0;
    const color = Math.abs(b - a) < delta ? green : red;
    console.log(
        color,
        `Difference of ${a > b ? '-' : '+'}${Number(Math.abs(b - a)).toFixed(
            2
        )} ${Number((a - Math.abs(a - b)) / a).toFixed(3)}%`,
        reset
    );
};

const printVariance = (spread, tolerance) => {
    let totalEleVariance = 0;
    console.log('\n');
    data.forEach((run) => {
        const { name, expected, tracks } = run;
        const { elevation_gain, url } = expected;
        console.log('\x1b[44m', `<-----------${name}------------>`, reset);
        console.log(url);
        // console.log(`<-----------DISTANCE------------>`);
        // logDiff(distance, data.tracks[0].distance.total, DISTANCE_DELTA);
        const eleGain = calcElevationGain(tracks[0].points, spread, tolerance);
        totalEleVariance +=
            Number(
                (elevation_gain - Math.abs(elevation_gain - eleGain)) /
                    elevation_gain
            ).toFixed(3) * 100;
        logDiff(elevation_gain, eleGain, ELEVATION_DELTA);
    });
    console.log(
        `\rTOTAL ELEVATION GAIN VARIANCE: ${
            totalEleVariance / (data.length * 100)
        }%`
    );
};

const printVarianceDistance = () => {
    let totalVariance = 0;
    console.log('\n');
    data.forEach((run) => {
        const { name, tracks } = run;
        const expected = run.expected.distance;
        const actual = tracks[0].distance.total;
        console.log('\x1b[44m', `<-----------${name}------------>`, reset);
        console.log(run.expected.url);
        logDiff(expected, actual, DISTANCE_DELTA);
        totalVariance +=
            Number((expected - Math.abs(expected - actual)) / expected).toFixed(
                3
            ) * 100;
    });
    console.log(`\rTOTAL VARIANCE: ${totalVariance / (data.length * 100)}%`);
};

const printVarianceElapsedTime = () => {
    let totalVariance = 0;
    console.log('\n');
    data.forEach((run) => {
        const { name, tracks } = run;
        const expected = run.expected.elapsed_time;
        const actual = calcElapsedTime(tracks[0].points);
        console.log('\x1b[44m', `<-----------${name}------------>`, reset);
        console.log(run.expected.url);
        calcElapsedTime(tracks[0].points);
        logDiff(expected, actual, DISTANCE_DELTA);
        totalVariance +=
            Number((expected - Math.abs(expected - actual)) / expected).toFixed(
                3
            ) * 100;
    });
    console.log(`\rTOTAL VARIANCE: ${totalVariance / (data.length * 100)}%`);
};

const printVarianceMovingTime = () => {
    let totalVariance = 0;
    console.log('\n');
    data.forEach((run, i) => {
        if (i != 6) return;
        const { name, tracks } = run;
        const expected = run.expected.moving_time;
        const actual = calcMovingTime(tracks[0]);
        console.log('\x1b[44m', `<-----------${name}------------>`, reset);
        console.log(run.expected.url);
        logDiff(expected, actual, DISTANCE_DELTA);
        totalVariance +=
            Number((expected - Math.abs(expected - actual)) / expected).toFixed(
                3
            ) * 100;
    });
    console.log(`\rTOTAL VARIANCE: ${totalVariance / (data.length * 100)}%`);
};

const calcElapsedTime = (points) => {
    const start = dayjs(points[0].time);
    const end = dayjs(points[points.length - 1].time);
    const duration = dayjs.duration(end.diff(start));
    return duration.asSeconds();
};

const calcMovingTime = (track) => {
    const { distance, points } = track;
    let prevTime = points[0].time;
    let prevDist = distance.cumul[0];
    let totalTime = 0;
    points.forEach((point, i) => {
        const currDist = distance.cumul[i];
        const start = dayjs(prevTime);
        const end = dayjs(point.time);
        const duration = dayjs.duration(end.diff(start)).asSeconds();
        if (duration > 10) console.log(duration);
        if (duration < 30) {
            totalTime += duration;
        }
        prevDist = currDist;
        prevTime = point.time;
    });
    return totalTime;
};

const calcTotalVariance = (spread, tolerance) => {
    let totalVariance = 0;
    run_data.forEach((run) => {
        const { data, elevationGain } = run;
        const actual = calcElevationGain(
            data.tracks[0].points,
            spread,
            tolerance
        );
        totalVariance += calcDiff(elevationGain, actual);
    });
    const aveVariance = totalVariance / run_data.length;
    const color = Math.abs(1 - aveVariance) < ELEVATION_DELTA ? green : red;
    console.log(
        color,
        `\rSPREAD: ${spread} TOLERANCE: ${tolerance} VARIANCE: ${aveVariance}%`,
        reset
    );
    return aveVariance;
};

const runTest = () => {
    let _variance = 0;
    let _spread = 0;
    let _tolerance = 0;
    for (let spread = 10; spread <= 20; spread++) {
        for (let tolerance = 0; tolerance <= 10; tolerance++) {
            const variance = Math.max(
                calcTotalVariance(spread, tolerance),
                _variance
            );
            if (_variance < variance) {
                _variance = variance;
                _spread = spread;
                _tolerance = tolerance;
            }
        }
    }
    console.log(
        `\rSPREAD: ${_spread} TOLERANCE: ${_tolerance} VARIANCE: ${_variance}%`
    );
};

const printDate = () => {
    data.forEach((run, i) => {
        // if (i != 0) return;
        const { name, metadata, tracks } = run;
        const { lat, lon } = tracks[0].points[0];
        console.log('\x1b[44m', `<-----------${name}------------>`, reset);
        console.log(run.expected.url);
        // console.log(metadata.time);
        const tz = find(lat, lon)[0];
		const date = dayjs(metadata.time).tz(tz)
		const dateString = date.format('YYYY-MM-DDTHH:mm:ss[Z]')
		const offset = date.format('Z')
        console.log(dateString);
		console.log(offset)
        console.log(tz);
    });
};

// printDate();
// runTest();
// 14 4
// 10 2
printVariance(14, 4);
// printVarianceDistance();
// printVarianceElapsedTime();
// printVarianceMovingTime();
// console.log(
//     calcDiff(
//         run_data[0].elevationGain,
//         calcElevationGain(run_data[0].data.tracks[0].points)
//     )
// );
