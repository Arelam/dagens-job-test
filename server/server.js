const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const products = require('./db');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

http.createServer(app).listen(3001, () => {
  console.log('Listen on 0.0.0.0:3001');
});

app.get('/', (_, res) => {
  res.send({ status: 200 });
});

app.post('/product', function (req, res) {
  console.log(req.body);
  products.push(req.body);
  res.send(req.body);
})

app.get('/products/:category/price-:priceMax-:priceMin/:page?', function (req, res) {
  const pageSize = 24;
  const pageNum = req.params.page ?? 0;

  const category = req.params.category;
  const priceMax = req.params.priceMax;
  const priceMin = req.params.priceMin ?? 0;

  const produce = products.filter(p =>
    p.category == category &&
    p.price < priceMax &&
    p.price > priceMin
  );

  console.log(priceMax);

  res.send(produce);
})

process.on('SIGINT', function () {
  process.exit();
});
