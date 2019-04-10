/**
 * Created by sashkoboom on 5. 3. 2018.
 */

/* eslint-disable */


import renderInputToTable from './render/input_table';
import ColorManager from './render/color_manager';
import NetworkDataManager from './handle_data/network_data_manager';
import SVGBuilder from './render/svg_builder';
import example from './render/example';

class InvalidOJSONError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidJSON';
  }
}

const main = (input = null) => {
  if (input == null) throw InvalidOJSONError('Invalid JSON received');

  // Initialize color manager with array of names of given namespaces
  const colorManager = new ColorManager(Object.keys(input.namespaces));

  // Draw a small table to see the input data
  renderInputToTable(input, colorManager);

  // Parse JSON-obj to my own objs I can then render
  const dataManager = new NetworkDataManager(input);

  // render
  const render = new SVGBuilder(
    dataManager.getNSForSVG(),
    dataManager.getInterfacesForSVG(),
    dataManager.getLinksForSVG(),
    colorManager,
  );
  render.draw();
};

/*
 * Getting the JSON input
 * */
const handleFileSelect = (evt) => {
  const { files } = evt.target;
  const fr = new FileReader();
  fr.onload = e => main(JSON.parse(e.target.result));
  fr.readAsText(files[0]);
};


window.document.getElementById('files').addEventListener('change', handleFileSelect, false);
