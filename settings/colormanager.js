const { Signale } = require('signale');

function csmanager(){
    const options = {
        types: {
          ValidEv: {
            label: 'Validé', // Le nouveau préfixe que vous voulez utiliser
            color: 'green',
            badge: '✅'
          },
          WarningEv: {
              label: 'Avertissement', // Le nouveau préfixe que vous voulez utiliser
              color: 'yellow',
              badge: '⚠️'
            },
          ErrorEv: {
              label: 'Erreur', // Le nouveau préfixe que vous voulez utiliser
              color: 'red',
              badge: '⛔'
            }
        }
      };
      
      const customLogger = new Signale(options);
}

module.exports = {csmanager};