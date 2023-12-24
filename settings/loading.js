function loading() {
  process.stdout.write('Chargement');

  let count = 0;
  const intervalId = setInterval(() => {
    process.stdout.clearLine(); 
    process.stdout.cursorTo(0);
    process.stdout.write('Chargement');

    count++;
    for (let i = 0; i < count; i++) {
      process.stdout.write('.'); 
    }

    if (count === 3) {
      count = 0; 
    }
  }, 1000);

  return intervalId;
}

module.exports = { loading };