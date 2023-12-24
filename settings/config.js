const fs = require('fs');

let websiteData;

function loadWebsiteData() {
  const data = fs.readFileSync('./settings/website.json', 'utf8'); // Utilise readFileSync pour charger les données au démarrage
  websiteData = JSON.parse(data);
}

function getWebsiteData() {
  return websiteData;
}

module.exports = { loadWebsiteData, getWebsiteData };