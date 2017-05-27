// Note: to run locally download local dynamodb and run the following cmd:
// java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -inMemory

var DbProcs = function() {

    var Promise = require('bluebird');
    var AWS = require("aws-sdk");
    var dotenv = require('dotenv').config();

    AWS.config.update({
        region: process.env.AWS_DYNOMODB_REGION || "us-west-2",
        endpoint: process.env.AWS_DYNOMODB_ENDPOINT || "http://localhost:8000"
    });

    this.createArtsyInfoForDate = (dribbledate, artsyInfo) => {
        return new Promise(function (resolve, reject) {
            try {
                var docClient = new AWS.DynamoDB.DocumentClient({convertEmptyValues: true});

                var params = {
                    TableName: "Artworks",
                    Item: {
                        "dribbledate": dribbledate,
                        "artsyArtworkSlug": artsyInfo.slug,
                        "artsyArtworkInfo": artsyInfo
                    }
                };

                docClient.put(params, function(err, data) {
                    if (err) {
                        throw err;
                    }
                    resolve(data);
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