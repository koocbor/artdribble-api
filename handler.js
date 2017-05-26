'use strict'

var dotenv = require('dotenv').config();
var artsy = require('./artsy.js');

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

}