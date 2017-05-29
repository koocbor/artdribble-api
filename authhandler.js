var auth = require('basic-auth');
var dotenv = require('dotenv').config();

/**
 * To test locally
 * lambda-local -l authhandler -h authorize -e eventauth.json -t 10
 */
exports.authorize = (event, context, callback) => {
    var token = event.authorizationToken;

    var user = auth.parse(token);

    if (!user || !user.name || !user.pass) {
        console.log('Authorize: user is not defined');
        callback('Unauthorized');
    }

    if (user.name === process.env.AUTH_ANDROID_CLIENT_ID &&
        user.pass === process.env.AUTH_ANDROID_CLIENT_SECRET) {
        callback(null, generatePolicy(user.name, 'Allow', event.methodArn));
    } else {
        callback(null, generatePolicy(user.name, 'Deny', event.methodArn));
    }

}

var generatePolicy = function(principalId, effect, resource) {

    var resourceList = [
        'arn:aws:execute-api:us-east-1:492805709346:*/*/GET/v1/artwork',
        'arn:aws:execute-api:us-east-1:492805709346:*/*/GET/v1/artwork/*'
    ]

    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];

        resourceList.forEach( (res) => {
            var statement = {};
            statement.Action = 'execute-api:Invoke';    // default action
            statement.Effect = effect;
            statement.Resource = res;
            policyDocument.Statement.push(statement);
        });

        authResponse.policyDocument = policyDocument;
    }
    
    return authResponse;
}