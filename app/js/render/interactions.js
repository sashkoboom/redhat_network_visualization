/* eslint-disable */

import * as d3 from "d3";
import * as constants from "../utils/constants";

const changeLinksColorTo = (d, color, stroke) => {

    [d.source.svg['rect'], d.target.svg['rect'], ...Object.values(d.svg)]
        .forEach(svg => d3.select(svg)
        .attr('stroke', color)
        .attr('stroke-width', stroke));

    [d.svg["end_mark"], d.svg["start_mark"]]
        .forEach((i) => d3.select(i).attr('fill', color));
};

export const mouseOverLinks =  (d) => changeLinksColorTo(d, constants.HIGHLIGHT_STROKE_COLOR,  constants.HIGHLIGHT_STROKE_WIDTH);

export const mouseOutLinks = (d) => changeLinksColorTo(d, constants.STROKE_COLOR, constants.STROKE_WIDTH);

const changeNodesStrokeTo = (d, color, stroke, linksAction) => {
// get all the links comin from this node and for each do mouseOver
    d.links && d.links.length > 0 ? d.links.forEach(link => linksAction(link, color, stroke)) :
        d3.select(d.svg["rect"])
                .attr('stroke', color)
                .attr('stroke-width', stroke)

};

export const mouseOverInterface =  (d) => changeNodesStrokeTo(d,
    constants.HIGHLIGHT_STROKE_COLOR, constants.HIGHLIGHT_STROKE_WIDTH, mouseOverLinks);

export const mouseOutInterface = (d) => changeNodesStrokeTo(d,
    constants.STROKE_COLOR, constants.STROKE_WIDTH, mouseOutLinks);




export const mouseOverNamespace = (d) => d.interfaces.forEach(i => mouseOverInterface(i));
export const mouseOutNamespace = (d) => d.interfaces.forEach(i => mouseOutInterface(i));



