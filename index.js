const config = require('./settings/config.js');
const hud = require ('./settings/hud.js');
const ConsoleTitle = require('node-bash-title');
const configjson = require('./settings/config.json');

ConsoleTitle("Mvsk-Comparator - version " + configjson.comparator[0].version)

config.loadWebsiteData();
const getwebdata = config.getWebsiteData();

hud.startMainMenu();