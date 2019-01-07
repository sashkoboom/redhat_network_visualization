/**
 * Created by sashkoboom on 12. 3. 2018.
 */
/* eslint-disable */

import * as d3 from 'd3';
import * as constants from '../utils/constants';

const SVGBuilder = class {
  constructor(ns_data = [], inteface_data = [], links_data = [], colorManager = null) {

    console.log("tak");
    console.log(ns_data);
    console.log(inteface_data);
    console.log(links_data);
    console.log(colorManager);

    this.namespaces = ns_data;
    this.interfaces = inteface_data;
    this.links = links_data;
    this.colorManager = colorManager;

    const svg = d3.select('main')
      .append('svg')
      .attr('width', constants.WIDTH)
      .attr('height', constants.HEIGHT);


    // create zoomable/pannable pane to put all the visuals in it
    const zoom_actions = () => this.pane.attr('transform', d3.event.transform);

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

    console.log("Making force simulation of nodes");
    console.log(nodes);
    const simulation = d3.forceSimulation()
      .nodes(nodes)
      .force('collide', d3.forceCollide(50))
      .force('forceX', d3.forceX(d => d.level));
      //.force('border_box', box_force);

    // Manage the namespace nodes
   ns_arr.forEach((ns) => {
      const x_r = ns.x; const y_r = ns.y; const w_r = ns.width; const
        h_r = ns.height;
      console.log(ns);
      const id = ns.id ? ns.id : ns.json.id;
      const fill_r = this.colorManager === null ? 'lavender' : this.colorManager.getColor(id);

      // Create constraint force for each namespace

       alert();
       simulation.force(`ns_box_${id}`, () => {
        nodes.forEach((n) => {
          if (n.ns == id) {

            n.x = Math.max(50 + x_r, Math.min(x_r + w_r - 50, n.x));
            n.y = Math.max(50 + y_r, Math.min(y_r + h_r - 50, n.y));
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


    const node = this.pane.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 50)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', d => this.colorManager ? this.colorManager.getColorForNode(d) : "red")
        .attr("stroke", "black");

    console.log("mades some circles i guess", node);

    console.log("links the fuck", links);

    const link_force = d3.forceLink(links)
      .id(d => d.id)
      .distance(d => 10)
      .strength(0);

    simulation.force('links', link_force);

    const link = this.pane.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    console.log("made some LINKS i guess", link);

    function tickActions() {
      // update circle positions each tick of the simulation
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      // update link positions
      // simply tells one end of the line to follow one node around
      // and the other end of the line to follow the other node around
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    }

    simulation.on('tick', tickActions);

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
          if (ns.id == d.ns) {
            const x_r = ns.x; const y_r = ns.y; const w_r = ns.width; const
              h_r = ns.height;
            d.fx = Math.max(50 + x_r, Math.min(x_r + w_r - 50, d3.event.x));
            d.fy = Math.max(50 + y_r, Math.min(y_r + h_r - 50, d3.event.y));
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
