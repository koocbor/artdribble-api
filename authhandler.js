var auth = require('basic-auth');
var dotenv = require('dotenv').config();

/**
 * To test locally
 * lambda-local -l authhandler -h authorize -e eventauth.json -t 10
 */
exports.authorize = (event, context, callback) => {
    var token = event.authorizationToken;

    console.log(token);

    var user = auth.parse(token);

    console.log('user: ' + JSON.stringify(user));

    if (!user || !user.name || !user.pass) {
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
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    return authResponse;
}