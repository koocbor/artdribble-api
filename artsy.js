module.exports = function artsy() {

    var Promise = require('bluebird');
    var rp = require('request-promise');

    var artsyCredentials = {
        clientId: process.env.ARTSY_CLIENT_ID,
        clientSecret: process.env.ARTSY_CLIENT_SECRET,
        token: null
    }

    this.getArtist = function() {
        return new Promise(function (resolve, reject) {
            try {
                this.getToken()
                    .then(token => {

                    })
                    .catch(err => {
                        throw err;
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    this.getArtwork = function() {
        return new Promise(function (resolve, reject) {
            try {
                getToken()
                    .then(token => {
                        // TODO: Get Cached Artwork

                        var options = {
                            method: 'GET',
                            uri: 'https://api.artsy.net/api/artworks',
                            qs: {
                                sample: 1
                            },
                            headers: {
                                'X-XAPP-Token': token
                            },
                            json: true
                        }

                        rp(options)
                            .then(artwork => {
                                resolve(artwork);
                            })
                            .catch(err => {
                                throw err;
                            })
                    })
                    .catch(err => {
                        throw err;
                    })
            } catch (e) {
                reject(e);
            }
        });
    }

    function getToken() {
        return new Promise(function(resolve, reject) {
            try {

                if (artsyCredentials.token) {
                    resolve(artsyCredentials.token);
                    return;
                }

                var options = {
                    method: 'POST',
                    uri: 'https://api.artsy.net/api/tokens/xapp_token',
                    form: {
                        "client_id": artsyCredentials.clientId,
                        "client_secret": artsyCredentials.clientSecret
                    }
                }

                rp(options)
                    .then(function (body) {
                        var bodyObj = JSON.parse(body);
                        artsyCredentials.token = bodyObj.token;
                        resolve(artsyCredentials.token);
                    })
                    .catch(function (err) {
                        throw err;
                    })
            } catch (e) {
                reject(e);
            }
        });
    }

}