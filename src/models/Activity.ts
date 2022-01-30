import { GPX } from './Gpx';

export class Activity {
    distance: number;
    elapsed_time: number;
    elevationGain: number;
    moving_time: number;
    date: string;
    local_date: string;
    timezone: string;
    offset: number;
    constructor() {
        this.distance = 0;
        this.elapsed_time = 0;
        this.elevationGain = 0;
        this.moving_time = 0;
        this.date = '';
        this.local_date = '';
        this.timezone = '';
        this.offset = 0;
    }
    fromGpx(gpx: GPX) {
        this.distance = gpx.tracks[0].distance.total;
        this.elapsed_time = gpx.tracks[0].time.elapsed_time;
        this.elevationGain = gpx.tracks[0].elevation.gain;
        this.moving_time = gpx.tracks[0].time.moving_time;
        return this;
    }
    addDate(date: Date) {
        this.date = date.date;
        this.local_date = date.local_date;
        this.offset = date.offset;
        this.timezone = date.timezone;
    }
}

interface Date {
    local_date: string;
    date: string;
    offset: number;
    timezone: string;
}
