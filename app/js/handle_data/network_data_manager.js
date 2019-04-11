/**
 * Created by sashkoboom on 26. 3. 2018.
 */
/* eslint-disable */
/* eslint-disable no-param-reassign */

import * as d3 from 'd3';
import NamespaceNode from '../render/rect_node';
import * as constants from "../utils/constants"

const NetworkDataManager = class {
  constructor(input = {}) {
    // Handle namespaces, make each one an object and calculate its render's XYWH etc.
    this.namespaces = Object.values(input.namespaces)
    // make each val into an obj
      .map(val => new NamespaceNode(val))
    // calculate its xywh basing of each previous node
      .reduce((accumulator, curr, index) => {
        const X = accumulator.length === 0 ? 0 : accumulator[accumulator.length - 1].getLeftX();
        accumulator.push(curr.calculateGraphics(index, X));
        return accumulator;
      }, []);
    console.log("NAMESPACES", this.namespaces)
    /*
        * Handle interfaces, harvest them as ready made objs from NSs
        * and manage their XYWHs
        * */
    this.interfaces = this.namespaces
      .reduce((accumulator, curr /* , index */) => [...accumulator, ...curr.interfaces], []);
    console.log("RAW INTERFACES", this.interfaces);

      this.handleInterfacePositions();
      this.handleNamespacePositions();
    this.links = [];
    this.interfaces.forEach((interf) => {
      if (interf.json.children) {
        Object.values(interf.json.children).forEach((link) => {
          link.source = interf.json.id;
          link.svg = {};
          interf.links.push(link);
          this.links.push(link);
        });
      }
    });
    this.links.forEach(link => {
        const t = this.getInterfaceByID(link.target);
        t.links.push(link);
        console.log(t);
    })
    ;
  }

  getInterfaceByID(id){
      return this.interfaces.find(x => x.id === id);
  }

  countLevel(interf){
    if(!interf.json.parents) return 0;
    const parent = this.interfaces.find(x => x.id === Object.keys(interf.json.parents)[0]);
    return 300 + this.countLevel(parent);
  }

  handleInterfacePositions(){
    let x = 100;
    this.interfaces.forEach((interf) => {
        // x position by its hierarchy level
          if(interf.json.parents){
            interf.y = this.countLevel(interf);
          }
        interf.level = interf.y;

      });

    this.interfaces.forEach((interf) => {
        // x position by if no parent than +100 beneath the last
        if(!interf.json.parents){
            if(interf.json.children){ x += 150 * Object.keys(interf.json.children).length} else { x += 150 ;}
            interf.x = x;
        }

    });

    this.interfaces.forEach((interf) => {
          // x position by its parent
          if(interf.json.parents){
              interf.x = this.interfaces.find(n => n.id === Object.keys(interf.json.parents)[0]).x;
          }
      })
    }

    handleNamespacePositions(){
      this.namespaces.forEach(ns => {
          // fix height based on the hierarchy height
          ns.height = ns.interfaces.sort((i1, i2) => i2.y - i1.y )[0].y + constants.INTERFACE_BOX.height
          // fix Y position based on Z position of the highest node
      })
    }

  handleInterfaces() {
    let rootsCount = 0; // later use
    const childlessParentless = []; // later use


     // make small copies of the interfaces containing only:
     // their id,  list of their childrens id's, list of parents id's
     // and initial identifier that we haven't worked with them yet
    const smallInterfaces = this.interfaces.reduce(
      (accumulator, x) => {
        let children ;
        (x.json.children) ? children = Object.keys(x.json.children) : children = null;
        let parents ;
        (x.json.parents) ? parents = Object.keys(x.json.parents) : parents = null;
        if (parents === null) rootsCount++;
        // filter out the single nodes with no connections to an other array
        (children === null && parents === null)
          ? childlessParentless.push(x)
          : accumulator.push({
            id: x.json.id, children, parents, marked: false,
          });
        return accumulator;
      },
      [],
    );

    console.log("SMALL INTERFACES", smallInterfaces);
    console.log("CHILDLESS PARENTLESS", childlessParentless);

    const hierarchies = childlessParentless
      .map(x => d3.hierarchy(x));

    console.log("HIERARCHIES", hierarchies);
    // array of d3.hierarchies that lack parents they need to be linked to
    const childless = [];
    do {
      for (const interf in smallInterfaces) {
        if (!interf.marked && !childless.includes(interf)) {
          // if no children then it's childless
          if (interf.children === null) { childless.push(interf); }
          else if (childless.length > 0) {
            for (let i_ch = 0; i_ch < interf.children.length; i_ch++) {
              let child;
              let orp_i = -1;
              // look if the child is in the childless array
              for (let i_o = 0; i_o < childless.length; i_o++) {
                if (childless[i_o].id == interf.children[i_ch]) { child = o; orp_i = i_o; break; }
              }
              if (child) {
                interf.children[i_ch] = child;
                child.marked = true;
                childless.splice(orp_i, 1);
              }
            }
          }
        }
      }
    }
    // while   ( i !== 10 )
    while (hierarchies.length !== rootsCount);
  }

  getNSForSVG() {
    return this.namespaces;
  }

  getInterfacesForSVG() {
      return this.interfaces;
  }

  getLinksForSVG() {
    return this.links;
  }

};

export default NetworkDataManager;
