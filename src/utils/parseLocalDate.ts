import dayjs from 'dayjs';
import { find } from 'geo-tz';
import { GPX } from '../models/Gpx';

export const parseDate = (
    gpx: GPX
): {
    local_date: string;
    date: string;
    timezone: string;
    offset: number;
} => {
    const { lat, lon } = gpx.tracks[0].points[0];
    const _date = gpx.metadata?.time || '';
    const timezone = find(lat, lon)[0];
    const dateObject = dayjs(_date).tz(timezone);
    const local_date = dateObject.format('YYYY-MM-DDTHH:mm:ss[Z]');
    const offset = calcOffset(dateObject.format('Z'));
    return { date: _date, local_date, offset, timezone };
};

const calcOffset = (_offset: string): number => {
    const pos = _offset[0] === '+';
    const hours = Number(_offset.substring(1, 3));
    const minutes = hours * 60 + Number(_offset.substring(4, 6));
    return pos ? minutes : -1 * minutes;
};
