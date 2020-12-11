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
  const pStart = pageSize*pageNum;
  const pEnd = pStart+pageSize;

  const category = req.params.category;
  const priceMax = req.params.priceMax;
  const priceMin = req.params.priceMin ?? 0;

  const produce = products.filter(p =>
    p.category == category &&
    p.price < priceMax &&
    p.price > priceMin
  ).slice(pStart, pEnd);

  console.log(priceMax);

  res.send(produce);
});

app.get('/similarProduct/:id', function (req, res) {
  const numNearest = 1;
  const id = req.params.id;
  const searchedProduct = products.filter(p => p.id === id)[0];
  const sortProducts = products.filter(p => p.category == searchedProduct.category && p.id !== searchedProduct.id).sort((a, b) => a.price- b.price);
  
  const findClosest = goal => (a,b) => Math.abs(a.price - goal) < Math.abs(b.price - goal) ? a : b;
  const closestProduct = sortProducts.reduce(findClosest(searchedProduct.price));

  res.send(closestProduct);
});

app.get('/similarProducts/:id', function (req, res) {
  const numNearest = 5;
  const id = req.params.id;
  const searchedProduct = products.filter(p => p.id === id)[0];
  const sortProducts = products.filter(p => p.category == searchedProduct.category && p.id !== searchedProduct.id).sort((a, b) => a.price- b.price);
  
  const searchMax = (numNearest < sortProducts.length) ? numNearest : sortProducts.length;
  const temp = [];

  const closest = function(price, array) {
    let current = array[0];
    current['arr'] = 0;
    let diff = Math.abs(price - current.price);
    let index = array.length;
    while(index--) {
      const nDiff = Math.abs(price - array[index].price);
      if(nDiff < diff) {
        diff = nDiff;
        current = array[index];
        current['arr'] = index;
      }
    }
    return current;
  };

  const addCloseProducts = function(array, number) {
    let out = [];
    let arr = array;
    while (out.length < number) {
      let item = closest(searchedProduct.price, arr);
      arr.splice(item['arr'], 1);
      delete item['arr'];
      out.push(item);
    }
    return out;
  }

  const nClose = addCloseProducts(sortProducts, searchMax);
  res.send(nClose);
});

process.on('SIGINT', function () {
  process.exit();
});
