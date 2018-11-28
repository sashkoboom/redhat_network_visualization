/**
 * Created by sashkoboom on 5. 3. 2018.
 */
import renderInputToTable from "./render/input_table";
import ColorManager from "./render/color_manager";
import NetworkDataManager from "./handle_data/network_data_manager"
import SVGBuilder from "./render/svg_builder";

const Main = class{
    start(input = null){

        if(input == null) throw InvalidOJSONError("Invalid JSON received") ;

        //Initialize color manager with array of names of given namespaces
        const colorManager = new ColorManager(Object.keys(input.namespaces));

        //Draw a small table for me to see the input
        renderInputToTable(input, colorManager);

        // //Parse JSON-obj to my own objs I can then render
        const dataManager = new NetworkDataManager(input);

        // //render
        const render = new SVGBuilder(
            dataManager.getNSForSVG(),
            dataManager.getInterfacesForSVG(),
            dataManager.getLinksForSVG(),
            colorManager
        );
        render.start();
    }
};

const main = new Main();

/*
 * Getting the JSON input
 * */
const handleFileSelect = (evt) => {
    const files = evt.target.files, f = files[0], fr = new FileReader();
    fr.onload = (e) => main.start(JSON.parse(e.target.result));
    fr.readAsText(f);
};


//
document.getElementById('files').addEventListener('change', handleFileSelect, false);

class InvalidOJSONError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'InvalidJSON';
    }
}


/*-----------------*/

