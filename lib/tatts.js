var http = require('http');

module.exports.latest = function(callback) {
  var body = '';
  http.get('http://tatts.com/tattersalls/results/latest-results?product=Tattslotto', function(res) {
    var contentLength = parseInt(res.headers['content-length'], 10);
    res.on('data', function(chunk) {
      body += chunk;
      if(Buffer.byteLength(body, 'utf8') === contentLength) {
        var re = /class="resultNumberSpn( resultSecondaryNumberColor)?" title="(\d*)"/g
          , mainNumbers = []
          , supplementaryNumbers = []
          , match;
        while((match = re.exec(body)) !== null) {
          var number = parseInt(match[2], 10);
          if(!match[1]) {
            mainNumbers.push(number);
          } else {
            supplementaryNumbers.push(number);
          }
        }
        if(!mainNumbers.length || !supplementaryNumbers.length) {
          callback(new Error('Numbers not found'));
        } else {
          callback(null, mainNumbers, supplementaryNumbers);
        }
      }
    });
  }).on('error', callback);
};

function division(mainNumberCount, supplementaryNumberCount) {
  var requiredCombinations = [
    [6, 0],
    [5, 1],
    [5, 0],
    [4, 0],
    [3, 1],
    [1, 2]
  ];
  for(var i = 0; i < requiredCombinations.length; i += 1) {
    var requiredMains = requiredCombinations[i][0];
    var requiredSups = requiredCombinations[i][1];
    if(mainNumberCount >= requiredMains && supplementaryNumberCount >= requiredSups) {
      return i + 1;
    }
  }
  return null;
}

module.exports.checkTicket = function(ticketNumbers, mainNumbers, supplementaryNumbers) {
  var ticketResult = [];
  for(var game = 0; game < ticketNumbers.length; game += 1) {
    var gameResult = {};
    var mainNumberCount = 0;
    var supplementaryNumberCount = 0;
    gameResult.numbers = [];
    var gameNumbers = ticketNumbers[game];
    for(var i = 0; i < gameNumbers.length; i += 1) {
      var ticketNumber = gameNumbers[i];
      var mainNumber = mainNumbers.indexOf(ticketNumber) !== -1;
      var supplementaryNumber = supplementaryNumbers.indexOf(ticketNumber) !== -1;
      if(mainNumber) { mainNumberCount += 1; }
      if(supplementaryNumber) { supplementaryNumberCount += 1; }
      gameResult.numbers.push({
        number: ticketNumber,
        mainNumber: mainNumber,
        supplementaryNumber: supplementaryNumber
      });
    }
    console.log(mainNumberCount, supplementaryNumberCount);
    gameResult.division = division(mainNumberCount, supplementaryNumberCount);
    ticketResult.push(gameResult);
  }
  return ticketResult;
};
