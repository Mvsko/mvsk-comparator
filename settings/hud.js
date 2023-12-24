const readline = require('readline');
const pricefunding = require('./getPrice.js');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const historyFile = './logs/searchHistory.json';

console.clear();





function saveToHistory(searchData) {
    fs.readFile(historyFile, (err, data) => {
      let historyData = err ? { history: [] } : JSON.parse(data);

      historyData.history.push(searchData);
  
      fs.writeFile(historyFile, JSON.stringify(historyData, null, 2), (writeErr) => {
        if (writeErr) throw writeErr;
      });
    });
  }
  
  function rlhud() {
    rl.question('Quel produit souhaitez-vous regarder ? (tapez "exit" pour quitter) : ', (answer) => {
      if (answer.toLowerCase() === 'exit') {
        rl.close();
      } else {
        pricefunding.getPrice(answer).then(price => {
          console.log(price);
          saveToHistory({ query: answer, result: price });
          rlhud();
        });
      }
    });
  }


module.exports = {rlhud};