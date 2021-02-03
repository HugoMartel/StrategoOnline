// Setup requires and https keys & certificates
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');

// Just for the readability of the console logs on the server side
const colors = require('colors');

const hsKey = fs.readFileSync('key.pem').toString();
const hsCert = fs.readFileSync('cert.pem').toString();

const server = https.createServer({key: hsKey, cert: hsCert}, app);
const io = require('socket.io')(server, {});

// App setup
app.set('trust proxy', 1);

// Router
app.use(express.static(__dirname + '/front/'));

app.get('/', (req, res) => {
    let fileSend = fs.readFileSync("front/html/login.html");
    fileSend += fs.readFileSync("front/html/index.html");
    fileSend += fs.readFileSync("front/html/footer.html");
    res.send(fileSend);
});

// Setup logs for the server
io.on('connection', (socket) => {
    console.log('> '.bold + socket.id.green + ' connected');

    socket.on('disconnect', () => {
        console.log('< '.bold + socket.id.red + ' disconnected');
    });
});



// Make the server use port 4200
let listener = server.listen(4200, () => {
    console.log('Server is up and running on port ' + listener.address().port);
});