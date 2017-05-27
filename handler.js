'use strict'

var dotenv = require('dotenv').config();
var dbprocs = require('./dbprocs.js');
var artsy = require('./artsy.js');
var AWS = require("aws-sdk");
var utils = require('./utils.js');

AWS.config.update({
  region: process.env.AWS_DYNOMODB_REGION || "us-west-2",
  endpoint: process.env.AWS_DYNOMODB_ENDPOINT || "http://localhost:8000"
});

/**
 * To test locally:
 * lambda-local -l handler.js -h artwork -e event.json -E
 */
exports.artwork = (event, context, callback) => {

    artsy.getArtwork()
        .then(artwork => {

            const response = {
                statusCode: 200,
                body: JSON.stringify(artwork)
            }
            
            callback(null, response);
        })
        .catch(err => {
            console.log(err);
            callback(err, null);
        });

};

/**
 * To test locally:
 * lambda-local -l handler.js -h createDailyDribble -e event.json
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