const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3030;
const configure = require('./config/database');
const router = require('./config/router');

configure();

app.use(bodyParser.json());
app.use(cors());
app.use('/', router);
app.get('/', (req, res) => {
  res.json('Blog Be');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
