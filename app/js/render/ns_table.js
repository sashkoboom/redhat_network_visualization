/* eslint-disable */

import * as d3 from 'd3';
import * as constants from '../utils/constants'
import * as templates from './templates';
import { validSelectorFromString } from "../utils/helpers";

export const NS_TABLES = [];

export const clearNsTables = () => NS_TABLES.forEach(t => t.hide());



export class NamespaceTable  {

    constructor(ns){
      this.ns = ns ;
      this.mounted = false;
      this.shown = false;
      this.div = document.createElement("div");
      this.tables = [];
    }

    render(){
        const nameDiv = document.createElement('div');
        nameDiv.innerHTML = this.ns.name || this.ns.name.length > 0 ? this.ns.name : "/";
        nameDiv.classList.add('routing-ns-name');

        this.div.appendChild(nameDiv);

        const closeBtn = document.createElement('div');
        closeBtn.classList.add('close-thin-routing');
        closeBtn.addEventListener('click', () => this.hide());
        this.div.appendChild(closeBtn);



        const span = this.div.appendChild(document.createElement('span'));

        span.innerHTML = templates.nameSpaceTemplate(this.ns);
        this.div.classList.add('routing-container');


        document.querySelector('body').appendChild(this.div);

        if(this.ns.json.routes && Object.keys(this.ns.json.routes).length > 0 ) {

            Object.keys(this.ns.json.routes).forEach(k => {
                const table = this.ns.json.routes[k];
                table.i = k;
                table.display = false;
                table.HTML = document.querySelector
                (`#${validSelectorFromString(this.ns.id)}_${validSelectorFromString(this.ns.json.routes[k].name)}`);
                table.HTML.querySelector('.routing-name')
                    .addEventListener("click", () => {

                            table.display ?
                                table.HTML.querySelector('table').classList.add('hide')
                                :
                                table.HTML.querySelector('table').classList.remove('hide')
                            ;
                            table.display = !table.display;
                        }
                    );
                this.tables.push(table)
            });

        }
        this.mounted = true;
    }

    toggle() {
        this.shown ? this.hide() : this.show() ;
    }

    show() {

        if(this.shown) return;

        NS_TABLES.forEach(t => t.hide());

        this.shown = true;
        d3.select(this.ns.svg['rect']).attr('fill', constants.LIGHTER_GREEN);
        if (!this.mounted) {
            this.render()
        }
        else {
            this.div.classList.remove('hide');
        }

    }

    hide(){
        if(!this.shown) return;

        d3.select(this.ns.svg['rect']).attr('fill', constants.GREEN);
        this.shown = false;
        this.div.classList.add('hide')
    }



};
