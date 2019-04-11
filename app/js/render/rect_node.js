import * as constants from '../utils/constants';

/* eslint-disable */

class Node {
  constructor(x = 60, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.svg = [];

  }

  setXYWH(x = 0, y = 0, w = 100, h = 50) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  getLeftX() {
    return this.x + this.width;
  }
}


class InterfaceNode extends Node {
    constructor(json) {
        super();
        this.json = json;
        this.ns = json.namespace;
        this.name = json.name;
        this.id = json.id;
        this.level = 100;
        this.links = [];
    }
}

export default class NamespaceNode extends Node {
  constructor(json = null) {
    super();
    this.json = json;
    if (json !== null) {
      this.id = json.id;
      this.name = json.name;
        this.interfaces = Object.values(json.interfaces)
        .map(x => new InterfaceNode(x));
    }
  }


  calculateGraphics(index = 0, prevX = 0) {
    this.y = constants.NS_BOX.padding.left;
    if (index === 0) {
      this.x = constants.NS_BOX.padding.top;
    } else this.x = constants.NS_BOX.padding.between + prevX;
    this.height = constants.NS_BOX.height;
    this.width = this.interfaces.length * constants.NS_BOX.width_factor;

    return this;
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  getSize() {
    return this.size;
  }
}


