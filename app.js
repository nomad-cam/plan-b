var tatts = require('./lib/tatts')
  , ourNumbers = require('./numbers')
  , http = require('http')
  , jade = require('jade')
  , fs = require('fs');

var index = jade.compile(fs.readFileSync('index.jade', 'utf8'));

http.createServer(function(req, res) {
  if(req.url === '/style.css') {
      res.writeHead(200, {'Content-Type': 'text/css'});
      fs.readFile('style.css', 'utf8', function(err, data) {
        res.end(data+'\n');
      });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    tatts.latest(function(err, mainNumbers, supplementaryNumbers) {
      if(!err) {
        var results = tatts.checkTicket(ourNumbers, mainNumbers, supplementaryNumbers);
        res.end(index({games: results})+'\n');
      } else {
        console.log('Err: ', err);
      }
    });
  }
}).listen(9010, '127.0.0.1');
