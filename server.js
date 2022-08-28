//app.js
const express = require('express');
const http = require('http');
const path = require('path');
let app = express();
app.use(express.static(path.join(__dirname, 'build')));
const port = process.env.PORT || '8080';
app.set('port', port);
const server = http.createServer(app);

app.get('/*', (req, res, next) => {
    // Return React App index.html
  });

server.listen(port, () => console.log(`Running on localhost:${port}`));