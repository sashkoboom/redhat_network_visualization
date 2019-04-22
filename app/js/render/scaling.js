/* eslint-disable */
import * as d3 from "d3";
import * as constants from "../utils/constants";
import * as graphics from "./graphics";

/// selection.node.getComputedTextLength()

class Scale {
    constructor(interf) {
        this.collision = 100;
        this.interfaces = interf;
        if (new.target === Scale) {
            throw new TypeError("Cannot construct abstact instances directly");
        }
    }

    handleScale(){
        this.handleTextOnNodes();
        this.handleNodesSize();
    }

    handleNodesSize(){

        let col = 100 ;

        this.interfaces.forEach(i => {
            i.width = graphics.rectW(i, this);
            i.innerWidth = graphics.innerRectW(i, this);

            i.height = graphics.rectH(i, this);
            i.innerHeight = graphics.innerRectH(i, this);

            col = Math.max(col, i.width, i.height);
        });

        this.setCollision(col);

        this.changeSize();
    }

    setCollision(c){
        this.collision = c;
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

    textPlacement(d) {
    d.attr('x', d => d.delta.x + 30)
            .attr('y', d => d.delta.y + 50);
    }

    changeSize(){
        d3.selectAll('.main_rect')
            .attr('width', d => d.width)
            .attr('height', d => d.height);

        d3.selectAll('.inner_rect')
            .attr('width', d => d.innerWidth)
            .attr('height', d => d.innerHeight);


    }

    widthRect(d) {
        return constants.INTERFACE_BOX.width
    }

    heightRect(d) {
        return constants.INTERFACE_BOX.height
    }

}

export class StandardScale extends Scale {
    constructor(i) {
        super(i);
        this.scale = 0;
        // d3.selectAll("rect").attr("fill", "red");
    }

    textPlacement(d) {
        d.attr('x', d => d.delta.x + 30)
            .attr('y', d => d.delta.y + 50);
    }

    setCollision(c){
        this.collision = c * 0.5;
    }



    handleTextOnNodes(){

        this.changeInterfaceTextsTo([
            selection => this.changeTextToWithSize(selection,
                    d => d.texts["text_1"],
                constants.INTERFACE_BOX.fontsize[this.scale] )
            ,
            selection => this.changeTextToWithSize(selection,
                "",
                0 ),
            selection => this.changeTextToWithSize(selection,
                "",
                0 )]
        )

    }

    widthRect(d) {

        let textlength = d.svg['text_1'] ? d.svg['text_1'].getComputedTextLength() : 0;
        textlength = Math.max(textlength, 40);
        // by length of name
        return textlength + 2 * constants.INTERFACE_BOX.paddingIn + 2 * constants.INTERFACE_BOX.paddingOut
    }

    heightRect(d) {
        // 2 * padding + 1 * line : 2 * lines

        const r = 2 * constants.INTERFACE_BOX.paddingIn
            + 2 * constants.INTERFACE_BOX.paddingOut
            + constants.INTERFACE_BOX.fontsize[this.scale];
        console.log("RRRRRR", r);
        return r;

}
}

export class UpScale extends Scale {



    constructor(i) {
        super(i);
        this.scale = 1;
        // d3.selectAll("rect").attr("fill", "blue");
    }

    textPlacement(d) {
        d.attr('x', d => d.delta.x + 30)
            .attr('y', d => d.delta.y + 50);
    }

    handleTextOnNodes(){
        // all 3 visible

        const change = (selection, t) => this.changeTextToWithSize(selection,
            d => d.texts[t],
            constants.INTERFACE_BOX.fontsize[this.scale] );

        this.changeInterfaceTextsTo([
            selection => change(selection, "text_1")
            ,
            selection => change(selection, "text_2")
            ,
            selection => change(selection, "text_3")
            ,
        ])

    }

    widthRect(d) {

        let textlength = 0;
        /// selection.node.getComputedTextLength()

        if(d.json.mac && d.json.mac.length >= d.json.name.length){

          textlength = d.svg['text_3'] ? d.svg['text_3'].getComputedTextLength() : 0;

        }else{
            textlength = d.svg['text_1'] ? d.svg['text_1'].getComputedTextLength() : 0;
        }

        textlength = d.svg['text_2'] ? Math.max(textlength, d.svg['text_2'].getComputedTextLength()) : textlength;

        return textlength + 2 * constants.INTERFACE_BOX.paddingIn + 2 * constants.INTERFACE_BOX.paddingOut
    }

    heightRect(d) {

        let count = 0;

        if(d.name) count++;
        if(d.json.mac) count++;
        if(d.json.mtu) count++;

        console.log("count", count);
        console.log("2 * constants.INTERFACE_BOX.paddingIn", 2 * constants.INTERFACE_BOX.paddingIn);
        console.log("2 * constants.INTERFACE_BOX.paddingOut", 2 * constants.INTERFACE_BOX.paddingOut);
        console.log("constants.INTERFACE_BOX.fontsize[this.scale.scale] * count",
            constants.INTERFACE_BOX.fontsize[this.scale] * count);

        // paddingOut * 2 + paddingIn * 2 +  height of line * count of lines
        const r = 2 * constants.INTERFACE_BOX.paddingIn
            + 2 * constants.INTERFACE_BOX.paddingOut
            + constants.INTERFACE_BOX.fontsize[this.scale] * count;

        return r;
    }

    setCollision(c){
        this.collision = c * 0.6;
    }

}

export class DownScale extends Scale {
    constructor(i) {
        super(i);
        this.scale = -1;
        // d3.selectAll("rect").attr("fill", "yellow");
    }

    textPlacement(d) {
        d.attr('x', d => d.delta.x + 30).attr('y', d => d.delta.y + 50);
    }

    handleTextOnNodes(){
            // no text
        this.changeInterfaceTextsTo( [
            selection => selection.text(() => ''),
            selection => selection.text(() => ''),
            selection => selection.text(() => ''),
        ])
    }


    widthRect(d) {
        return constants.INTERFACE_BOX.width
    }

    heightRect(d) {
        return constants.INTERFACE_BOX.height
    }

    setCollision(c){
        this.collision = c * 0.8;
    }

}