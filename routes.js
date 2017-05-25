module.exports = function(app) {

    var Promise = require('bluebird');
    var ArtsyApi = require('./artsy.js');

    var artsy = new ArtsyApi();


    app.get('/', function(req,res) {
        res.send('Art Dribble - welcome');
    });

    app.get('/v1/dailydribble', function(req,res) {

        artsy.getArtwork()
            .then(artwork => {
                res.send(JSON.stringify(artwork));
            })
            .catch(err => {
                res.status(400);
                res.send('{ "error": "An error occurred" }')
            });

    });
}