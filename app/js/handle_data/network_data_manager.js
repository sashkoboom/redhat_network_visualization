/**
 * Created by sashkoboom on 26. 3. 2018.
 */
/* eslint-disable */
/* eslint-disable no-param-reassign */

import * as d3 from 'd3';
import NamespaceNode from '../render/rect_node';

const NetworkDataManager = class {
  constructor(input = {}) {
    // Handle namespaces, make each one an object and calculate its render's XYWH etc.
    this.namespaces = Object.values(input.namespaces)
    // make each val into an obj
      .map(val => new NamespaceNode(val))
    // calculate its xywh basing of each previous node
      .reduce((accumulator, curr, index) => {
        const Y = accumulator.length === 0 ? 0 : accumulator[accumulator.length - 1].getBottomY();
        accumulator.push(curr.calculateGraphics(index, Y));
        return accumulator;
      }, []);

    console.log("NAMESPACES", this.namespaces);

    /*
        * Handle interfaces, harvest them as ready made objs from NSs
        * and manage their XYWHs
        * */
    this.interfaces = this.namespaces
      .reduce((accumulator, curr /* , index */) => [...accumulator, ...curr.interfaces], []);
    console.log("RAW INTERFACES", this.interfaces);
   // this.handleInterfaces(input);
    /*
         * Put logical links into objects with structure:
         * { source  :   id, target: id, .....attr}
         * */
    this.links = [];
    this.interfaces.forEach((interf) => {
      if (interf.json.children) {
        Object.values(interf.json.children).forEach((child) => {
          child.source = interf.json.id;
          this.links.push(child);
        });
      }
    });
    console.log("links", this.links);
    this.handleInterfacePositions();
    console.log("interfaces with levels AND POSITIONS", this.interfaces);
  }

  handleInterfacePositions(){
    let y = 100;
    console.log("chto blya", this.interfaces);
    this.interfaces.forEach((interf) => {
        // x position by its hierarchy level
          if(interf.json.parents){
            // really rough way
            interf.x += 200;
          }

        interf.level = interf.x;

        // y position by its parent OR if no parent than +100 beneath the last

          if(interf.json.parents){
            interf.y = this.interfaces.find(x => x.id === Object.keys(interf.json.parents)[0]).y;
          }else{
            if(interf.json.children){ y += 150* Object.keys(interf.json.children).length} else { y += 150 ;}
            interf.y = y;
          }
        console.log("???", interf);



      });
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

    /*  let ns_r1 = new NamespaceNode();
        ns_r1.setXYWH(230, 280, 600, 330);
        ns_r1.setId('1');
        let ns_r2 = new NamespaceNode();
        ns_r2.setId('2');
        let ns_r3 = new NamespaceNode();
        ns_r3.setId('3');

        ns_r2.setXYWH(10, 260, 70, 70);
        ns_r3.setXYWH(800, 260, 70, 70);

        return [ns_r1, ns_r2, ns_r3] */
  }

  getInterfacesForSVG() {
    return this.interfaces;
    /* [{x: 100, y: 350, level : 100, ns : '2'}, //0
            {x: 300, y: 150, level : 300},//1
            {x: 300, y: 350, level : 300, ns : '1'},//2
            {x: 300, y: 550, level : 300, ns : '1'},//3
            {x: 500, y: 150, level : 500},//4
            {x: 500, y: 350, level : 500, ns : '1'},//5
            {x: 500, y: 550, level : 500, ns : '1'},//6
            {x: 700, y: 350, level : 700, ns: '3'}//7
        ] */
  }

  getLinksForSVG() {
    return this.links;
    /* return [
            {source : 0, target: 1},
            {source : 0, target: 2},
            {source : 0, target: 3},
            {source : 1, target: 4},
            {source : 2, target: 5},
            {source : 2, target: 6},
            {source : 5, target: 7}
        ]; */
  }
};

export default NetworkDataManager;
