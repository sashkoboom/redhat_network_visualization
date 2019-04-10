/**
 * Created by sashkoboom on 12. 3. 2018.
 */
/* eslint-disable */

import * as d3 from 'd3';
import * as constants from '../utils/constants';
import * as helpers from "../utils/helpers";

const SVGBuilder = class {
  constructor(ns_data = [], inteface_data = [], links_data = [], colorManager = null) {

    this.namespaces = ns_data;
    this.interfaces = inteface_data;
    this.links = links_data;
    this.colorManager = colorManager;
    this.zoomQ = 1;

    const svg = d3.select('main')
      .append('svg')
      .attr('width', constants.WIDTH)
      .attr('height', constants.HEIGHT);


    // create zoomable/pannable pane to put all the visuals in it
    const zoom_actions = () => {
        this.zoomQ = d3.event.transform.k;

        this.pane.attr('transform', d3.event.transform)
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
  draw(ns_arr = this.namespaces, nodes = this.interfaces, links = this.links) {
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

    const pattern = this.pane.append("defs")
          .append("pattern")
          .attr({ id:"hash4_4", width:"8", height:"8", patternUnits:"userSpaceOnUse", patternTransform:"rotate(60)"})
          ;
    pattern.append("rect")
        .attr({ width:"4", height:"8", transform:"translate(0,0)", fill:"#88AAEE" });

    console.log("Making force simulation of nodes");
    console.log(nodes);
    const simulation = d3.forceSimulation()
      .nodes(nodes)
      .force('collide', d3.forceCollide(80))
      .force('forceY', d3.forceY(d => d.level));
      //.force('border_box', box_force);

    // Manage the namespace nodes
   ns_arr.forEach((ns) => {
      const x_r = ns.x;
      const y_r = ns.y;
      const w_r = ns.width;
      const h_r = ns.height;

      const id = ns.id ? ns.id : ns.json.id;
      const fill_r = this.colorManager === null ? 'lavender' : this.colorManager.getColor(id);

      // Create constraint force for each namespace
       simulation.force(`ns_box_${id}`, () => {
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
        .attr('fill', fill_r);
    });

      const link = this.pane.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(links)
          .enter()
          .append('line')
          .attr('stroke', 'black')
          .attr('stroke-width', 3);

      const end_marks = this.pane.append('g')
          .attr('class', 'end_marks')
          .selectAll('circle')
          .data(links)
          .enter()
          .append('circle')
          .attr("r", 13)
          .style("fill", "black");

    const node = this.pane.append('g')
      .attr('class', 'nodes')
      .selectAll('rect')
      .data(nodes)
      .enter()
      .append('rect')
        .attr('width', constants.INTERFACE_BOX.width)
        .attr('height', constants.INTERFACE_BOX.height)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('fill',
              // d => this.colorManager ? this.colorManager.getColorForNode(d) : "red")
          "url(#hash4_4)")
        .attr("stroke", "black");

    const text =  this.pane.append('g')
        .selectAll('text')
        .attr("class", "text")
      .data(nodes)
          .enter()
          .append('text')
          .attr('x', d => d.x + 50)
          .attr('y', d=> d.y + 50 )
          .attr('fill', 'black')
            .attr("background", "white")
          .attr('font-family', 'Ariel Black')
          .attr('font-size', 18)
          .text(d => d.name);

    console.log("mades some TEXT guess", text);


    const link_force = d3.forceLink(links)
      .id(d => d.id)
      .distance(() => 10)
      .strength(0);
    simulation.force('links', link_force);

    function tickActions() {


      // update circle positions each tick of the simulation
      node
        .attr('x', d => d.x)
        .attr('y', d => d.y)
      ;

      // update link positions
      // simply tells one end of the line to follow one node around
      // and the other end of the line to follow the other node around
      link
        .attr('x1', d => d.source.x + constants.INTERFACE_BOX.width / 2)
        .attr('y1', d => d.source.y + constants.INTERFACE_BOX.height / 2)
        .attr('x2', d => d.target.x + constants.INTERFACE_BOX.width / 2)
        .attr('y2', d => d.target.y + constants.INTERFACE_BOX.height / 2);


      //calculate intersection for each node

      end_marks
            .attr("cx", d => helpers.getIntersection(d, 'x') )
            .attr("cy", d => helpers.getIntersection(d, 'y'));

        text
            .attr('x', d => d.x + 50)
            .attr('y', d => d.y + 50);
    }

    simulation.on('tick', tickActions.bind(this));

    /*
        *
        * The alphaTarget controls how quickly the simulation returns to equilibrium.
         * Lower values means that the simulation returns slower and higher values means
         * that it returns quicker. Setting it below the minimum alpha of 0.01 means
         * that the graph gets “stuck” and the nodes don’t update further. Not ideal.
        * */

    const dragstart = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;

    };

    const dragdrag = function (d) {
      if (d.ns) {
        for (const ns of ns_arr) {
          if (ns.id === d.ns) {
            const x_r = ns.x; const y_r = ns.y; const w_r = ns.width; const
              h_r = ns.height;
            d.fx = Math.max( x_r, Math.min(x_r + w_r - constants.INTERFACE_BOX.width, d3.event.x));
            d.fy = Math.max(y_r, Math.min(y_r + h_r - constants.INTERFACE_BOX.height, d3.event.y));
            break;
          }
        }
      } else {
        d.fx = Math.max(50, Math.min(constants.WIDTH - 50, d3.event.x));
        d.fy = Math.max(50, Math.min(constants.HEIGHT - 50, d3.event.y));
      }


        // d.fx = d3.event.x;
        // d.fy = d3.event.y;


    };

    const dragend = function (d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    const drag_handler = d3.drag()
      .on('start', dragstart)
      .on('drag', dragdrag)
      .on('end', dragend);

    drag_handler(node);
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
      .attr('font-size', 18)
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
