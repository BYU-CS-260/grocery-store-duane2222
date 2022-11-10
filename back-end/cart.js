const express = require('express');
const bodyParser = require('body-parser');
const crypto = require("node:crypto");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());
let items = [];
let cart = [];

app.post('/api/products', (req, res) => {
  let rnd = crypto.randomUUID();
  let item = {
    id: rnd,
    name: req.body.name,
    price: req.body.price
  };
  items.push(item);
  res.send(item);
});

app.get('/api/products', (req, res) => {
  res.send(items);
});


app.get('/api/products/:id', (req, res) => {
    let item = items.find((s) => s.id === req.params.id)
  res.send(item);
});

app.put('/api/products/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => {
    return item.id;
  });
  let index = itemsMap.indexOf(id);
  if (index === -1) {
    res.status(404)
      .send("Sorry, that item doesn't exist");
    return;
  }
  let item = items[index];
  item.name = req.body.name;
  item.price = req.body.price;
  res.send(item);
});

app.delete('/api/products/:id', (req, res) => {
  let item = items.find((s) => s.id === req.params.id)
  let removeIndex = items.indexOf(item);
  if (removeIndex === -1) {
    res.status(404)
      .send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});


//cart


app.get('/api/cart', (req, res) => {
  res.send(cart);
});

app.post('/api/cart/:id', (req, res) => {
  let id = req.params.id;
  const foundItem = cart.find(newitem => newitem.id == id);
  if(foundItem) {
    foundItem.quantity += 1;
    res.send(foundItem);
  } else {
    let newitem = {
      id: id,
      quantity: 1
    };
    cart.push(newitem);
    res.send(newitem);
  }
});

app.put('/api/cart/:id/:quantity', (req, res) => {
  let id = req.params.id;
  const foundItem = cart.find(newitem => newitem.id == id);
  if(foundItem) {
    foundItem.quantity = parseInt(req.params.quantity);
    res.send(foundItem);
    if (req.params.quantity == 0) {
      console.log("im deleting");
      cart = cart.filter(newitem => newitem.id != id);
    }
  } else {
    res.status(404)
      .send("Sorry, that item doesn't exist");
    return;
  }
});

app.delete('/api/cart/:id', (req, res) => {
  let deleteitem = cart.find((s) => s.id === req.params.id)
  let removeIndex = cart.indexOf(deleteitem);
  if (removeIndex === -1) {
    res.status(404)
      .send("Sorry, that item doesn't exist");
    return;
  }
  cart.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));