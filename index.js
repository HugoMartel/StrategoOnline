// Setup requires and https keys & certificates
let app = require('express')();
let fs = require('fs');

let hsKey = fs.readFileSync('key.pem').toString();
let hsCert = fs.readFileSync('cert.pem').toString();

let https = require('https').createServer({key: hsKey, cert: hsCert}, app);

// Router
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/front/html/index.html');
});

// Make the server use port 4200
let listener = https.listen(4200, function() {
    console.log('Server is up and running on port ' + listener.address().port);
});