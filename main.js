/**
 * Created by sashkoboom on 5. 3. 2018.
 */

const Main = class{

    constructor(){}

    start(input = null){

        if(input == null) throw InvalidOJSONError("Invalid JSON received") ;

        //Initialize color manager with array of names of given namespaces
        const colorManager = new ColorManager(Object.keys(input.namespaces));

        //Draw a small table for me to see the input
        renderInputToTable(input, colorManager);

        //Parse JSON-obj to my own objs I can then render
        const dataManager = new NetworkDataManager(input);

        //render
        const svg = new SVGBuilder(
            dataManager.getNSForSVG(),
            dataManager.getInterfacesForSVG(),
            dataManager.getLinksForSVG(),
            colorManager
        );
        svg.start();
    }
};

const main = new Main();


/*
 * Getting the JSON input
 * */
function handleFileSelect(evt) {
    const files = evt.target.files;
    f = files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(f);
    function receivedText(e) {
        lines = e.target.result;
        main.start(JSON.parse(lines));
    }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

class InvalidOJSONError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'InvalidJSON';
    }
}


setTimeout(
    function(){

        let nodes = [
            {x: 100, y: 350, level : 100, ns : '2'}, //0
            {x: 300, y: 150, level : 300},//1
            {x: 300, y: 350, level : 300, ns : '1'},//2
            {x: 300, y: 550, level : 300, ns : '1'},//3
            {x: 500, y: 150, level : 500},//4
            {x: 500, y: 350, level : 500, ns : '1'},//5
            {x: 500, y: 550, level : 500, ns : '1'},//6
            {x: 700, y: 350, level : 700, ns: '3'}//7
        ];
        let links = [
            {source : 0, target: 1},
            {source : 0, target: 2},
            {source : 0, target: 3},
            {source : 1, target: 4},
            {source : 2, target: 5},
            {source : 2, target: 6},
            {source : 5, target: 7}
        ];

        let ns_r1 = new NamespaceNode();
           ns_r1.setXYWH(230, 280, 600, 330);
           ns_r1.setId('1');
        let ns_r2 = new NamespaceNode();
        ns_r2.setId('2');
        let ns_r3 = new NamespaceNode();
        ns_r3.setId('3');
        ns_r2.setXYWH(10, 260, 70, 70);
        ns_r3.setXYWH(980, 360, 170, 130);


        console.log(ns_r1);
        const svg = new SVGBuilder();
        svg.draw([ns_r1, ns_r2, ns_r3], nodes, links);
}, 100);

function renderInputToTable(json, colorManager){
    let namespaces = json.namespaces;
    if(!namespaces) throw new Error("Bad JSON input!");

    for(const namespace of Object.values(namespaces)) {
        //draw every interface to column
      for(const interf of Object.values(namespace.interfaces)){
                let table = document.querySelector("#table");
                let tr = document.createElement("tr");
                tr.classList.add(colorManager.getClassName(interf.namespace));
                let td = document.createElement("td");
                let td1 = document.createElement("td");
                let td2 = document.createElement("td");
                let td3 = document.createElement("td");
                let td4 = document.createElement("td");
                td.innerHTML = interf.id;

                if (interf.children) {
                    Object.values(interf.children)
                        .forEach(
                            function (child) {
                                td1.innerHTML += child.target + ", ";
                            }
                        )
                }
                if (interf.parents) {
                    Object.values(interf.parents)
                        .forEach(
                            function (par) {
                                td2.innerHTML += par.target + ", ";
                            }
                        )
                }

                if (interf.peer) {
                    td3.innerHTML += interf.peer.target;
                }

                if (interf.namespace) {

                    td4.innerHTML += interf.namespace;
                    td4.innerHTML += ", ";

                }
                tr.appendChild(td);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                table.appendChild(tr);
            }
    }
}
/*-----------------*/

