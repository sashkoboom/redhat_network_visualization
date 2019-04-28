/* eslint-disable */

import tippy from "tippy.js";
import 'tippy.js/themes/light-border.css';

export const hideTippy = (d) =>  {
    d.svg['rect']._tippy.hide()
};

export const makeTippy = (d) => {

/*
* interface name
driver
IPv6, IPv4 addresses
MAC address
MTU
* */


const krestik = '  <span id="close_${d.name}" class="close-thin"></span>'

    const template = `
<div class="tooltip_small">



<div> ${d.name}</div>

<div>driver:${d.json.driver ? d.json.driver : "none"}</div>

<div>${d.json.addresses.length > 0 ? "adrrr" : "no IP addresses"}</div>

<div>${d.json.mac ? d.json.mac : "no MAC addr"}</div>

<div>MTU ${d.json.mtu}</div>

<div class="round-button">
  &#43;
</div>

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
        trigger: "manual",
    });

    showTippy(d);

    const closeBtn = document.querySelector(`#close_${d.name}`);

    closeBtn.addEventListener("click", () => { hideTippy(d) });

};

export const showTippy = (d) =>  d.svg['rect']._tippy.show();


