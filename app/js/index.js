/**
 * Created by sashkoboom on 5. 3. 2018.
 */

/* eslint-disable */

import '../styles/styles.css';
import renderInputToTable from './render/input_table';
import ColorManager from './render/color_manager';
import NetworkDataManager from './handle_data/network_data_manager';
import SVGBuilder from './render/svg_builder';
import { clearNsTables } from './render/ns_table'





class InvalidOJSONError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidJSON';
  }
}

let dataManager, svg = null;


const main = (input = null) => {

  if (input == null) throw InvalidOJSONError('Invalid JSON received');


  // remove button
  const b = document.querySelector(".custom-file-upload ");
  b.parentNode.removeChild(b);
  const i = document.querySelector('input[type="file"]');
  i.parentNode.removeChild(i);

  // const closeBtn = document.createElement('span');
  // closeBtn.classList.add("close-thin-corner");
  //
  // closeBtn.addEventListener('click', () => {
  //   clearNsTables();
  //   mainEl.removeChild(closeBtn);
  //   svg = document.querySelector('svg');
  //   svg.classList.add('low_opacity');
  //   setTimeout(() => {
  //     mainEl.removeChild(svg);
  //
  //     svg = null;
  //     dataManager = null ;
  //
  //     document.querySelector('input[type="text"]').classList.add('hide');
  //
  //     const inp = document.createElement('input');
  //     inp.id = 'files';
  //     inp.type ="file";
  //     inp.name="files[]";
  //     inp.addEventListener('change', handleFileSelect, false);
  //
  //     mainEl.appendChild(b);
  //     mainEl.appendChild(inp);
  //   }, 120);
  // });

  const mainEl = document.querySelector("main");




  // mainEl.appendChild(closeBtn);


  // Parse JSON-obj to my own objs I can then render
  dataManager = new NetworkDataManager(input);


  // render
  const render = new SVGBuilder(
    dataManager.getNSForSVG(),
    dataManager.getInterfacesForSVG(),
    dataManager.getLinksForSVG(),
    dataManager.getOtherLinksForSVG(),
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
