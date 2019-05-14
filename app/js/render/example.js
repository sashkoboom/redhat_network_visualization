/**
 * Created by sashkoboom on 17. 10. 2018.
 */
/* eslint-disable */

import NamespaceNode from './rect_node';
import SVGBuilder from './svg_builder';

export default function example() {
  const nodes = [
    {
      id: "a", x: 100, y: 350, level: 100, ns: '2',
    }, // 0
    { id: "b", x: 300, y: 150, level: 300 }, // 1
    {
        id: "c", x: 300, y: 350, level: 300, ns: '1',
    }, // 2
    {
        id: "d",x: 300, y: 550, level: 300, ns: '1',
    }, // 3
    { id: "e",x: 500, y: 150, level: 500 }, // 4
    {
        id: "f",x: 500, y: 350, level: 500, ns: '1',
    }, // 5
    {
        id: "g", x: 500, y: 550, level: 500, ns: '1',
    }, // 6
    {
        id: "h", x: 700, y: 350, level: 700, ns: '3',
    }, // 7
  ];
  const links = [
    { source: "a", target: "b" },
    { source: "a", target: "c" },
    { source: "a", target: "d" },
    { source: "b", target: "e" },
    { source: "c", target: "f" },
    { source: "c", target: "g" },
    { source: "e", target: "h" },
  ];

  const ns_r1 = new NamespaceNode();
  ns_r1.setXYWH(230, 280, 600, 330);
  ns_r1.setId('1');
  const ns_r2 = new NamespaceNode();
  ns_r2.setId('2');
  const ns_r3 = new NamespaceNode();
  ns_r3.setId('3');
  ns_r2.setXYWH(10, 260, 70, 70);
  ns_r3.setXYWH(980, 360, 170, 130);


  // console.log(ns_r1);
  const svg = new SVGBuilder();
  svg.draw([ns_r1, ns_r2, ns_r3], nodes, links);
}
