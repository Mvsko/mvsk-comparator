const config = require('./settings/config.js');
const pricefunding = require('./settings/getPrice.js');
const hud = require ('./settings/hud.js');

config.loadWebsiteData();
const getwebdata = config.getWebsiteData();

hud.startMainMenu();