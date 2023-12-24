const puppeteer = require('puppeteer');
const { loading } = require('./loading');



function areFloatsEqual(float1, float2, tolerance = 1) {
  return Math.abs(float1 - float2) < tolerance;
}

async function getPrice(productName) {
  const loadingInterval = loading(); // Démarre l'animation de chargement
  const browser = await puppeteer.launch({ headless: "new" }); // Changé à true pour mode sans tête
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.rue-montgallet.com/prix/rechercher?kw=${encodeURIComponent(productName)}`, {
      waitUntil: 'networkidle0'
    });

    const totalFoundSelector = '#totalFound';
    const totalFoundText = await page.$eval(totalFoundSelector, el => el.innerText);
    const totalFound = parseInt(totalFoundText.match(/\d+/)[0], 10);
    console.log(`\nTotal trouvé : ${totalFound}`);

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
      return "Aucun produit correspondant au prix minimum indiqué n'a été trouvé.";
    }

    const minPriceSelector = '.irs-from';
    await page.waitForSelector(minPriceSelector, { timeout: 5000 });
    const minPriceText = await page.$eval(minPriceSelector, el => el.innerText);
    const minPrice = parseFloat(minPriceText.replace(/[^\d,.-]/g, '').replace(',', '.'));
    console.log(`\n[LOGS] > Prix minimum trouvé : ${minPrice} €`);


    const prices = await page.$$eval('.prix', nodes => nodes.map(node => {
      // Utilise le sélecteur correct pour extraire les prix
      const priceText = node.innerText.trim();
      return parseFloat(priceText.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }));

    const lowestPrice = Math.min(...prices);
    console.log(`[LOGS] > Le prix le plus bas trouvé : ${lowestPrice} €`);


    const productWithMinPrice = prices.find(price => areFloatsEqual(price, minPrice));

    if (productWithMinPrice !== undefined) {
      return `Un produit avec le prix approximativement égal à ${minPrice} € a été trouvé.`;
    } else {
      return "Aucun produit correspondant au prix minimum indiqué n'a été trouvé.";
    }
  } catch (error) {
    console.error(`Erreur détectée : ${error}`);
    return `Une erreur est survenue : ${error.message}`;
  } finally {
    clearInterval(loadingInterval); // Arrête l'animation de chargement
    await browser.close();
  }
}



module.exports = { getPrice };