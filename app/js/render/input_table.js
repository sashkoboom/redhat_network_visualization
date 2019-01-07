/**
 * Created by sashkoboom on 17. 10. 2018.
 */

const renderInputToTable = (json, colorManager) => {
  const { namespaces } = json;
  if (!namespaces) throw new Error('Bad JSON input!');

  const div = document.querySelector('#info');
  let acc = 0;
  Object.values(namespaces).forEach((namespace) => {
    // draw every interface to column
    Object.values(namespace.interfaces).forEach((interf, i) => {
      acc += 1;
      const table = document.querySelector('table');
      const tr = document.createElement('tr');
      tr.classList.add(colorManager.getClassName(interf.namespace));
      const td = document.createElement('td');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      const td3 = document.createElement('td');
      const td4 = document.createElement('td');
      const td5 = document.createElement('td');
      td.innerHTML = interf.id;

      if (interf.children) {
        Object.values(interf.children).forEach(
          (child) => { td1.innerHTML += `${child.target}, `; },
        );
      }
      if (interf.parents) {
        Object.values(interf.parents).forEach((par) => { td2.innerHTML += `${par.target}, `; });
      }

      if (interf.peer) td3.innerHTML += interf.peer.target;

      if (interf.namespace) {
        td4.innerHTML += interf.namespace;
        td4.innerHTML += ', ';
      }

      td5.innerHTML += `${i + 1}`;

      tr.appendChild(td);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      table.appendChild(tr);

      div.innerHTML = `namespaces total : <strong>${Object.values(namespaces).length}</strong>, interfaces total: <strong>${acc}</strong> `;
    });
  });
};

export default renderInputToTable;
