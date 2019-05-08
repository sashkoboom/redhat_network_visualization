/**
 * Created by sashkoboom on 26. 3. 2018.
 */
/* eslint-disable */
/* eslint-disable no-param-reassign */

import * as d3 from 'd3';
import NamespaceNode from '../render/rect_node';
import * as constants from "../utils/constants"
import * as helpers from "../utils/helpers"
import { Find } from  './find'

const NetworkDataManager = class {
  constructor(input = {}) {

      this.levels = {};
      Object.keys(input.namespaces).forEach( ns => this.levels[ns] = { } );


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
      this.links = [];
      this.otherLinks = [];
      this.handleNamespacePositions();

    this.interfaces.forEach((interf) => {
      if (interf.json.children) {
        Object.values(interf.json.children).forEach((link) => {
          link.source = interf.json.id;
          link.svg = {};
          link.peer = false;
          console.log('LINKKK', link);
          interf.links.push(link);
          this.links.push(link);
        });
      }
    });
    this.links.forEach(link => {
        const t = typeof link.target === "string" ? this.getInterfaceByID(link.target) : link.target ;
        t.links.push(link);
    })
    ;

    console.log("LINKS", this.links);
    console.log("OTHER LINKS", this.otherLinks);

    const find = new Find(this);
  }




  getInterfaceByID(id){
      return this.interfaces.find(x => x.id === id);
  }

  getInterfaceByName(name){
      return this.interfaces.find(x => x.name === name);
  }

  countLevel(interf){
    if(!interf.json.parents) return 0;
    const parent = this.interfaces.find(x => x.id === Object.keys(interf.json.parents)[0]);
    return 1 + this.countLevel(parent);
  }

  handleInterfacePositions(interfaces, x){


      let lastRootMove = 0;
    interfaces.forEach((interf) => {


        // x position by parent if no parent than +100 after the last
        if(!interf.json.parents){
            let currRootMove = 0;
            // if it's a root, move it according to 1/2 prev root children + 1/2 yours children
            if(interf.json.children){
                currRootMove = Object.keys(interf.json.children).length * 70;
            }
            x += lastRootMove + 300 + currRootMove ;
            lastRootMove = currRootMove;
            interf.x = x + 50;
        }else{
            //
            interf.x = this.getInterfaceByID(Object.keys(interf.json.parents)[0]);
        }

        if(interf.json.peer){
            const link = interf.json.peer;
            link.source = interf;
            link.target = this.getInterfaceByID(link.target);
            link.svg = {};
            link.peer = true;
            interf.links.push(link);
            this.links.push(link);
        }


    });

    interfaces.forEach((interf) => {
          // x position by its parent
          if(interf.json.parents){
              interf.x = this.interfaces.find(n => n.id === Object.keys(interf.json.parents)[0]).x;
          }
      });

      return x + lastRootMove ;
    }


    handleNamespacePositions(){

        this.interfaces.forEach((interf) => {
            // y position by its hierarchy level
            interf.level =  this.countLevel(interf);
            this.levels[interf.ns][interf.level] ?
                this.levels[interf.ns][interf.level].push(interf) : this.levels[interf.ns][interf.level] = [interf];

            // step down is calculated by how many interfaces are on the same level => bigger step
            interf.y = this.levels[interf.ns][interf.level].length * 0.1 * interf.level * constants.LEVEL_FACTOR + 50;
        });


        console.log("LEVELS", this.levels);
      let x = 0;
      let lastX = 0;
      this.namespaces.forEach(ns => {

          ns.interfaces = helpers.flatten(Object.values(this.levels[ns.id]));

          x = this.handleInterfacePositions(ns.interfaces, x);

          // fix height based on the hierarchy height
          console.log("tak", ns.interfaces.sort((i1, i2) => i2.level - i1.level )[0]);

         // plocha w * h = n * iw * ih


          // multiply by count of interfaces in ns
          ns.height = 2 * constants.NS_BOX.padding.top +  ns.interfaces.sort((i1, i2) => i2.level - i1.level )[0].level * constants.LEVEL_FACTOR * 2  + constants.INTERFACE_BOX.height;
           // fix width based on count of nodes of the wides level
         console.log("last", lastX);
         console.log("x", x);
          ns.width =  x - lastX + 200;
          // ns.width = 2 * constants.NS_BOX.padding.left + Math.max.apply(null, (Object.values(this.levels[ns.id]).map(x => x.count))) * constants.NS_BOX.width_factor;
          // ns.width = ns.interfaces.length * constants.INTERFACE_BOX.width * constants.INTERFACE_BOX.height * 9 / ns.height;
                      // fix Y position based on Z position of the highest node
           ns.y = Math.min.apply(null, ns.interfaces.map(i => i.y)) - constants.NS_BOX.padding.top ;
           lastX = x + 100;

      });

        let prevX = 0;

        this.namespaces.forEach(ns => {
            ns.x = prevX + 100;
            prevX = ns.x + ns.width;
        })

        // change order of namespaces base on count of the connections coming from them


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

  getOtherLinksForSVG(){
   return this.otherLinks;
    }

};

export default NetworkDataManager;
