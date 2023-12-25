const { Signale } = require('signale');

function csmanager(){
    const options = {
        types: {
          ValidEv: {
            label: 'Validé',
            color: 'green',
            badge: '✅'
          },
          WarningEv: {
              label: 'Avertissement',
              color: 'yellow',
              badge: '⚠️'
            },
          ErrorEv: {
              label: 'Erreur',
              color: 'red',
              badge: '⛔'
            }
        }
      };
      
      const customLogger = new Signale(options);
}

module.exports = {csmanager};