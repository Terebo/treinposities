import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import * as lib from './lib.js';
import cheerio, { CheerioAPI, load } from 'cheerio';
const config = JSON.parse(fs.readFileSync("./config.json", { encoding: "utf8" }));
let date: Date[] = [new Date(Date.parse(config.start)), new Date(Date.parse(config.end))];
var ritArray: ritArray[] = [];
for (let index = date[0]; index <= date[1]; index.setDate(index.getDate() + 1)) {
    const response = await fetch('https://treinposities.nl/mijnritten/' + lib.parseDate(index), { headers: { cookie: config.cookies } });
    const body = await response.text();
    let $: CheerioAPI = load(body);
    if ($('table').html() !== null) {
        let rittenInDay = $('table tbody tr');
        for (let tableindex = 0; tableindex < ($('table tbody tr').length - 3) / 2; tableindex++) {
            var rit = new lib.ritdata($(rittenInDay[(tableindex * 2) + 1]).html() as string, index);
            rit.addTrainData($(rittenInDay[(tableindex * 2) + 2]).html() as string);
            ritArray.push(rit.toString());
        }
    }
}
fs.writeFileSync("./dump/data.json", JSON.stringify(ritArray, undefined, 3), {encoding: "utf8"});


