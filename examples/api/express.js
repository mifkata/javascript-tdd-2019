const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { fibonacci } = require('../lib/fibonacci');
const { dist } = require('config');

const app = express();
app.use(bodyParser.json({ extended: true }));
app.use(express.static(dist));

app.post('/fibonacci', (req, res) => {
  const { num } = req.body;
  const value = fibonacci(num);
  let response = { value: value.toString() };

  if(value === -1) {
    res.status(400);
    response = { message: 'invalid_position' };
  }

  return res.send(response);
});

app.get('*', (req, res) => {
  return res.sendFile(path.resolve(dist, 'index.html'));
});

if(process.env.NODE_ENV !== 'test') {
  app.listen(4000);
}

module.exports = {
  app,
};
