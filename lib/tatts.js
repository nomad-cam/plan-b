var https = require('https');

module.exports.latest = function(callback) {
  var body = '';
  https.get('https://tatts.com/tattersalls/results/latest-results?product=Tattslotto', function(res) {
    var contentLength = parseInt(res.headers['content-length'], 10);
    res.on('data', function(chunk) {
      body += chunk;
      if(Buffer.byteLength(body, 'utf8') === contentLength) {
        var re = /<div class="drawn-number">(\d+)<\/div>/g
          , mainNumbers = []
          , supplementaryNumbers = []
          , date
          , match;

        if((match = body.match(/<span class="draw-date">([^<]+)<\/span>\s*<span class="draw-number">([^<]+)<\/span>/)) !== null) {
          date = match[1] + ' ' + match[2];
        }

        while((match = re.exec(body)) !== null) {
          var number = parseInt(match[1], 10);
          if(mainNumbers.length < 6) {
            mainNumbers.push(number);
          } else {
            supplementaryNumbers.push(number);
          }
        }
        if(!mainNumbers.length || !supplementaryNumbers.length) {
          callback(new Error('Numbers not found'));
        } else {
          callback(null, mainNumbers, supplementaryNumbers, date);
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
        value: ticketNumber,
        mainNumber: mainNumber,
        supplementaryNumber: supplementaryNumber
      });
    }
    gameResult.division = division(mainNumberCount, supplementaryNumberCount);
    ticketResult.push(gameResult);
  }
  return ticketResult;
};
