/**
 * Created by sashkoboom on 12. 3. 2018.
 */
/* eslint-disable */

import * as d3 from 'd3';
import * as constants from '../utils/constants';
import * as graphics from "./graphics";
import * as mouseInteractions from "../interactions/mouse";
import * as scaling from "../interactions/scaling"
import {INTERFACE_BOX} from "../utils/constants";

const SVGBuilder = class {

  constructor(ns_data = [], inteface_data = [], links_data = [], other_links_data = [], colorManager = null) {

    this.namespaces = ns_data;
    this.interfaces = inteface_data;
    this.links = links_data;
    this.otherLinks = links_data;
    this.colorManager = colorManager;
    this.scale = new scaling.UpScale(this.interfaces);

    this.text_1 = null ;
    this.text_2 = null ;
    this.text_3 = null ;

    const svg = d3.select('main')
      .append('svg')
      .attr('width', constants.WIDTH)
      .attr('height', constants.HEIGHT);


    // create zoomable/pannable pane to put all the visuals in it
    const zoom_actions = () => {

        const prevScale = this.scale;



        if(d3.event.transform.k <=  constants.SCALING.downLimit){
           this.scale = new scaling.DownScale(this.interfaces);
        }else if(d3.event.transform.k >= constants.SCALING.downLimit && d3.event.transform.k <= constants.SCALING.upLimit){
           this.scale = new scaling.StandardScale(this.interfaces);
       }else if(d3.event.transform.k >= constants.SCALING.upLimit){
           this.scale = new scaling.UpScale(this.interfaces);
       }

        if(this.scale.scale !== prevScale.scale){
            this.scale.handleScale();
            console.log(this.simulation);
            this.simulation
                .force("collide", d3.forceCollide(this.scale.collision))
                .alphaTarget(1)
                .restart();
        }

        // this.simulation.start();

        this.pane.attr('transform', d3.event.transform);
    };

    this.pane = svg.append('g')
      .attr('class', 'everything');
    this.zoom_handler = d3.zoom()
      .on('zoom', zoom_actions.bind(this));
    this.zoom_handler(svg);
  }

  start(NSdata = []) {
    this.namespaces.data = NSdata;
   // this.draw();
  }


  /*
    * What must be pre-defined:
    *
    * coords of each node
    * coords of the interface box fitting to coords of nodes
    * each node must contain id of its namespace
    *
    * */
  draw(ns_arr = this.namespaces, nodes = this.interfaces, links = this.links, otherLinks = this.otherLinks) {
    // custom force to stop nodes from leaving the visible part of the plane
    function box_force() {
      for (const n of nodes) {
        n.x = Math.max(50, Math.min(constants.WIDTH - 50, n.x));
        n.y = Math.max(50, Math.min(constants.HEIGHT - 50, n.y));
      }
    }

    function ns_box() {
      for (const n of nodes) {
        if (n.ns) {
          n.x = Math.max(50 + x_r, Math.min(x_r + w_r - 50, n.x));
          n.y = Math.max(50 + y_r, Math.min(y_r + 330 - 50, n.y));
        }
      }
    }

      // Pattern definition
      this.pane.append('defs')
          .append('pattern')
          .attr('id', 'yellow-pattern')
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('width', 50)
          .attr('height', 50)
          .append('image')
          .attr('xlink:href', constants.YELLOW_PATTERN)
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 50)
          .attr('height', 50);

    this.pane.append('defs')
          .append('pattern')
          .attr('id', 'red-pattern')
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('width', 50)
          .attr('height', 50)
          .append('image')
          .attr('xlink:href', constants.RED_PATTERN)
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 50)
          .attr('height', 50);

    console.log("Making force simulation of nodes");
    console.log(nodes);
    this.simulation = d3.forceSimulation()
      .nodes(nodes)
       .force('collide', d3.forceCollide(constants.INTERFACE_BOX.collide))
        .force('forceY', d3.forceY(d =>  d.level * constants.LEVEL_FACTOR + 50).strength(0.01));


    // Manage the namespace nodes
   ns_arr.forEach((ns) => {
      const x_r = ns.x;
      const y_r = ns.y;
      const w_r = ns.width;
      const h_r = ns.height;

      const id = ns.id ? ns.id : ns.json.id;
      const fill_r = constants.NS_BACKGROUND_COLOR;

      // Create constraint force for each namespace
       this.simulation.force(`ns_box_${id}`, () => {
        nodes.forEach((n) => {
          if (n.ns == id) {
            n.x = Math.max( x_r, Math.min(x_r + w_r, n.x));
            n.y = Math.max( y_r, Math.min(y_r + h_r, n.y));
          }
        });
      });

      // Draw namespace rectangles
      const ns_rect = this.pane
        .append('rect')
        .attr('x', x_r)
        .attr('y', y_r)
          .attr('width', w_r)
          .attr('height', h_r)
            .attr('fill', constants.GREEN)
          .on("mouseover", () => mouseInteractions.mouseOverNamespace(ns))
          .on("mouseout", () => mouseInteractions.mouseOutNamespace(ns))

    });





      const link = this.pane.append('g')
          .selectAll('line')
          .data(links)
          .enter()
          .append('line')
          .attr('class', 'links')
          .attr('stroke', 'black')
          .attr('stroke-dasharray', '0')
          .attr('stroke-width', constants.STROKE_WIDTH)
          .on("mouseover", mouseInteractions.mouseOverLinks)
          .on("mouseout", mouseInteractions.mouseOutLinks)
          .each(function(d){
              d.svg["link"] = this ;
          });

      const end_marks = this.pane.append('g')
          .selectAll('circle')
          .data(links)
          .enter()
          .append('circle')
          .attr('class', 'end_marks')
          .attr("r", constants.END_MARK_RADIUS)
          .attr("fill", "black")
          .on("mouseover", mouseInteractions.mouseOverLinks)
          .on("mouseout", mouseInteractions.mouseOutLinks)
          .each(function(d){
              d.svg["end_mark"] =  this ;
          });

      const start_marks = this.pane.append('g')
          .selectAll('circle')
          .data(links)
          .enter()
          .append('circle')
          .attr('class', 'start_marks')
          .attr("r", 13)
          .attr("fill", "black")
          .on("mouseover", mouseInteractions.mouseOverLinks)
          .on("mouseout", mouseInteractions.mouseOutLinks)
          .each(function(d){
              d.svg["start_mark"] =  this ;
          });

    const node = this.pane.append('g')
      .selectAll('rect')
      .data(nodes)
      .enter()
      .append('rect')
        .attr("transition", 500)
        .attr('class', 'main_rect')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('rx', 20)
        .attr('ry', 20)
        .on("mouseover", mouseInteractions.mouseOverInterface)
        .on("mouseout", mouseInteractions.mouseOutInterface)
        .on("click", d => {
            mouseInteractions.clickOnInterface(d);
            console.log("CLICKED ON", d)
        })
        .attr('fill',
                 d => {
                    switch(d.json.state){
                        case "up": {
                            return constants.GREY
                        }
                        case "none" : {
                            // return constants.YELLOW
                            return 'url(#yellow-pattern)'
                        }
                        case "down" : {
                            // return constants.RED
                            return 'url(#red-pattern)'
                        }
                        default:
                            return "white"
                    }
                })
        .attr("stroke", constants.STROKE_COLOR)
        .attr("stroke-linecap", "round")
        .attr("stroke-width", d => d.json.type === "internal" ? 30 : 1)
        .attr("stroke-dasharray", d => d.json.type === "internal" ? "1, 20" : 0
        )
        .each(function(d){
            d.svg["rect"] = this ;
        });

    const inner_rects = this.pane.append('g')
        .selectAll('rect')
        .data(nodes)
        .enter()
        .append('rect')
        .attr('class', 'inner_rect')
        .attr('x', d => d.x + constants.INTERFACE_INNER_PADDING_X)
        .attr('y', d => d.y + constants.INTERFACE_INNER_PADDING_Y)
        .attr('rx', 10)
        .attr('ry', 10)
        .on("mouseover", mouseInteractions.mouseOverInterface)
        .on("mouseout", mouseInteractions.mouseOutInterface)
        .on("click", mouseInteractions.clickOnInterface)
        .attr('fill', d => d.json.type === "internal" ? "white" : constants.GREY)
        .each(function(d){
            d.svg["inner_rect"] = this ;
        });

    const text_1 =  this.pane
        .append('g')

        .selectAll('text')
      .data(nodes)
          .enter()
          .append('text')
          .attr("class", 'text_1')
          .attr('x', d => d.x + 30)
          .attr('y', d => d.y + 50 )
        .on("click", mouseInteractions.clickOnInterface)
          .attr('font-size', constants.INTERFACE_BOX.fontsize[this.scale.scale])
          .text(d =>  d.name)
            .each(function(d){
                d.svg["text_1"] = this ;
                d.texts["text_1"] = d.name;
            });

    const text_2 =  this.pane.append('g')
        .selectAll('text')
      .data(nodes)
          .enter()
          .append('text')
        .attr("class", 'text_2')
        .on("click", mouseInteractions.clickOnInterface)
          .attr('x', d => d.x + 30)
          .attr('y', d=> d.y + 70 )
          .attr('font-size', constants.INTERFACE_BOX.fontsize[this.scale.scale])
          .text(d => d.json.mtu ? `MTU ${d.json.mtu}` : "")
            .each(function(d){
                d.svg["text_2"] = this ;
                d.texts['text_2'] = d.json.mtu ? `MTU ${d.json.mtu}` : "";

            });

    const text_3 =  this.pane.append('g')
        .selectAll('text')
      .data(nodes)
          .enter()
          .append('text')
        .attr("class", 'text_3')
          .attr('x', d => d.x + 30)
          .attr('y', d=> d.y + 90 )
          .attr('font-size', constants.INTERFACE_BOX.fontsize[this.scale.scale])
          .text(d =>  d.json.mac ? `${d.json.mac}` : "")
            .each(function(d){
                d.svg["text_3"] = this ;
                d.texts['text_3'] = d.json.mac ;
            });

    node.attr('width', d => graphics.rectW(d, this.scale))
        .attr('height', d => graphics.rectH(d, this.scale));

    inner_rects.attr('width', d => graphics.innerRectW(d, this.scale))
        .attr('height', d => graphics.innerRectH(d, this.scale));

    const link_force = d3.forceLink(links)
      .id(d => d.id)
      .distance(() => 10)
      .strength(0);
    this.simulation.force('links', link_force);

    function tickActions() {

      // update circle positions each tick of the simulation
      node
          .each(d => {
              const r = graphics.boxingConstrains (d, ns_arr, d, d.width, d.height);
              d.delta = r;
          })
        // .attr('x', d => d.x)
        .attr('x', d => d.delta.x)
        // .attr('y', d => d.y)
        .attr('y', d => d.delta.y)
      ;

      // update link positions
      // simply tells one end of the line to follow one node around
      // and the other end of the line to follow the other node around
      link
          .each(l => {
              l.deltaEnd = graphics.getIntersection(l, 'end', l.target.width, l.target.height);
              l.deltaStart = graphics.getIntersection(l,  'start', l.source.width, l.source.height);
          })
          .attr('x1', d => d.source.delta.x + d.source.width / 2)
        .attr('y1', d => d.source.delta.y + d.source.height / 2)
        .attr('x2', d => d.target.delta.x + d.target.width / 2)
        .attr('y2', d => d.target.delta.y + d.target.height / 2);




      const pt = constants.INTERFACE_BOX.paddingOut + constants.INTERFACE_BOX.paddingIn;
      //calculate intersection for each node

      end_marks
            .attr("cx", d => d.deltaEnd.x )
            .attr("cy", d => d.deltaEnd.y);

      start_marks
            .attr("cx", d => d.deltaStart.x )
            .attr("cy", d => d.deltaStart.y);

      const fontpt = constants.INTERFACE_BOX.fontsize[this.scale.scale] ;

        text_1
            .attr('x', d => d.delta.x + pt)
            .attr('y', d => d.delta.y + pt + fontpt);



        text_2
            .attr('x', d => d.delta.x + pt)
            .attr('y', d => d.delta.y + pt + fontpt * 2);

        text_3
            .attr('x', d => d.delta.x + pt)
            .attr('y', d => d.delta.y + pt + fontpt * 3);



        inner_rects
            .attr('x', d => d.delta.x + constants.INTERFACE_BOX.paddingOut)
            .attr('y', d => d.delta.y + constants.INTERFACE_BOX.paddingOut)
    }

    this.simulation.on('tick', tickActions.bind(this));

    /*
        *
        * The alphaTarget controls how quickly the simulation returns to equilibrium.
         * Lower values means that the simulation returns slower and higher values means
         * that it returns quicker. Setting it below the minimum alpha of 0.01 means
         * that the graph gets “stuck” and the nodes don’t update further. Not ideal.
        * */

    const dragstart = (d) => {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;

    };

    const dragdrag = (d) => {
        const r = graphics.boxingConstrains(d, ns_arr, d3.event, d.width, d.height);
        d.fx = r.x;
        d.fy = r.y;
    };
        // d.fx = d3.event.x;
        // d.fy = d3.event.y;


    const dragend = function (d) {
      if (!d3.event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    const drag_handler = d3.drag()
      .on('start', dragstart.bind(this))
      .on('drag', dragdrag.bind(this))
      .on('end', dragend.bind(this));

    drag_handler(node);
    drag_handler(inner_rects);
  }



  drawNameSpaces() {
    this.namespaces.rect = this.pane.selectAll(`rect.${constants.NS_CLASS_PADDING}`)
      .data(this.namespaces.data)
      .enter()
      .append('render:rect')
      .attr('class', constants.NS_CLASS_PADDING)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', NS_WIDTH)
      .attr('height', d => d.size * constants.NS_HEIGHT_FACTOR)
      .attr('fill', d => d.color);

    this.namespaces.text = this.pane
      .selectAll(`text .text_${constants.NS_CLASS_PADDING}`)
      .data(this.namespaces.data)
      .enter()
      .append('render:text')
      .attr('class', 'text')
      .attr('x', d => d.x + constants.NS_TEXT_PADDING_LEFT)
      .attr('y', d => d.y + constants.NS_TEXT_PADDING_TOP)
      .attr('width', 90)
      .attr('height', this.INTERFACE_HEIGHT)
      .attr('fill', 'black')
      .attr('font-family', 'Ariel Black')
      .attr('font-size', INTERFACE_BOX.fontsize.up)
      .text(d => d.id);
  }


  drawRect(graph, nodes, width, height, fill, classPadding = '', shiftX = 0) {
    const classname = nodes[0].classname + classPadding;

    return graph.selectAll(`rect .${classname}`)
      .data(nodes)
      .enter()
      .append('render:rect')
      .attr('class', classname)
      .attr('x', d => d.x + shiftX)
      .attr('y', d => d.y)
      .attr('width', width)
      .attr('height', height)
      .attr('stroke', 'black')
      .attr('fill', fill);
  }
};

export default SVGBuilder;
