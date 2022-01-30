export class GPX {
    tracks: Track[];
    metadata: Metadata | undefined;
    constructor() {
        this.tracks = [];
    }
}

export class Track {
    name: string;
    points: Point[];
    type?: number;
    distance: Distance;
    elevation: Elevation;
    time: Time;
    constructor() {
        this.name = '';
        this.points = [];
        this.distance = new Distance();
        this.elevation = new Elevation();
        this.time = new Time();
    }
}

export class Distance {
    total: number;
    cumulative: number[];
    constructor() {
        this.total = 0;
        this.cumulative = [];
    }
}

export class Elevation {
    gain: number;
    max: number;
    min: number;
    slope: number[];
    constructor() {
        this.gain = 0;
        this.max = 0;
        this.min = 0;
        this.slope = [];
    }
}

export class Time {
    elapsed_time: number;
    moving_time: number;
    constructor() {
        this.elapsed_time = 0;
        this.moving_time = 0;
    }
}
