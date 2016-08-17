var express = require('express');
var sh = require('shorthash');

var app = express();
var ShortUrl = require("./model").ShortUrl;

function writeUrl(req, res) {    
    var protocol = arguments[2];
    var longUrl = protocol != null ? protocol + '' + req.params.url : req.params.url;
    var shortendedUrl = sh.unique(longUrl);

    var short = new ShortUrl({
        smallId: shortendedUrl,
        url: longUrl
    });

    ShortUrl
        .findOne({'smallId': shortendedUrl})
        .exec(function (err, shortUrl) {
            if (err) {
                res.send("Error: " + err);
            } else if (shortUrl === null || shortUrl === undefined) {

                short.save(function (err) {
                    if (err) {
                        res.send("Error: " + err);
                    }
                });
            }
        });

    res.type('application/json');
    res.send(
        {
            "original_url": longUrl,
            "short_url": shortendedUrl
        });
}

app.get('/new/https://:url*', function(req, res) {
    writeUrl(req, res, 'https://');
});
app.get('/new/http://:url*', function(req, res) {
    writeUrl(req, res, 'http://');
});
app.get('/new/:url*', writeUrl);


app.get('/:url', function(req, res) {
    var shortendedUrl = req.params.url;

    ShortUrl
        .findOne({'smallId': shortendedUrl})
        .exec(function (err, shortUrl) {
            if (err) {
                res.send("Error: " + err);
            }

            if(shortUrl !== null) {
                res.redirect(shortUrl.url);
            }
        });
});

app.listen(process.env.PORT || 3002);