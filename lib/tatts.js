var http = require('http');

module.exports.latest = function() {
  var body = '';
  http.get('http://tatts.com/tattersalls/results/latest-results?product=Tattslotto', function(res) {
    var contentLength = parseInt(res.headers['content-length']);
    res.on('data', function(chunk) {
      body += chunk;
      if(Buffer.byteLength(body, 'utf8') === contentLength) {
        var re = /class="resultNumberSpn( resultSecondaryNumberColor)?" title="(\d*)"/g;
        var match = re.exec(body);
        var mainNumbers = [];
        var suplementaryNumbers = [];
        while(match) {
          if(!match[1]) {
            mainNumbers.push(parseInt(match[2]));
          } else {
            suplementaryNumbers.push(parseInt(match[2]));
          }
          match = re.exec(body);
        }
        console.log(mainNumbers);
        console.log(suplementaryNumbers);
      }
    });
  });
}
