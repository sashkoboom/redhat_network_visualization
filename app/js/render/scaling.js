/* eslint-disable */
import * as d3 from "d3";
import * as constants from "../utils/constants";


class Scale {
    constructor() {
        if (new.target === Scale) {
            throw new TypeError("Cannot construct abstact instances directly");
        }
    }

    handleScale(){
        this.handleTextOnNodes();
        // this.handleNodesWidth();
    }

    changeInterfaceTextsTo(functions){

        [".text_1", '.text_2', '.text_3'].forEach(
            (t, index) => {
                const selection = d3.selectAll(t);
                   // selection.text(d => {return functions[index](d)})
                functions[index](selection);
            })


    }

    handleTextOnNodes(){

    }

    changeTextToWithSize(selection, totext, withsize){
        selection.text(totext).attr("font-size", withsize);
    }

}

export class StandardScale extends Scale {
    constructor() {
        super();
        // d3.selectAll("rect").attr("fill", "red");
    }

    handleTextOnNodes(){

        this.changeInterfaceTextsTo([
            selection => this.changeTextToWithSize(selection,
                    d => d.texts["text_1"],
                constants.INTERFACE_BOX.fontsize.standard )
            ,
            selection => this.changeTextToWithSize(selection,
                "",
                0 ),
            selection => this.changeTextToWithSize(selection,
                "",
                0 )]
        )


        // make bigger font


        // change w h of nodes
    }
}

export class UpScale extends Scale {
    constructor() {
        super();
        // d3.selectAll("rect").attr("fill", "blue");
    }

    handleTextOnNodes(){
        // all 3 visible

        const change = (selection, t) => this.changeTextToWithSize(selection,
            d => d.texts[t],
            constants.INTERFACE_BOX.fontsize.up );

        this.changeInterfaceTextsTo([
            selection => change(selection, "text_1")
            ,
            selection => change(selection, "text_2")
            ,
            selection => change(selection, "text_3")
            ,
        ])

        // make smaller font

        // change w h of nodes

    }
}

export class DownScale extends Scale {
    constructor() {
        super();
        // d3.selectAll("rect").attr("fill", "yellow");
    }

    handleTextOnNodes(){
// no text
        this.changeInterfaceTextsTo( [
            selection => selection.text(() => ''),
            selection => selection.text(() => ''),
            selection => selection.text(() => ''),
        ])
    }

}