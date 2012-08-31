module.exports.latest = function() {
  var request = new XMLHttpRequest();
  var url = 'http://tatts.com/tattersalls/results/latest-results?product=Tattslotto';
  request.open('GET', url, false);
  request.send();

  if (request.status === 200) {
    console.log(request.responseText);
  }
}
