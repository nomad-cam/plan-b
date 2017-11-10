var https = require('https')

module.exports.latest = function(callback) {
  var body = ''
  var postData = JSON.stringify({
    CompanyId: 'Tattersalls',
    MaxDrawCountPerProduct: 1,
    OptionalProductFilter: ['TattsLotto'],
  })
  var requestOptions = {
    hostname: 'api.thelott.com',
    port: 443,
    path: '/sales/vmax/web/data/lotto/latestresults',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    }
  }
  var request = https.request(requestOptions, function(res) {
    var contentLength = parseInt(res.headers['content-length'], 10)
    res.on('data', function(chunk) {
      body += chunk
      if(Buffer.byteLength(body, 'utf8') !== contentLength) {
        return
      }

      var data = JSON.parse(body)
      var results = data.DrawResults[0]
      var mainNumbers = results.PrimaryNumbers
      var supplementaryNumbers = results.SecondaryNumbers
      var coin = results.Dividends.map(function (divData) { return divData.BlocDividend })
      var draw = results.DrawNumber
      var date = results.DrawDate.split('T')[0]

      if(!mainNumbers.length || !supplementaryNumbers.length) {
        callback(new Error('Numbers not found'))
      } else {
        callback(null, mainNumbers, supplementaryNumbers, draw, date, coin)
      }
    })
  })
  request.write(postData)
  request.on('error', callback)
}

function division(mainNumberCount, supplementaryNumberCount) {
  var requiredCombinations = [
    [6, 0],
    [5, 1],
    [5, 0],
    [4, 0],
    [3, 1],
    [1, 2]
  ]
  for(var i = 0; i < requiredCombinations.length; i += 1) {
    var requiredMains = requiredCombinations[i][0]
    var requiredSups = requiredCombinations[i][1]
    if(mainNumberCount >= requiredMains && supplementaryNumberCount >= requiredSups) {
      return i + 1 // return division number
    }
  }
  return null
}

module.exports.checkTicket = function(ticketNumbers, mainNumbers, supplementaryNumbers, coin) {
  var ticketResult = []
  for(var game = 0; game < ticketNumbers.length; game += 1) {
    var gameResult = {}
    var mainNumberCount = 0
    var supplementaryNumberCount = 0
    var reward = 0
    gameResult.numbers = []

    var gameNumbers = ticketNumbers[game]
    for(var i = 0; i < gameNumbers.length; i += 1) {
      var ticketNumber = gameNumbers[i]
      var mainNumber = mainNumbers.indexOf(ticketNumber) !== -1
      var supplementaryNumber = supplementaryNumbers.indexOf(ticketNumber) !== -1
      if(mainNumber) { mainNumberCount += 1 }
      if(supplementaryNumber) { supplementaryNumberCount += 1 }
      gameResult.numbers.push({
        value: ticketNumber,
        mainNumber: mainNumber,
        supplementaryNumber: supplementaryNumber
      })
    }
    divNum = division(mainNumberCount, supplementaryNumberCount)

    if ( divNum !== null ) {
      var div = parseInt(divNum) - 1
      reward = coin[div]
    }

    gameResult.division = divNum
    gameResult.reward = reward

    ticketResult.push(gameResult)
  }
  return ticketResult
}
