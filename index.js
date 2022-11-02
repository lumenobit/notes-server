const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const server = express();
const noteApi = require('./src/note.controller');

const port = 4000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/', express.static(path.resolve('public')));

server.use('/api/note', noteApi);

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
})