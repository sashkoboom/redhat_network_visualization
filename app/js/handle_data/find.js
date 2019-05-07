/* eslint-disable */

import * as mouse from '../interactions/mouse';

export class Find {

    constructor(nm){

        this.networkDataManager = nm;

        this.input = document.querySelector('input[type="text"]');
        this.icon = document.querySelector('#find');

        document.querySelector('.search').classList.remove('hide');


        this.showInput = false;

        this.icon.addEventListener('click', () => {

            this.showInput ?
                this.hide()
             : this.input.classList.remove('hide') ;
            this.showInput = !this.showInput;

        });

        this.input.addEventListener('input', () => {
            if(!this.input.value || this.input.value.length < 1 ) return ;

            const interf = this.networkDataManager.getInterfaceByName(this.input.value);

            if(interf) mouse.clickOnInterface(interf);

        })
    }

    hide() {
        this.input.value = '';
        this.input.classList.add('hide');
    }

}