var Artsy = function() {

    var Promise = require('bluebird');
    var rp = require('request-promise');

    var artsyCredentials = {
        clientId: process.env.ARTSY_CLIENT_ID,
        clientSecret: process.env.ARTSY_CLIENT_SECRET,
        token: null
    }

    this.getArtwork = function() {
        return new Promise(function (resolve, reject) {
            try {
                getToken()
                    .then(token => {
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

    this.getArtworkArtist = function(uri) {
        return new Promise(function (resolve, reject) {
            try {

                if (!uri) {
                    resolve(null);
                    return;
                }

                getToken()
                    .then(token => {
                        var options = {
                            method: 'GET',
                            uri: uri,
                            headers: {
                                'X-XAPP-Token': token
                            },
                            json: true
                        }

                        rp(options)
                        .then(artist => {
                            resolve(artist)
                        })
                        .catch(err => {
                            throw err;
                        })
                    })
                    .catch(err => {
                        throw err;
                    });
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

module.exports = new Artsy();