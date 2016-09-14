var cheerio = require('cheerio');
var request = require('request');

request({
    method: 'GET',
    url: 'https://github.com/showcases'
}, function(err, response, body) {
    if (err) return console.error(err);

    // Tell Cherrio to load the HTML
    $ = cheerio.load(body);
    $('li.collection-card').each(function() {
            var href = $('a.collection-card-image', this).attr('href');
            if (href.lastIndexOf('/') > 0) {
                console.log($('h3', this).text());
            }
    });
});
