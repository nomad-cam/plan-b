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
