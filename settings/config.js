const fs = require('fs');

let websiteData;

function loadWebsiteData() {
  const data = fs.readFileSync('./settings/website.json', 'utf8');
  websiteData = JSON.parse(data);
}

function getWebsiteData() {
  return websiteData;
}

module.exports = { loadWebsiteData, getWebsiteData };