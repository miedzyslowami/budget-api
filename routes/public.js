const express = require('express');
const router = express.Router();

router.get('/public', (req, res) => {
    res.send('Welcome to public route');
    res.end();
});

module.exports = router;
