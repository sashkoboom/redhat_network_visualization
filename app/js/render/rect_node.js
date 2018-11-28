import * as constants from "../utils/constants";

 class RectNode {
    constructor (x=0, y=0, width=0, height=0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }

    setXYWH(x = 0, y = 0, w = 100, h = 50){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    getBottomY(){
        return this.y + this.height
    }
}

export default class NamespaceNode extends RectNode {

    constructor(json = null){
        super();
        this.json = json;
        if(json!== null){
            this.interfaces = Object.values(json.interfaces)
                .map(x => new InterfaceNode(x));
        };
        }


    calculateGraphics(index = 0, prevY = 0){

        this.x = constants.NS_BOX.padding.left;
        if(index === 0){
            this.y = constants.NS_BOX.padding.top
        } else this.y = constants.NS_BOX.padding.between + prevY;
        this.width = constants.NS_BOX.width;
        this.height = this.interfaces.length * constants.NS_BOX.height_factor;

        return this;
     }

    setId(id){
        this.id = id;
    }

    getId(){
        return this.id;
    }

    getSize() {
        return this.size
    }


}


 class InterfaceNode extends RectNode {
    constructor(json){
        super();
        this.json = json;
    }
 }