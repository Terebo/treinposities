import fs from 'fs';

const file: ritArray[] = JSON.parse(fs.readFileSync("./dump/data.json", {encoding: "utf8"}));
var newArray: any[][] = file.map(({tijd,...rest}) => Object.values(rest));
newArray.unshift(Object.keys(file[0]))
fs.writeFileSync("./dump/transform.json", JSON.stringify(newArray, undefined, 3), {encoding: "utf8"});