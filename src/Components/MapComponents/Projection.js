import {geoMercator} from 'd3-geo';

import defaultCofig from './ProjectionConfig';

export default function (width, height, config) {
    const scale = config.scale || defaultCofig.scale;
    const xOffset = config.xOffset || defaultCofig.xOffset;
    const yOffset = config.yOffset || defaultCofig.yOffset;
    const rotation = config.rotation || defaultCofig.rotation;
    const precision = config.precision || defaultCofig.precision;

    return geoMercator()
        .scale(scale)
        .translate([xOffset+width/2,yOffset+height/2])
        .rotate(rotation)
        .precision(precision);



}

