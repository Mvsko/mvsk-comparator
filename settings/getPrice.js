const puppeteer = require('puppeteer');
const { loading } = require('./loading');
const websiteData = require('./website.json');

function areFloatsEqual(float1, float2, tolerance = 1) {
  return Math.abs(float1 - float2) < tolerance;
}


const matchingWebsite = websiteData.websites.find(site => site.name === websiteData.default.name);
const urlSearch = matchingWebsite ? matchingWebsite.urlsearch : null;


async function getPrice(productName) {
  const loadingInterval = loading();
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const startTime = Date.now();

  try {
    await page.goto(`${urlSearch}${encodeURIComponent(productName)}`, {
      waitUntil: 'networkidle0'
    });

    let totalFound;
    try {
      const totalFoundText = await page.$eval('#totalFound', el => el.innerText);
      totalFound = parseInt(totalFoundText.match(/\d+/)[0], 10);
      console.log(`\nTotal trouvé : ${totalFound}`);
    } catch (error) {
      return "\nErreur : Le sélecteur '#totalFound' est introuvable sur la page.";
    }

    if (totalFound > 50) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }
    
    if (totalFound == 0){
      return "\nErreur: Aucun produit correspondant au prix minimum indiqué n'a été trouvé.";
    }

    let minPrice;
    try {
      await page.waitForSelector('.irs-from', { timeout: 5000 });
      const minPriceText = await page.$eval('.irs-from', el => el.innerText);
      minPrice = parseFloat(minPriceText.replace(/[^\d,.-]/g, '').replace(',', '.'));
      console.log(`\n[LOGS] > Prix minimum trouvé : ${minPrice} €`);
    } catch (error) {
      return "\nErreur : Le sélecteur '.irs-from' est introuvable sur la page.";
    }


    const productDetails = await page.$$eval('.product-card', nodes => nodes.map(node => {
      const priceText = node.querySelector('.prix').innerText.trim();
      const price = parseFloat(priceText.replace(/[^\d,.-]/g, '').replace(',', '.'));
      const productName = node.querySelector('strong').innerText.trim();
      const productLink = node.href;
      return { productName, price, productLink };
    }));
    
    const lowestPriceDetail = productDetails.reduce((lowest, product) => {
      return (lowest.price < product.price) ? lowest : product;
    }, { productName: '', price: Number.POSITIVE_INFINITY, productLink: '' });
    
    console.log(`[LOGS] > Le produit le moins cher trouvé : ${lowestPriceDetail.productName} au prix de ${lowestPriceDetail.price} €`);
    console.log(`[LOGS] > Lien du produit : ${lowestPriceDetail.productLink}`);
    
    const productWithMinPrice = areFloatsEqual(lowestPriceDetail.price, minPrice);

    const realOfferLink = await getOfferLink(lowestPriceDetail.productLink);
    
    const endTime = Date.now();
    const searchDuration = (endTime - startTime) / 1000;

    if (productWithMinPrice !== undefined) {
      return {
        success: true,
        message: `Un produit avec le prix approximativement égal à ${minPrice} € a été trouvé.`,
        searchDuration: searchDuration,
        productName: lowestPriceDetail.productName,
        price: lowestPriceDetail.price,
        productLink: lowestPriceDetail.productLink,
        realOfferLink: realOfferLink
      };
    } else {
      return {
        success: false,
        message: `Aucun produit correspondant au prix minimum indiqué n'a été trouvé.`,
        searchDuration: searchDuration
      };
    }
  } catch (error) {
    console.error(`Erreur détectée : ${error}`);
    return `Une erreur est survenue : ${error.message}`;
  } finally {
    clearInterval(loadingInterval);
    await browser.close();
  }
}



async function getOfferLink(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle0' });

  const offerLinkSelector = '.btn.btn-primary';
  const offerLink = await page.$eval(offerLinkSelector, el => el.href);
  
  await Promise.all([
    page.goto(offerLink), 
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  const newUrl = page.url();
  
  await browser.close();

  return newUrl;
}

module.exports = { getPrice };