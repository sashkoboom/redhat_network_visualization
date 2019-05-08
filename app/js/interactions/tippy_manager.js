/* eslint-disable */
import * as d3 from 'd3';
import tippy from "tippy.js";
import 'tippy.js/themes/light-border.css';
import * as mouse from "./mouse";
import {validSelectorFromString} from "../utils/helpers";



export const hideTippy = (d) =>  {
    d.svg['rect']._tippy.enable();
    d.svg['rect']._tippy.hide();
    d.opennedTippy = false;
};

export const makeNameTippy = (d) => {

    const container = document.createElement('div');
    container.insertAdjacentHTML('beforeend', d.name);


    tippy(d.svg['rect'], {
        content: container.innerHTML,
        animation: 'scale',
        duration: 100,
        allowHTML: true,
        interactive: true,
        placement: 'left',
        sticky: true,
        arrow: true,
        theme: "light-border",
        delay: [0, 200],
        trigger: "manual",
    });

    showTippy(d);

};

export const destroyNameTippy = (d) => {d.svg['rect']._tippy.hide();  d.svg['rect']._tippy.destroy()};

export const makeTippy = (d, template, dir = "right-start") => {


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
    d.opennedTippy = true;

    const closeBtn = document.querySelector(`#close_${validSelectorFromString(d.id)}`);

    closeBtn.addEventListener("click", () => {
        hideTippy(d);

        if(mouse.TARGET()){
            if (mouse.TARGET() === d) {
            mouse.clickOnInterface(d);
                return;
        }


            if(!mouse.HIGHLIGHTED(d)){
                mouse.changeOpacityForNodesAndConnections(d, 0.1)
            }
        }
    }
    );


    // const plusBtn = document.querySelector(`#plus_${d.name}`);
    //
    // plusBtn.addEventListener("click", () => {
    //     const containerB = document.createElement('div');
    //     containerB.insertAdjacentHTML('beforeend', templates.routing);
    //     setContent(d, containerB);
    //
    //
    // });

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

export const makeLineTippy = (d, template) => {



    const container = document.createElement('div');
    container.insertAdjacentHTML('beforeend', template);

    tippy(d.svg['link'], {
        content: container.innerHTML,
        followCursor: 'initial',
        animation: 'scale',
        duration: 100,
        allowHTML: true,
        interactive: true,
        trigger: 'click',
        lazy: 'false',
        arrow: true,
        theme: "light-border",
        delay: 200,
    });








};

const setContent = (d, c) => d.svg['rect']._tippy.setContent(c);

export const showTippy = (d) =>  {
    d.svg['rect']._tippy.show();
    d.svg['rect']._tippy.disable()
    d.opennedTippy = true;

};


