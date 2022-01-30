import { XMLParser } from 'fast-xml-parser';
import { Distance, Elevation, GPX, Time, Track } from '../models/Gpx';
import { RequestError } from './RequestError';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.extend(utc);

export const parseGpx = (data: string) => {
    const gpxData = parseXML(data);
    const gpx = new GPX();
    if (gpxData.metadata) {
        gpx.metadata = parseMetaDataNode(gpxData.metadata);
    }
    if (gpxData.trk) {
        gpx.tracks = [];
        gpxData.trk.forEach((node) => {
            const track = parseTrackNode(node);
            gpx.tracks.push(track);
        });
    }
    return gpx;
};

const parseXML = (data: string): XMLGPX => {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '',
            parseAttributeValue: true,
            isArray: (name) => {
                if (['trk', 'trkseg'].indexOf(name) !== -1) return true;
                return false;
            },
        });
        const gpxData = parser.parse(data);
        if (!gpxData.gpx) throw new RequestError('Invalid GPX data');

        return gpxData.gpx;
    } catch (error) {
        throw new RequestError('Invalid GPX data');
    }
};

const parseMetaDataNode = (node: XMLMetadata): Metadata => {
    const metadata: Metadata = {};
    if (node.time) metadata.time = node.time;
    return metadata;
};

const parseTrackNode = ({ name, trkseg, type }: XMLTrack): Track => {
    const track = new Track();
    if (name) {
        track.name = name;
    }
    if (trkseg) {
        track.points = [];
        trkseg.forEach((seg) => {
            const segPoints = parseTrackSegmentNode(seg);
            track.points.push(...segPoints);
        });
        track.distance = calculateDistance(track.points);
        track.elevation = calcElevation(track.points);
        track.time = calculateTime(track);
    }
    if (type) {
        track.type = type;
    }
    return track;
};

const parseTrackSegmentNode = (node: XMLSegment): Point[] => {
    const points: Point[] = [];
    if (node.trkpt) {
        node.trkpt.forEach(({ ele, lat, lon, time }) => {
            if (!lat || !lon) return;
            const point: Point = { lat, lon };
            if (ele) {
                point.ele = ele;
            }
            if (time) {
                point.time = time;
            }
            points.push(point);
        });
    }
    return points;
};

const calculateDistance = (points: Point[]): Distance => {
    const cumulative = [0];
    for (let i = 1; i < points.length; i++) {
        const point1 = points[i - 1];
        const point2 = points[i];
        const d = distanceBetweenPoints(point1, point2);
        cumulative.push(cumulative[i - 1] + d);
    }
    const total = cumulative[points.length - 1];
    return { total, cumulative };
};

const distanceBetweenPoints = (point1: Point, point2: Point): number => {
    const R = 6371e3; // Earth radius in metres
    const lat1 = (point1.lat * Math.PI) / 180;
    const lat2 = (point2.lat * Math.PI) / 180;
    const latDelta = ((point2.lat - point1.lat) * Math.PI) / 180;
    const lonDelta = ((point2.lon - point1.lon) * Math.PI) / 180;

    const a =
        Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(lonDelta / 2) *
            Math.sin(lonDelta / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
};

const calcElevation = (
    points: Point[],
    spread: number = 14,
    tolerance: number = 4
): Elevation => {
    let gain = 0;
    let min = points[0].ele || Infinity;
    let max = points[0].ele || -Infinity;
    let slope = [0];
    let ele1 = points[0].ele;
    for (let i = 1; i < points.length; i++) {
        let ele2 = points[i].ele;
        if (!ele1 || !ele2) {
            slope.push(0);
            continue;
        }
        min = Math.min(min, ele2);
        max = Math.max(max, ele2);
        slope.push((ele2 * 10 - ele1 * 10) / 10);
        if (i % spread !== 0) continue;
        ele1 = ele1 * 10;
        ele2 = ele2 * 10;
        if (ele2 - ele1 > tolerance) {
            gain += ele2 - ele1;
        }
        ele1 = points[i].ele;
    }
    return { gain: gain / 10, max, min, slope };
};

const calculateTime = (track: Track): Time => {
    const elapsed_time = calcElapsedTime(track.points);
    const moving_time = calcMovingTime(track);
    return { elapsed_time, moving_time };
};

const calcElapsedTime = (points: Point[]) => {
    const start = dayjs(points[0].time);
    const end = dayjs(points[points.length - 1].time);
    const duration = dayjs.duration(end.diff(start));
    return duration.asSeconds();
};

const calcMovingTime = (track: Track) => {
    const { distance, points } = track;
    const cumulDistances = distance.cumulative;
    let prevTime = points[0].time;
    let prevDist = cumulDistances[0];
    let totalTime = 0;
    points.forEach((point, i) => {
        const currDist = cumulDistances[i];
        const start = dayjs(prevTime);
        const end = dayjs(point.time);
        const duration = dayjs.duration(end.diff(start)).asSeconds();
        if (duration < 30) {
            totalTime += duration;
        }
        prevDist = currDist;
        prevTime = point.time;
    });
    return totalTime;
};
