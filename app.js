var tatts = require('./lib/tatts')
  , ourNumbers = require('./numbers');

tatts.latest(function(err, mainNumbers, supplementaryNumbers) {
  if(!err) {
    console.log(mainNumbers);
    console.log(supplementaryNumbers);
    var results = tatts.checkTicket(ourNumbers, mainNumbers, supplementaryNumbers);
    console.log(JSON.stringify(results));
  } else {
    console.log('Err: ', err);
  }
});
