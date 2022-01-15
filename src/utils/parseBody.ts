import GpxParser from 'gpxparser';
import { EventBody } from '../types';
import { RequestError } from './RequestError';

export const parseBody = (body: any): EventBody => {
    const _body: EventBody = { activity: '' };
    const errors: string[] = [];

    if (body.activity && typeof body.activity === 'string') {
        const isBase64 =
            /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(
                body.activity
            );
        if (!isBase64) {
            errors.push('Activity needs to be base64 encoded');
        } else {
            const activity = Buffer.from(body.activity, 'base64').toString(
                'ascii'
            );
            _body.activity = activity;
        }
    } else {
        errors.push('Activity Missing');
    }

    if (errors.length > 0) {
        throw new RequestError(errors.join(', '));
    } else {
        return _body;
    }
};
