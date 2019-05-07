/* eslint-disable */
// import 'tippy.js/themes/light.css';

import * as d3 from "d3";
import * as constants from "../utils/constants";
import * as tippyManager from "./tippy_manager";
import * as templates from '../render/templates';
import {makeTippy} from "./tippy_manager";
import {makeNameTippy, destroyNameTippy} from "./tippy_manager";
import NamespaceTable from "../render/ns_table";

let CLICKED_ON = undefined;
let except = undefined;
let  MOUSE_ON = undefined;

const changeAllOpacityTo = (o) => d3
    .selectAll(".main_rect, .links, .end_marks, .start_marks")
    .transition(500)
    .attr("opacity", o);

const changeAllOpacityToExcept = (d, o, node = true) => {
    let arr = [...Object.values(d.svg)] ;
    if(node){
        d.links.map(link => Object.values(link.svg)).forEach(a => arr = [...arr, ...a]);
    d.links.forEach(l => {arr = [...arr, ...Object.values(l.target.svg)]});
    d.links.forEach(l => {arr = [...arr, ...Object.values(l.source.svg)]});
    }else{
        arr.push(d.source.svg['rect']);
        arr.push(d.target.svg['rect']);
    }
    console.log("ARR", arr);
    except = arr ;
    d3.selectAll(".main_rect, .links, .end_marks, .start_marks")
    .transition(500)
    .attr("opacity", function () { return arr.includes(this) ? 1 : 0.1}
    );
};

const changeLinksColorTo = (d, color, stroke) => {
    [d.source.svg['rect'], d.target.svg['rect'], ...Object.values(d.svg)]
        .forEach(svg => d3.select(svg)
        .attr('stroke', color)
            .attr('opacity', 1)
        .attr('stroke-width', stroke));

    [d.svg["end_mark"], d.svg["start_mark"]]
        .forEach((i) => d3.select(i).attr('fill', color).attr('opacity', 1));
};

const overLinks = (d) => {
    if(CLICKED_ON) return;
    changeLinksColorTo(d, constants.HIGHLIGHT_STROKE_COLOR,  constants.HIGHLIGHT_STROKE_WIDTH);
}

export const mouseOverLinks =  (d) => {
    if(CLICKED_ON || MOUSE_ON === d) return;

    MOUSE_ON = d;


    setTimeout(() => {
        if(MOUSE_ON === d) {
            changeAllOpacityToExcept(d, 0.1, false);
            overLinks(d);
        }}, constants.FADE_OUT_DELAY);


   overLinks(d);

};

const outLinks = (d) => changeLinksColorTo(d, constants.STROKE_COLOR, constants.STROKE_WIDTH);

export const mouseOutLinks = (d) => {
    if(CLICKED_ON) return;
    MOUSE_ON = null;
    changeAllOpacityTo(1);
    outLinks(d);
};

const changeNodesStrokeTo = (d, color, stroke, linksAction) => {
// get all the links comin from this node and for each do mouseOver
    d.links && d.links.length > 0 ? d.links.forEach(link => linksAction(link, color, stroke)) :

         d3.select(d.svg["rect"])
             .attr('stroke', color).attr('stroke-width', stroke)
             .attr("opacity", 1);

};


const overInterface =  (d) => {
    if(CLICKED_ON) return;

    changeNodesStrokeTo(d,
        constants.HIGHLIGHT_STROKE_COLOR, constants.HIGHLIGHT_STROKE_WIDTH, overLinks)
};

const outInterface = (d) => {
    if(CLICKED_ON) return;
    changeNodesStrokeTo(d,
        constants.STROKE_COLOR, function(d) { return d.json.type === "internal" ? 70 : constants.STROKE_WIDTH}, outLinks )
};

const nodesAndConnectionsFor = (d) => {
    let arr = [d.svg['rect']] ;
    d.links.map(link => Object.values(link.svg)).forEach(a => arr = [...arr, ...a]);
    d.links.forEach(l => {arr = [...arr, l.target.svg['rect']]});
    d.links.forEach(l => {arr = [...arr, l.source.svg['rect']]});
    return arr;
};

export const changeOpacityForNodesAndConnections = (d, o) =>
    nodesAndConnectionsFor(d).forEach(n =>{ if(!except.includes(n)) d3.select(n).attr('opacity', o)});


const changeNodeOpacity = (d, o) =>
   {
       nodesAndConnectionsFor(d).forEach(s => d3.select(s).transition(500).attr("opacity", o))
   };

export const mouseOverInterface = (d) => {

    if(CLICKED_ON) {

        changeNodeOpacity(d, 1);

    }else{

    MOUSE_ON = d;


    setTimeout(() => {
        if(MOUSE_ON === d) {
            changeAllOpacityToExcept(d, 0.1);
            overInterface(d, true);
        }}, constants.FADE_OUT_DELAY);


    overInterface(d);}

};

export const clickOnInterface = (d) => {

    if(CLICKED_ON === d) {
        CLICKED_ON = undefined;
        changeAllOpacityTo(1);
        if(d.hasTippy && d.svg['rect']._tippy.state.isMounted) tippyManager.hideTippy(d);
        return;
    }
    if(CLICKED_ON !== d || CLICKED_ON === undefined){
        if(d.hasTippy) {
        d.svg['rect']._tippy.state.isMounted ?  tippyManager.hideTippy(d) : tippyManager.showTippy(d);
    } else {
        d.hasTippy = true;
        tippyManager.makeTippy(d, templates.interfaceTemplate(d));
    }
        if(!CLICKED_ON) {
            CLICKED_ON = d;
            changeAllOpacityToExcept(d, 0.1);
        }
    }



};

export const clickOnNamespace = (ns) =>
{

    console.log("click");
    console.log("namespace", ns);
    ns.table.toggle();

};

export const mouseOutInterface = (d) => {

    if(CLICKED_ON) {
        if(CLICKED_ON !== d && !except.includes(d.svg['rect']))
            {nodesAndConnectionsFor(d)
                .forEach(n => !except.includes(n) ? d3.select(n).transition(500).attr('opacity', 0.1) : {}
                );
            }

    } else {
    MOUSE_ON = undefined;
    changeAllOpacityTo(1);
    outInterface(d, true);
    }


};


export const mouseOverNamespace = (d) => !CLICKED_ON ? d.interfaces.forEach(i => overInterface(i)) : {};
export const mouseOutNamespace = (d) => !CLICKED_ON && !d.table.shown ? d.interfaces.forEach(i => outInterface(i)) : {};

export const TARGET = () => {
   return CLICKED_ON;
};

export const HIGHLIGHTED = (d) => {
    return except.includes(d.svg['rect']);
}

