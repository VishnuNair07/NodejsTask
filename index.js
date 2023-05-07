const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 5000 ;
const Product = require('./Models/product');
const Order = require('./Models/Order');
require('dotenv').config();

const db = process.env.MONGO_URI;
mongoose.set('strictQuery', false);

// MongoDB Connection
const connectToMongo = () => {
    mongoose
    .connect(db)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
}

connectToMongo();

app.use(express.json());


// Create new product
app.post('/create', (req, res) => {
    const { body } = req;
    const product = new Product(body);
    product.save()
      .then(savedProduct => {
        res.status(201).json(savedProduct);
      })
      .catch(error => {
        res.status(400).json({ message: error.message });
      });
  });

// Retrieve a list of all products
 app.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });

// Retrieve a single product by Id
app.get('/singleproduct/:id', async(req, res) => {
    const products = await Product.findById(req.params.id);
    res.json(products);
  });


// Update a product by Id
app.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;
    Product.findByIdAndUpdate(id, body, { new: true })
      .then(updatedProduct => {
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
      })
      .catch(error => {
        res.status(400).json({ message: error.message });
      });
  });


// Delete a product by Id
app.delete('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Create new order

app.post('/createorder', (req, res) => {
  const { body } = req;
  const order = new Order(body);
  order.save()
    .then(savedProduct => {
      res.status(201).json(savedProduct);
    })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
});


// Retrieve a list of all orders
app.get('/allorders', async(req, res) => {
  try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Retrieve a single order by Id
app.get('/singleorder/:id', async(req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});


  
app.listen(PORT , () => {
    console.log(`Listening to http://localhost:${PORT}`);
})


