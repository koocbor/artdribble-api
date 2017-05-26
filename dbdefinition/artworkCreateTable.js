var AWS = require("aws-sdk");
var dotenv = require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_DYNOMODB_REGION || "us-west-2",
  endpoint: process.env.AWS_DYNOMODB_ENDPOINT || "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Artworks",
    KeySchema: [       
        { AttributeName: "dribbledate", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "dribbledate", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
