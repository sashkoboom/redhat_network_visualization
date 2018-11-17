/**
 * Created by sashkoboom on 17. 10. 2018.
 */

export default example = () =>  {
    const nodes = [
        {x: 100, y: 350, level : 100, ns : '2'}, //0
        {x: 300, y: 150, level : 300},//1
        {x: 300, y: 350, level : 300, ns : '1'},//2
        {x: 300, y: 550, level : 300, ns : '1'},//3
        {x: 500, y: 150, level : 500},//4
        {x: 500, y: 350, level : 500, ns : '1'},//5
        {x: 500, y: 550, level : 500, ns : '1'},//6
        {x: 700, y: 350, level : 700, ns: '3'}//7
    ];
    const links = [
        {source : 0, target: 1},
        {source : 0, target: 2},
        {source : 0, target: 3},
        {source : 1, target: 4},
        {source : 2, target: 5},
        {source : 2, target: 6},
        {source : 5, target: 7}
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


    console.log(ns_r1);
    const svg = new SVGBuilder();
    svg.draw([ns_r1, ns_r2, ns_r3], nodes, links);
}