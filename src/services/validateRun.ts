import { parseGpx } from '../utils/parseGpx';
import { parseDate } from '../utils/parseLocalDate';
import { EventBody } from '../types';
import { Activity } from '../models/Activity';
export const validateRun = ({ activity }: EventBody) => {
    const parsedActivity = parseGpx(activity);
    const _activity = new Activity().fromGpx(parsedActivity);
    const date = parseDate(parsedActivity);
    _activity.addDate(date);
    return _activity;
};
