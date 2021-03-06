/**
 * Created by sashkoboom on 5. 3. 2018.
 */
/* eslint-disable */

/*Tool to generate color scheme for future graph*/

import { validSelectorFromString } from "../utils/helpers";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const ColorManager = class{
    constructor(namespaces = []){
        //generate colors for each namespace
        this.colors = {};
        //make new arr, fill it with indexes 0...namespace.length a than with interpolated indexes, mix it randomly
        let arr = [... new Array(namespaces.length).keys()]
            .map(x => x * 360 / namespaces.length)
            .map(x => `hsl(${x}, 60%, 89%)`);
        shuffleArray(arr);
        //generate object {namespace : color}
        (namespaces).forEach(
            (namespace) => this.colors[namespace] = arr[namespaces.indexOf(namespace)]
        );
        //make list of CSS classnames corresponding namespace names
        this.classNames = {};
        (namespaces).forEach(namespace => {
            //const cropped = namespace.replace("/", "");
            //this.classNames[namespace] =  cropped === "" ? "main_ns" : cropped;
            this.classNames[namespace] = this.namespaceToClassname(namespace);
        });
        //make a stylesheet for further color manipulation
        const sheet = document.createElement('style');
        Object.keys(this.colors).forEach((namespace) =>{
            sheet.innerHTML += `.${this.classNames[namespace]}{
            background-color : ${this.colors[namespace]} ;
            fill : ${this.colors[namespace]}}\n`
        });
        // console.log(sheet);
        // console.log(this.colors);
        document.body.appendChild(sheet);
    }


    getColor(str){
        return '#99CCCC';
    }

    getColorForNode(node){
    return '#99CCCC'
    }

    getClassName (str){return this.classNames[str];}

    namespaceToClassname(ns){
        return "namespace_" + validSelectorFromString(ns) }
};

export default ColorManager;
