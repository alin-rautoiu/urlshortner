var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:1qaz2wsx@ds063725.mlab.com:63725/heroku_x8050km9');
var Schema = mongoose.Schema;

var shortUrlSchema = new Schema({
    smallId: String,
    url: String
});

var ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

module.exports = {
    ShortUrl: ShortUrl
}