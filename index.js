const express = require('express');
const expressjwt = require('express-jwt');
const jwks = require('jwks-rsa');
const app = express();
const { Client } = require('pg');
const bodyParser = require('body-parser');

const router = require('./routes/public');

app.use(router);
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));

// const authConfig = {
//     domain: "miedzyslowami.eu.auth0.com",
//     audience: "budget-api"
// };

// const jwtCheck = expressjwt({
//     secret: jwks.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
//     }),
//     audience: `${authConfig.audience}`,
//     issuer: `https://${authConfig.domain}/`,
//     algorithms: ['RS256']
// });


// app.get('/public', (req, res) => {
//     res.status(200).send('Public access');
// });

// app.get('/private', jwtCheck, (req, res) => {
//     res.status(200).send('Your Access Token was successfully validated!');
// })



const client = new Client({
    user: 'gonia',
    host: 'localhost',
    database: 'budget',
    password: 'Gosiaczek84',
    port: 5432,
});

//TODO refactor to connection pool
client.connect();

app.get('/connection', (req, res) => {
    client.query('SELECT * FROM public.transactions', (error, response) => {
        console.log(error ? error.stack : response.rows);
        res.send(response.rows);
        client.end();
    })

})

app.post('/add_transaction', (req, res) => {
    console.log('Adding new row to database:', req.body.create_type, req.body.create_value);
    client.query(
        {
            text: "INSERT INTO public.transactions(type,value) VALUES($1,$2)",
            values: [req.body.create_type,req.body.create_value],
            rowMode: 'array'
        }, (error, response) => {
        console.log(error ? error.stack : response.rows);
        res.end();
        client.end()
    });
    res.end();
})

app.get('/connection/transaction/:id', (req, res) => {
    
    client.query('SELECT * FROM public.transactions', (error, response) => {
        console.log(error ? error.stack : response.rows);
        res.send(response.rows[req.params.id]);
        client.end();
    })
})

app.listen(5555, () => console.log('API started on port 5555'));
