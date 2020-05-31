const express = require('express');
const app = express();

const PORT = 9000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/nodejs/checkFull', (req, res) => {
    
});

app.listen(PORT, function () {
    console.log('Listening on port ', PORT);
});