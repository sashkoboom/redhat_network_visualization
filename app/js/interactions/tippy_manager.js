/* eslint-disable */

import tippy from "tippy.js";
import 'tippy.js/themes/light-border.css';

export const makeTippy = (d) => {

/*
* interface name
driver
IPv6, IPv4 addresses
MAC address
MTU
* */
    const template = `
<div>
<p>driver: <strong>${d.json.driver}</strong></p>
// addresses
<p> <strong>${d.json.mac}</strong></p>
<p>MTU <strong>${d.json.mtu}</strong></p>
<div>`;

    const container = document.createElement('div');
    container.insertAdjacentHTML('beforeend', template);


    tippy(d.svg['rect'], {
        content: container.innerHTML,
        animation: 'scale',
        duration: 100,
        allowHTML: true,
        interactive: true,
        placement: "right-start",
        sticky: true,
        arrow: true,
        theme: "light-border",
        delay: [0, 200],
    });

};