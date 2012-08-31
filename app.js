var tatts = require('./lib/tatts');

tatts.latest(function(err, mainNumbers, supplementaryNumbers) {
  if(!err) {
    console.log(mainNumbers);
    console.log(supplementaryNumbers);
  } else {
    console.log('Err: ', err);
  }
});
