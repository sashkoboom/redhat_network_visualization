/* eslint-disable */

import { validSelectorFromString } from "../utils/helpers";

const addr = (d) => {
    if(!d.json.addresses || d.json.addresses.length < 1) return '';
    let r = '<div class="addr_container">';
    d.json.addresses.forEach(adr => {
        r += `<span class="round_span_addr">${adr.address}</span>`
    });
    r+= '</div>'
    return r;
}


export const interfaceTemplate = (d) => `
<div class="tooltip_small">
    <span id='close_${validSelectorFromString(d.id)}'class="close-thin-tippy"></span>
    <div> ${d.name} </div>

    <div><span class="dot_${d.json.state}"></span> state : ${d.json.state} </div>

     ${d.json.driver ? `<div>driver: ${d.json.driver}</div>` : ''} 
   
        ${addr(d)}
    
    ${ d.json.mac ? `<div> MAC <span class="round_span_addr"> ${d.json.mac}</span></div>` : '' }

    <div>MTU ${d.json.mtu}</div>

</div>`;

const plus = ' <div class="round-button" id="plus_${d.name}">&#43; </div>';

const th = ['family', 'gateway','iif','metrics', 'oif', 'priority',
    'protocol', 'scope', 'source', 'preferred-source','tos', 'type'];

export const nameSpaceTemplate = (ns) =>{
    console.log(ns.json.routes);
    const tables = [];

    const value = (val) => {
        if(!val) return '';

        if (typeof val === 'string' || val instanceof String) return val ;

        if(typeof val === 'object') {
            let s = '';
            Object.keys(val).forEach(key =>
                s += `${key} : ${val[key]} \n`
            );
            return s ;
        }

        return val;
    };

    if(!ns.json.routes || Object.keys(ns.json.routes).length < 1) {

        return "no roating tables loaded"

    } else {Object.keys(ns.json.routes).forEach(
        k => {
        let t = `<div class="routing-wrap" id="${validSelectorFromString(ns.id)}_${validSelectorFromString(ns.json.routes[k].name)}">
<div class="routing-name">${k} : ${ns.json.routes[k].name}</div>
<table class="routing hide">`;
        th.forEach(h => t += `<th>${h}</th>`);

            ns.json.routes[k].routes.forEach(route => {
                let tr = '<tr>';
                th.forEach( th =>
                tr += `<td>${ value(route[th]) }</td>`
                );
                tr += '</tr>';
                t += tr;
            });

            t += '</table></div>';

            tables.push(t);
        }
    );}


    let r = '';
    tables.forEach(t => r += t);

    return r;
};

export const name = (d) => d.name ;