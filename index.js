var express = require('express');
var sh = require('shorthash');

var app = express();
var ShortUrl = require("./model").ShortUrl;

app.get('/new/:url', function(req, res) {
    var longUrl = req.params.url;
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
});

app.get('/:url', function(req, res) {
    var shortendedUrl = req.params.url;

    ShortUrl
        .findOne({'smallId': shortendedUrl})
        .exec(function (err, shortUrl) {
            if (err) {
                res.send("Error: " + err);
            }

            if(shortUrl !== null) {
                res.writeHead(301,
                {Location: shortUrl.url}
                );
                res.end();
            }
        });
});

app.listen(process.env.PORT || 3002);