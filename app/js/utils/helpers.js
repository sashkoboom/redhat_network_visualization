/**
 * Created by sashkoboom on 5. 3. 2018.
 */

/* eslint-disable */

import * as constants from "./constants";

const checkLineIntersection = (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) => {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    let denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
            // it is worth noting that this should be the same as:
            x = line2StartX + (b * (line2EndX - line2StartX));
            y = line2StartX + (b * (line2EndY - line2StartY));
            */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

const testWithLine = (line, d) => checkLineIntersection(
    d.source.x + constants.INTERFACE_BOX.width / 2,
    d.source.y + constants.INTERFACE_BOX.height / 2,
    d.target.x + constants.INTERFACE_BOX.width / 2,
    d.target.y + constants.INTERFACE_BOX.height / 2,
     line[0], line[1], line[2], line[3]
);


export function getIntersection(d, attr){

    const squareLines = [
        // top
        [d.target.x,
            d.target.y,
            d.target.x + constants.INTERFACE_BOX.width,
            d.target.y,],
        //left
        [d.target.x,
            d.target.y,
            d.target.x,
            d.target.y + constants.INTERFACE_BOX.height],
        // right
        [d.target.x + constants.INTERFACE_BOX.width,
            d.target.y,
            d.target.x + constants.INTERFACE_BOX.width,
            d.target.y + constants.INTERFACE_BOX.height,]
        //bottom
        ,[d.target.x,
            d.target.y + constants.INTERFACE_BOX.height,
            d.target.x + constants.INTERFACE_BOX.width,
            d.target.y + constants.INTERFACE_BOX.height,],

    ];

    for(const l of squareLines){
        const r = testWithLine(l, d);
        if(r.onLine1 && r.onLine2) return r[attr]
    }

    return 0;
}