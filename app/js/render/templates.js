/* eslint-disable */

export const interfaceTemplate = (d) => `
<div class="tooltip_small">

<div> ${d.name}</div>

<div>driver:${d.json.driver ? d.json.driver : "none"}</div>

<div>${d.json.addresses.length > 0 ? "adrrr" : "no IP addresses"}</div>

<div>${d.json.mac ? d.json.mac : "no MAC addr"}</div>

<div>MTU ${d.json.mtu}</div>

<div>`;

const plus = ' <div class="round-button" id="plus_${d.name}">&#43; </div>';

export const nameSpaceTemplate = (d) => `<div class="tooltip_big">
    <table class="routing" >
    <th>destination</th>
    <th>family</th>
    <th>gateway</th>
    <th>iif</th>
    <th>metrics</th>
    <th>oif</th>
    <th>priority</th>
    <th>protocol</th>
    <th>scope</th>
    <th>source</th>
    <th>preferred-source</th>
    <th>tos</th>
    <th>type</th>
        <tr>
            <td>192.168.168.0/24</td>
            <td>INET</td>
            <td>192.168.168.1</td>
            <td>my_ns1/</td>
            <td>hoplimit :64</td>
            <td>//eth0</td>
            <td>100</td>
            <td>kernel</td>
            <td>link</td>
            <td>///</td>
            <td>192.168.168.9</td>
            <td>0</td>
            <td>unicast</td>
        </tr><tr>
            <td>192.168.168.0/24</td>
            <td>INET</td>
            <td>192.168.168.1</td>
            <td>my_ns1/</td>
            <td>hoplimit :64</td>
            <td>//eth0</td>
            <td>100</td>
            <td>kernel</td>
            <td>link</td>
            <td>///</td>
            <td>192.168.168.9</td>
            <td>0</td>
            <td>unicast</td>
        </tr><tr>
            <td>192.168.168.0/24</td>
            <td>INET</td>
            <td>192.168.168.1</td>
            <td>my_ns1/</td>
            <td>hoplimit :64</td>
            <td>//eth0</td>
            <td>100</td>
            <td>kernel</td>
            <td>link</td>
            <td>///</td>
            <td>192.168.168.9</td>
            <td>0</td>
            <td>unicast</td>
        </tr><tr>
            <td>192.168.168.0/24</td>
            <td>INET</td>
            <td>192.168.168.1</td>
            <td>my_ns1/</td>
            <td>hoplimit :64</td>
            <td>//eth0</td>
            <td>100</td>
            <td>kernel</td>
            <td>link</td>
            <td>///</td>
            <td>192.168.168.9</td>
            <td>0</td>
            <td>unicast</td>
        </tr><tr>
            <td>192.168.168.0/24</td>
            <td>INET</td>
            <td>192.168.168.1</td>
            <td>my_ns1/</td>
            <td>hoplimit :64</td>
            <td>//eth0</td>
            <td>100</td>
            <td>kernel</td>
            <td>link</td>
            <td>///</td>
            <td>192.168.168.9</td>
            <td>0</td>
            <td>unicast</td>
        </tr>
</table>
</div>
`;

export const name = (d) => d.name ;