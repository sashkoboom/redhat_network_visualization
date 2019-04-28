/* eslint-disable */
// import 'tippy.js/themes/light.css';

import * as d3 from "d3";
import * as constants from "../utils/constants";
import * as tippyManager from "./tippy_manager";


let  MOUSE_ON = undefined;

const changeAllOpacityTo = (o) => d3
    .selectAll(".main_rect, .links, .end_marks, .start_marks")
    .transition(500)
    .attr("opacity", o);

const changeAllOpacityToExcept = (o, d) => {

    let arr = [...Object.values(d.svg)] ;
    d.links.map(link => Object.values(link.svg)).forEach(a => arr = [...arr, ...a]);
    d.links.forEach(l => {arr = [...arr, ...Object.values(l.target.svg)]});
    d.links.forEach(l => {arr = [...arr, ...Object.values(l.source.svg)]});
    console.log("ARR", arr);
    d3.selectAll(".main_rect, .links, .end_marks, .start_marks")
    .transition(500)
    .attr("opacity", function () { return arr.includes(this) ? 1 : 0.1}
    );
}

const changeLinksColorTo = (d, color, stroke) => {


    [d.source.svg['rect'], d.target.svg['rect'], ...Object.values(d.svg)]
        .forEach(svg => d3.select(svg)
        .attr('stroke', color)
            .attr('opacity', 1)
        .attr('stroke-width', stroke));

    [d.svg["end_mark"], d.svg["start_mark"]]
        .forEach((i) => d3.select(i).attr('fill', color).attr('opacity', 1));
};

export const mouseOverLinks =  (d) => {
    changeLinksColorTo(d, constants.HIGHLIGHT_STROKE_COLOR,  constants.HIGHLIGHT_STROKE_WIDTH)};

export const mouseOutLinks = (d) => {
    changeLinksColorTo(d, constants.STROKE_COLOR, constants.STROKE_WIDTH)};

const changeNodesStrokeTo = (d, color, stroke, linksAction) => {
// get all the links comin from this node and for each do mouseOver
    d.links && d.links.length > 0 ? d.links.forEach(link => linksAction(link, color, stroke)) :
        d3.select(d.svg["rect"])
                .attr('stroke', color)
                .attr('stroke-width', stroke)
            .attr("opacity", 1)

};


const overInterface =  (d) => {
    // changeAllOpacityTo(0.1);
    changeNodesStrokeTo(d,
        constants.HIGHLIGHT_STROKE_COLOR, constants.HIGHLIGHT_STROKE_WIDTH, mouseOverLinks)
};

const outInterface = (d) => {
    // changeAllOpacityTo(1);
    changeNodesStrokeTo(d,
        constants.STROKE_COLOR, function(d) { return d.json.type === "internal" ? 70 : constants.STROKE_WIDTH}, mouseOutLinks)
};

export const mouseOverInterface =  (d) => {
    MOUSE_ON = d;


    setTimeout(() => {
        if(MOUSE_ON === d) {
            changeAllOpacityToExcept(0.1, d);
            overInterface(d);
        }}, constants.FADE_OUT_DELAY);


    overInterface(d);
};

export const clickOnInterface = (d) => {
    console.log("eba", d);

    if(d.hasTippy) {

        d.svg['rect']._tippy.state.isMounted ?  tippyManager.hideTippy(d) : tippyManager.showTippy(d);

    } else {
        d.hasTippy = true;
        tippyManager.makeTippy(d)
    };
};

export const mouseOutInterface = (d) => {
    MOUSE_ON = undefined;
    changeAllOpacityTo(1);
    outInterface(d);
};


export const mouseOverNamespace = (d) => d.interfaces.forEach(i => overInterface(i));
export const mouseOutNamespace = (d) => d.interfaces.forEach(i => outInterface(i));



