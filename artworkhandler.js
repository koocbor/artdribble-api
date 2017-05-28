'use strict'

var dbprocs = require('./dbprocs.js');
var utils = require('./utils.js');

/**
 * To test locally:
 * lambda-local -l artworkhandler.js -h getArtwork -e event.json -t 10
 */
exports.getArtwork = (event, context, callback) => {

    var key = new Date().yyyymmdd();
    
    dbprocs.getArtworkForDate(key)
    .then(data => {
        console.log('data: ' + JSON.stringify(data, null, 2));

        if (data.Item) {

            const response = {
                status: 200,
                body: JSON.stringify(data.Item)
            };

            callback(null, response);
        } else {
            
            const response = {
                status: 404,
                body: JSON.stringify({
                    errStatus: 404,
                    errMessage: "No artwork found for " + key
                })
            };

            callback(null, response);
        }
    })
    .catch(err => {
        console.log('err: ' + err);
        callback(err, null);
    });

};