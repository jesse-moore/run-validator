interface XMLGPX {
    trk: XMLTrack[];
    metadata: XMLMetadata;
}
interface XMLPoint {
    ele?: number;
    time?: string;
    lat: number;
    lon: number;
}

interface XMLTrack {
    name?: string;
    type?: number;
    trkseg?: XMLSegment[];
}

interface XMLSegment {
    trkpt?: XMLPoint[];
}

interface XMLMetadata {
    time?: string;
}
