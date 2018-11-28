/**
 * Created by sashkoboom on 12. 3. 2018.
 */
import * as d3 from "d3";
import * as constants from "../utils/constants";

const SVGBuilder = class{

    constructor(ns_data = [], inteface_data = [], links_data = [], colorManager = null){

        this.namespaces = ns_data;
        this.interfaces = inteface_data;
        this.links = links_data;
        this.colorManager = colorManager;

        const svg =  d3.select("main")
            .append("svg")
            .attr("width", constants.WIDTH)
            .attr("height", constants.HEIGHT);


        //create zoomable/pannable pane to put all the visuals in it
        const zoom_actions = () => this.pane.attr("transform", d3.event.transform);

        this.pane = svg.append("g")
            .attr("class", "everything");
        this.zoom_handler = d3.zoom()
            .on("zoom", zoom_actions.bind(this));
        this.zoom_handler(svg);

    }

    start(NSdata = []){

        this.namespaces.data = NSdata;
       // this.draw();

    };


    /*
    * What must be pre-defined:
    *
    * coords of each node
    * coords of the interface box fitting to coords of nodes
    * each node must contain id of its namespace
    *
    * */
    draw(ns_arr, nodes, links) {

        //custom force to stop nodes from leaving the visible part of the plane
        function box_force() {
            for (let n of nodes){
                n.x = Math.max(50, Math.min(constants.WIDTH - 50, n.x));
                n.y = Math.max(50, Math.min(constants.HEIGHT - 50, n.y));
            }
        }

        function ns_box() {

            for (let n of nodes){
                if(n.ns){
                    n.x = Math.max(50 + x_r, Math.min(x_r + w_r - 50, n.x));
                    n.y = Math.max(50 + y_r, Math.min(y_r+ 330 - 50, n.y));
                }

            }

        }

        let simulation = d3.forceSimulation()
            .nodes(nodes)
         .force("collide", d3.forceCollide(50))
         .force("forceX", d3.forceX(function (d) {
             return d.level
         }))
         .force("border_box", box_force);

        //Manage the namespace nodes
        for(const ns of ns_arr){
            const x_r = ns.x, y_r = ns.y, w_r = ns.width, h_r = ns.height;
            const fill_r = this.colorManager === null ? "lavender" : this.colorManager.getColor(ns.id);
            const ns_name = ns.id;
            //Create constraint force for each namespace
            simulation.force("ns_box_" + ns_name, function () {
                for (let n of nodes){
                    if(n.ns == ns_name){
                        n.x = Math.max(50 + x_r, Math.min(x_r + w_r - 50, n.x));
                        n.y = Math.max(50 + y_r, Math.min(y_r+ h_r - 50, n.y));
                    }
                }
            });
            //Draw namespace rectangles
            const ns_rect = this.pane
                .append('rect')
                .attr('x', x_r)
                .attr('y', y_r)
                .attr('width', w_r)
                .attr('height', h_r)
                .attr('fill', fill_r)
        }


        const node = this.pane.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 50)
            .attr("cx", function (d) {
                return d.x
            })
            .attr("cy", function (d) {
                return d.y
            })
            .attr("fill", "red");


        let link_force =  d3.forceLink(links)
            .id(function(d) { return nodes.indexOf(d);})
            .distance(function (d) {
                return 10
            })
            .strength(0)


        simulation.force("links",link_force)

        const link = this.pane.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        function tickActions() {
            //update circle positions each tick of the simulation
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            //update link positions
            //simply tells one end of the line to follow one node around
            //and the other end of the line to follow the other node around
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

        }

        simulation.on("tick", tickActions );

        /*
        *
        * The alphaTarget controls how quickly the simulation returns to equilibrium.
         * Lower values means that the simulation returns slower and higher values means
         * that it returns quicker. Setting it below the minimum alpha of 0.01 means
         * that the graph gets “stuck” and the nodes don’t update further. Not ideal.
        * */

        const dragstart = function (d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragdrag = function(d){
            if(d.ns){
                for (const ns of ns_arr){
                    if(ns.id == d.ns){
                        const x_r = ns.x, y_r = ns.y, w_r = ns.width, h_r = ns.height;
                        d.fx = Math.max(50 + x_r, Math.min(x_r + w_r - 50, d3.event.x));
                        d.fy = Math.max(50 + y_r, Math.min(y_r + h_r - 50, d3.event.y));
                       break;
                    }
                }
            }else{
                d.fx = Math.max(50, Math.min(constants.WIDTH - 50, d3.event.x));
                d.fy = Math.max(50, Math.min(constants.HEIGHT - 50, d3.event.y));
            }
        };

        const dragend = function(d){
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        };

        const drag_handler = d3.drag()
            .on("start", dragstart)
            .on("drag", dragdrag)
            .on("end", dragend);

        drag_handler(node)

    }


    drawNameSpaces() {
        this.namespaces.rect =
            this.pane.selectAll("rect." + constants.NS_CLASS_PADDING)
            .data(this.namespaces.data)
            .enter()
            .append("render:rect")
            .attr("class", constants.NS_CLASS_PADDING)
            .attr("x", function(d){
                return d.x;
            })
            .attr("y", function(d) {
                return d.y
            } )
            .attr("width", NS_WIDTH)
            .attr("height", function (d) {
                return d.size* constants.NS_HEIGHT_FACTOR;
            })
                .attr("fill", function (d) {
                    return d.color
                });

        this.namespaces.text = this.pane
            .selectAll("text .text_" + constants.NS_CLASS_PADDING)
            .data(this.namespaces.data)
            .enter()
            .append("render:text")
            .attr("class", "text")
            .attr("x", function(d){
                return d.x + constants.NS_TEXT_PADDING_LEFT;
            })
            .attr("y",function(d){
               return d.y + constants.NS_TEXT_PADDING_TOP
            } )
            .attr("width", 90)
            .attr("height", this.INTERFACE_HEIGHT)
            .attr("fill", "black")
            .attr("font-family", "Ariel Black")
            .attr("font-size", 18)
            .text(function (d) {
                return d.id;
            });
    }



    drawRect
        (graph, nodes, width, height, fill, classPadding = '', shiftX = 0)
    {

        const classname = nodes[0].classname + classPadding;

        return graph.selectAll("rect ." + classname)
            .data(nodes)
            .enter()
            .append("render:rect")
            .attr("class", classname)
            .attr("x", function(d){
                return d.x + shiftX;
            })
            .attr("y",function(d){
                return d.y;
            } )
            .attr("width", width)
            .attr("height", height)
            .attr("stroke", "black")
            .attr("fill", fill );

    }

}

export default SVGBuilder;