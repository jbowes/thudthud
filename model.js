var fs = require('fs')

module.exports = {
    table: table,
    initModel: initModel
};

var table = {
    drums: [],
    bars: [],

    table: {}
};

function initModel() {
    var drums = [];
    files = fs.readdirSync(__dirname + "/static/sound/")
        
    for (file in files) {
        drums.push(files[file].split(".")[0]);
    }

    table.drums = drums;
    table.bars = [0, 1, 2, 3, 4, 5, 6, 7];

    for (drum in drums) {
        table.table[drums[drum]] = [false, false, false, false, false, false, false, false];
    }

    return table;
}
