const readline = require('readline');
const pricefunding = require('./getPrice.js');
const fs = require('fs');
const { start } = require('repl');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const historyFile = './logs/searchHistory.json';

console.clear();



function startMainMenu(){
  rl.question(__dirname + "> ", (answer) => {
    let command = answer.split(' ')[0];

    switch(command){
      case "help":
        console.log('Liste des commandes disponibles :\n- help\n- clear\n- comp\n- exit');
        break;
      case "exit":
        rl.close();
        return;
      case "clear":
        console.clear()
        break;
      case "comp":
        rlhud()
        return;
      default:
        console.log('Commande inconnue. Tapez "help" pour afficher la liste des commandes.\n');
        break;
    }
    startMainMenu();
  });
}



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
        rl.question('> Souhaitez-vous retourner au menu ou quitter le programme ?:  ', (answer) => {
          if (answer.trim().toLowerCase() === "exit") {
            console.log('Fermeture du programme.');
            rl.close();
          } else {
            startMainMenu();
          }
        });
      } else {
        pricefunding.getPrice(answer).then(price => {
          console.log(price);
          saveToHistory({ query: answer, result: price });
          rlhud();
        });
      }
    });
  }


module.exports = {rlhud, startMainMenu};