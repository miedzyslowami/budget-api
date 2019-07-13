const express = require('express');
const expressjwt = require('express-jwt');
const jwks = require('jwks-rsa');
const app = express();
const { Client } = require('pg');
const bodyParser = require('body-parser');

const router = require('./routes/public');

const cool = require('cool-ascii-faces');
const path = require('path');
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


app.use(router);
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
    user: 'dkokjeijzfquzw',
    host: 'ec2-174-129-29-101.compute-1.amazonaws.com',
    database: 'd8964drglas3td',
    password: '77602e2682f2e28fa06d6d26599e2b16aba9c74c6da743a86d24284e8304eeec',
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
