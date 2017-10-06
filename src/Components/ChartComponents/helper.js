import * as d3 from 'd3';

/**
 * will return a string color based on the scema and index provided
 * @param schema Name of the d3 ordinal color scale schema (default: category10)
 * @param index Index of the color in the array
 */
export function getColorFromSchemaOrdinal(schema, index) {
    let length = 20, schemeCat;

    switch (schema) {
        case 'category10':
            schemeCat = d3.schemeCategory10;
            length = 10;
            break;
        case 'category20':
            schemeCat = d3.schemeCategory20;
            break;
        case 'category20b':
            schemeCat = d3.schemeCategory20b;
            break;
        case 'category20c':
            schemeCat = d3.schemeCategory20c;
            break;

    }

    return d3.scaleOrdinal()
        .range(schemeCat)
        .domain(Array.apply(null, {length: length}).map(Number.call, Number))(index);
}


/**
 * Gives a range of colors that can be used in the scatter plot color range
 * @param scheme color scheme given as a string
 */
export function getColorRangeArray(scheme) {
    return Array.apply(null, {length: scheme.substring(8, 10)}).map(Number.call, Number).map((num) => getColorFromSchemaOrdinal(scheme, num));
}