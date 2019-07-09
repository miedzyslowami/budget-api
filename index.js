const express = require('express');
const expressjwt = require('express-jwt');
const jwks = require('jwks-rsa');
const app = express();


const authConfig = {
    domain: "miedzyslowami.eu.auth0.com",
    audience: "budget-api"
  };

const jwtCheck = expressjwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: `${authConfig.audience}`,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256']
});


app.get('/public', (req, res) => {
    res.status(200).send('Public access');
});

app.get('/private', jwtCheck, (req, res) => {
    res.status(200).send('Your Access Token was successfully validated!');
})

app.get('*', (req, res) => {
    res.sendStatus(404);
});

app.listen(5555, () => console.log('API started on port 5555'));
