const express = require('express');
// const expressjwt = require('express-jwt');
// const jwks = require('jwks-rsa');
const app = express();
const bodyParser = require('body-parser');
const cool = require('cool-ascii-faces');
const path = require('path');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const { Pool, Client } = require('pg');

app
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({ extended: false }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    // .get('/', (req, res) => res.render('pages/index'))
    .get('/cool', (req, res) => res.send(cool()))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

app.get('/', function(req, res){
    res.cookie('name', 'express').send('cookie set'); //Sets name = express
    });



const client = new Client({
    user: 'dkokjeijzfquzw',
    host: 'ec2-174-129-29-101.compute-1.amazonaws.com',
    database: 'd8964drglas3td',
    password: '77602e2682f2e28fa06d6d26599e2b16aba9c74c6da743a86d24284e8304eeec',
    port: 5432,
    ssl: true
})

client.connect()

app.get('/connection', (req, res) => {
    client.query('SELECT * FROM budget', (error, response) => {
        console.log(error ? error.stack : 'connected to database');
        res.send(response.rows);
        client.end();
    })
});


app.get('/public', (req, res) => {
    res.status(200).send('Public access');
})


app.post('/add_transaction', (req, res) => {
    client.query(
        {
            text: 'INSERT INTO budget(type,value) VALUES($1,$2)',
            values: [req.body.create_type, req.body.create_value],
            rowMode: 'array'
        }, (error, response) => {
            res.end();
            client.end();
        })
    res.end();
})




// const authConfig = {
//     domain: "miedzyslowami.eu.auth0.com",
//     audience: "budget-api"
// }

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

// app.get('/private', jwtCheck, (req, res) => {
//     res.status(200).send('Your Access Token was successfully validated!');
// })



//TODO refactor to connection pool

// pool.connect((err, client, done) => {
//     if (err) throw err;

//     app.get('/connection', (req, res) => {
//         client.query('SELECT * FROM public.transactions', (error, response) => {
//             console.log(error ? error.stack : response.rows);
//             res.send(response.rows);
//             client.end();
//         })

//     })
//     // client.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
//     //   done()

//     //   if (err) {
//     //     console.log(err.stack)
//     //   } else {
//     //     console.log(res.rows[0])
//     //   }
//     // })

//   })




// app.get('/connection/transaction/:id', (req, res) => {

//     client.query('SELECT * FROM public.transactions', (error, response) => {
//         console.log(error ? error.stack : response.rows);
//         res.send(response.rows[req.params.id]);
//         client.end();
//     })
// })
