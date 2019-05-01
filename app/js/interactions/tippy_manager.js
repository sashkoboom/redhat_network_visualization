/* eslint-disable */

import tippy from "tippy.js";
import 'tippy.js/themes/light-border.css';


export const hideTippy = (d) =>  {
    d.svg['rect']._tippy.hide()
};

export const makeNameTippy = (d) => {

    console.log("hm", d);
    const container = document.createElement('div');
    container.insertAdjacentHTML('beforeend', d.name);


    tippy(d.svg['rect'], {
        content: container.innerHTML,
        animation: 'scale',
        duration: 100,
        allowHTML: true,
        interactive: true,
        placement: 'top',
        sticky: true,
        arrow: true,
        theme: "light-border",
        delay: [0, 200],
        trigger: "manual",
    });

    showTippy(d);

}

export const destroyNameTippy = (d) => {d.svg['rect']._tippy.hide();  d.svg['rect']._tippy.destroy()};

export const makeTippy = (d, template, dir = "right-start") => {

/*
* interface name
driver
IPv6, IPv4 addresses
MAC address
MTU
* */





// const bigger = `<div class="tooltip_big"> <span id="close_${d.name}" class="close-thin"></span>
//
// <div> ${d.name}</div>
//
// <div>driver:${d.json.driver ? d.json.driver : "none"}</div>
//
// <div>${d.json.addresses.length > 0 ? "adrrr" : "no IP addresses"}</div>
//
// <div>${d.json.mac ? d.json.mac : "no MAC addr"}</div>
//
// <div>MTU ${d.json.mtu}</div>
//
// <div class="round-button" id="minus_${d.name}">
//   &#8722;
// </div>
// </div>`;


    const container = document.createElement('div');
    container.insertAdjacentHTML('beforeend', template);


    tippy(d.svg['rect'], {
        content: container.innerHTML,
        animation: 'scale',
        duration: 100,
        allowHTML: true,
        interactive: true,
        placement: dir,
        sticky: true,
        arrow: true,
        theme: "light-border",
        delay: [0, 200],
        trigger: "manual",
    });

    showTippy(d);


    const plusBtn = document.querySelector(`#plus_${d.name}`);

    plusBtn.addEventListener("click", () => {
        const containerB = document.createElement('div');
        containerB.insertAdjacentHTML('beforeend', templates.routing);
        setContent(d, containerB);

        const closeBtn = document.querySelector(`#close_${d.name}`);

        closeBtn.addEventListener("click", () => { hideTippy(d) });
    });

 const minusBtn = document.querySelector(`#minus_${d.name}`);
    //
    // minusBtn.addEventListener("click", () => {
    //     const container = document.createElement('div');
    //
    //
    //     container.insertAdjacentHTML('beforeend', template);
    //     setContent(d, container);
    // });





};

const setContent = (d, c) => d.svg['rect']._tippy.setContent(c);

export const showTippy = (d) =>  d.svg['rect']._tippy.show();


