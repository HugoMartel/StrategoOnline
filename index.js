let app = require('express')();
let fs = require('fs');

let hsKey = fs.readFileSync('key.pem').toString();
let hsCert = fs.readFileSync('cert.pem').toString();

let https = require('https').createServer({key: hsKey, cert: hsCert}, app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/front/html/index.html');
});

https.listen(4200, function() {
    console.log('Server is up and running!');
});