const PORT = 3000;

// Node dependencies
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const { runInNewContext } = require('vm');
const { send } = require('process');

// Express http server
{
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
    app.use(express.json());
    app.set('views', path.join(__dirname, 'views'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    // Views
    app.get('/', (req, res) => {
            console.log(`http request received: type: GET, path: '/', from: ${req.socket.remoteAddress}`);
            res.render('pages/index.html');
    });
    app.get('/resume', (req, res) => {
        console.log(`http request received: type: GET, path: '/resume', from: ${req.socket.remoteAddress}`);
        var tempFile = path.join(__dirname, 'public', 'resume.pdf');
        fs.readFile(tempFile, (err,data) => {
            res.contentType("application/pdf");
            res.send(data);
        });
    });
    
    // Binds server to the port and stars listening.
    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}