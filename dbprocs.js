// Note: to run locally download local dynamodb and run the following cmd:
// java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -inMemory

var DbProcs = function() {

    var Promise = require('bluebird');
    var AWS = require("aws-sdk");
    var dotenv = require('dotenv').config();

    AWS.config.update({
        region: process.env.AWS_DYNAMODB_REGION || "us-west-2",
        endpoint: process.env.AWS_DYNAMODB_ENDPOINT || "http://localhost:8000"
    });

    this.createArtsyInfoForDate = (dribbledate, artworkInfo, artistInfo) => {
        return new Promise(function (resolve, reject) {
            try {

                var docClient = new AWS.DynamoDB.DocumentClient({convertEmptyValues: true});

                var params = {
                    TableName: "Artworks",
                    Item: {
                        "dribbledate": dribbledate,
                        "artsyArtworkSlug": artworkInfo.slug,
                        "artsyArtworkInfo": artworkInfo
                    }
                };

                if (artistInfo) {
                    params.Item["artsyArtistInfo"] = artistInfo;
                    params.Item["artsyArtistSlug"] = artistInfo.slug;
                }

                docClient.put(params, function(err, data) {
                    if (err) {
                        throw err;
                    }
                    resolve(params);
                });
            } catch (e) {
                reject(e);
            }
        })
    };

    this.getArtworkForDate = (dribbledate) => {
        return new Promise(function (resolve, reject) {
            try {
                var docClient = new AWS.DynamoDB.DocumentClient();

                var params = {
                    TableName: "Artworks",
                    Key: {
                        "dribbledate": dribbledate
                    }
                };
                
                docClient.get(params, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    resolve(data);
                });

            } catch (e) {
                reject(e);
            }
        });
    };
}

module.exports = new DbProcs();