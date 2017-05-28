'use strict'

var dotenv = require('dotenv').config();
var dbprocs = require('./dbprocs.js');
var artsy = require('./artsy.js');
var utils = require('./utils.js');

/**
 * To test locally:
 * lambda-local -l batchhandler.js -h createDailyDribble -e event.json
 */
exports.createDailyDribble = (event, context, callback) => {

    var key = new Date().yyyymmdd();
    
    dbprocs.getArtworkForDate(key)
    .then(data => {
        console.log('data: ' + JSON.stringify(data, null, 2));

        if (data.Item) {
            callback(null, data.Item);
        } else {
            artsy.getArtwork()
            .then(artsyInfo => {
                return dbprocs.createArtsyInfoForDate(key, artsyInfo);
            })
            .then(data => {
                callback(null, data.Item);
            })
            .catch (err => {
                throw err;
            });
        }
    })
    .catch(err => {
        console.log('err: ' + err);
        callback(err, null);
    });
};