const fs = require('fs');
const gpxParser = require('gpxparser');

const DIR_TEST_DATA = process.cwd() + '\\test\\data\\';
const DIR_TEST_RUNS = DIR_TEST_DATA + 'test_runs2\\';

const files = fs.readdirSync(DIR_TEST_RUNS);

const data = [];

const expected = {
    test_run: {
        distance: 21390,
        elapsed_time: 5880,
        elevation_gain: 288,
        moving_time: 5880,
        url: 'https://www.strava.com/activities/1415691596',
    },
    test_run2: {
        distance: 42760,
        elapsed_time: 12518,
        elevation_gain: 292,
        moving_time: 12431,
        url: 'https://www.strava.com/activities/2269435690',
    },
    test_run3: {
        distance: 10310,
        elapsed_time: 2979,
        elevation_gain: 77,
        moving_time: 2950,
        url: 'https://www.strava.com/activities/6239780802',
    },
    test_run4: {
        distance: 13200,
        elapsed_time: 5469,
        elevation_gain: 294,
        moving_time: 5127,
        url: 'https://www.strava.com/activities/6284955959',
    },
    test_run5: {
        distance: 10900,
        elapsed_time: 3604,
        elevation_gain: 91,
        moving_time: 3467,
        url: 'https://www.strava.com/activities/6268236798',
    },
    test_run6: {
        distance: 15250,
        elapsed_time: 5844,
        elevation_gain: 144,
        moving_time: 4843,
        url: 'https://www.strava.com/activities/1671530686',
    },
    test_run7: {
        distance: 31610,
        elapsed_time: 17159,
        elevation_gain: 747,
        moving_time: 15292,
        url: 'https://www.strava.com/activities/1982698981',
    },
    test_run8: {
        distance: 16220,
        elapsed_time: 4733,
        elevation_gain: 102,
        moving_time: 4593,
        url: 'https://www.strava.com/activities/1974224576',
    },
    test_run9: {
        distance: 21660,
        elapsed_time: 6837,
        elevation_gain: 121,
        moving_time: 6696,
        url: 'https://www.strava.com/activities/2007303658',
    },
    test_run10: {
        distance: 16140,
        elapsed_time: 4993,
        elevation_gain: 70,
        moving_time: 4898,
        url: 'https://www.strava.com/activities/2228163093',
    },
    test_run11: {
        distance: 10120,
        elapsed_time: 2572,
        elevation_gain: 34,
        moving_time: 2468,
        url: 'https://www.strava.com/activities/2833389395',
    },
    test_run12: {
        distance: 32540,
        elapsed_time: 10388,
        elevation_gain: 193,
        moving_time: 10141,
        url: 'https://www.strava.com/activities/2253144979',
    },
    test_run13: {
        distance: 17520,
        elapsed_time: 5282,
        elevation_gain: 183,
        moving_time: 5084,
        url: 'https://www.strava.com/activities/2245838077',
    },
    test_run14: {
        distance: 11830,
        elapsed_time: 3435,
        elevation_gain: 90,
        moving_time: 3253,
        url: 'https://www.strava.com/activities/2299367010',
    },
    test_run15: {
        distance: 9690,
        elapsed_time: 4297,
        elevation_gain: 206,
        moving_time: 4099,
        url: 'https://www.strava.com/activities/2292863312',
    },
    test_run16: {
        distance: 20750,
        elapsed_time: 6897,
        elevation_gain: 73,
        moving_time: 6721,
        url: 'https://www.strava.com/activities/1201406450',
    },
};

const run_data = [
    {
        name: 'test_run',
        distance: 13920,
        elevationGain: 331,
        elapsed_time: 0, // 1:32:00
        moving_time: 0, // 1:30:03
        pace: 0, //6:28km
    },
    {
        name: 'test_run2',
        distance: 16100,
        elevationGain: 89,
        elapsed_time: 0, // 2:01:27
        moving_time: 0, // 1:28:47
        pace: 0, //5:31km
    },
    {
        name: 'test_run3',
        distance: 15140,
        elevationGain: 150,
        elapsed_time: 0, // 1:30:37
        moving_time: 0, // 1:29:13
        pace: 0, //5:54km
    },
    {
        name: 'test_run4',
        distance: 16100,
        elevationGain: 73,
        elapsed_time: 0, // 1:37:20
        moving_time: 0, // 1:28:59
        pace: 0, //5:31km
    },
    {
        name: 'test_run5',
        distance: 8200,
        elevationGain: 93,
        elapsed_time: 0, //
        moving_time: 0, //
        pace: 0, //
    },
    {
        name: 'test_run6',
        distance: 17150,
        elevationGain: 120,
        elapsed_time: 0, //
        moving_time: 0, //
        pace: 0, //
    },
    {
        name: 'test_run7',
        distance: 11520,
        elevationGain: 126,
        elapsed_time: 0, // 57:10
        moving_time: 0, // 52:28
        pace: 0, // 4:33km
    },
];

files.forEach((file) => {
    const name = file.split('.')[0];
    fileData = fs.readFileSync(DIR_TEST_RUNS + file).toString();
    const gpx = new gpxParser();
    gpx.parse(fileData);
    const _data = {
        name,
        metadata: gpx.metadata,
        waypoints: gpx.waypoints,
        tracks: gpx.tracks,
        route: gpx.routes,
        expected: expected[name],
    };
    data.push(_data);
});

fs.writeFileSync(DIR_TEST_DATA + 'test_runs2.json', JSON.stringify(data));
