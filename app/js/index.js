/**
 * Created by sashkoboom on 5. 3. 2018.
 */

/* eslint-disable */

import '../styles/styles.css';
import renderInputToTable from './render/input_table';
import ColorManager from './render/color_manager';
import NetworkDataManager from './handle_data/network_data_manager';
import SVGBuilder from './render/svg_builder';
import * as d3 from "d3";
import * as constants from "./utils/constants";





class InvalidOJSONError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidJSON';
  }
}



const main = (input = null) => {

  if (input == null) throw InvalidOJSONError('Invalid JSON received');



  // remove button
  const b = document.querySelector(".custom-file-upload ");
  b.parentNode.removeChild(b);
  const i = document.querySelector('input');
  i.parentNode.removeChild(i);

  const closeBtn = document.createElement('span');
  closeBtn.classList.add("close-thin-corner");

  closeBtn.addEventListener('click', () => {

    mainEl.removeChild(closeBtn);
    const svg = document.querySelector('svg');
    svg.classList.add('low_opacity');
    setTimeout(() => {
      mainEl.removeChild(svg);

      const inp = document.createElement('input');
      inp.id = 'files';
      inp.type ="file";
      inp.name="files[]";
      inp.addEventListener('change', handleFileSelect, false);

      mainEl.appendChild(b);
      mainEl.appendChild(inp);
    }, 120);



  });

  console.log(closeBtn);

  const mainEl = document.querySelector("main");




  mainEl.appendChild(closeBtn);



  // Initialize color manager with array of names of given namespaces
  const colorManager = new ColorManager(Object.keys(input.namespaces));

  // Draw a small table to see the input data
  // renderInputToTable(input, colorManager);

  // Parse JSON-obj to my own objs I can then render
  const dataManager = new NetworkDataManager(input);

  // render
  const render = new SVGBuilder(
    dataManager.getNSForSVG(),
    dataManager.getInterfacesForSVG(),
    dataManager.getLinksForSVG(),
    dataManager.getOtherLinksForSVG(),
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
  console.log(files);
  fr.readAsText(files[0]);
};


window.document.getElementById('files').addEventListener('change', handleFileSelect, false);
