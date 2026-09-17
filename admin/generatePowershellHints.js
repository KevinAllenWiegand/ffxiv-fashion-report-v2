'use strict';

const fs = require('fs');
const MASTER_FILE = '../public/master.json';

let rawMasterData = fs.readFileSync(MASTER_FILE);
let masterData = JSON.parse(rawMasterData);
let hintsMap = new Map();

masterData.slots.forEach(slot => {
    if (!hintsMap.has(slot.type)) {
        hintsMap.set(slot.type, [slot.hint]);
    } else {
        hintsMap.get(slot.type).push(slot.hint);
    }
});

hintsMap.forEach((hints, type) => {
    hints.sort(function (x, y) {
        const xName = x.toString().replace(/\"/g, '');
        const yName = y.toString().replace(/\"/g, '');

        return xName.localeCompare(yName);
    });

    fs.writeFileSync(`powershell-hints-${type.toLowerCase()}.txt`, hints.join('\n'));
});