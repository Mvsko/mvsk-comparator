const puppeteer = require('puppeteer');
const https = require('https');

async function getOfferLink(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Utilisez le sélecteur correct pour le bouton "Voir l'offre"
  const offerLinkSelector = '.btn.btn-primary';
  const offerLink = await page.$eval(offerLinkSelector, el => el.href);
  

  // Click on the 'Voir l'offre' button and wait for navigation if it's a simple redirect
  await Promise.all([
    page.goto(offerLink), // Assuming clicking the button will cause a navigation
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  // Check the current page URL
  const newUrl = page.url();
  
  await browser.close();

  return newUrl;
}

// Exemple d'utilisation :
getOfferLink('https://www.rue-montgallet.com/prix/acheter,gainward-geforce-rtx-4070-ghost,868896');