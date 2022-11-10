import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState([]);
  const [price, setPrice] = useState("");

  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  
  const fetchCart = async() => {
    try {      
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  
  const fetchName = async(item) => {
    try {      
      const response = await axios.get("/api/products/" + item.id);
      setName(response.data);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  
  
  const createProduct = async() => {
    try {
      await axios.post("/api/products", {name: name, price: price});
    } catch(error) {
      setError("error adding a product: " + error);
    }
  }
  const addCart = async(product) => {
    try {
      await axios.post("/api/cart/" + product.id);
    } catch(error) {
      setError("error adding to cart" + error);
    }
  }
  
   const subCart = async(item) => {
    try {
      await axios.put("/api/cart/" + item.id + "/" + (item.quantity - 1));
    } catch(error) {
      setError("error adding to cart" + error);
    }
  }
  
  const deleteCart = async(item) => {
    try {
      await axios.delete("/api/cart/" + item.id);
    } catch(error) {
      setError("error deleting from cart" + error);
    }
  }

  // fetch product data
  useEffect(() => {
    fetchProducts();
    fetchCart();
  },[]);

  const addProduct = async(e) => {
    e.preventDefault();
    await createProduct();
    fetchProducts();
    setName("");
    setPrice("");
  }

  const addToCart = async(product) => {
    await addCart(product);
    fetchCart();
  }
   
  const subToCart = async(item) => {
    await subCart(item);
    fetchCart();
  }
  
  const deleteFromCart = async(item) => {
    await deleteCart(item);
    fetchCart();
  }

  function pname(id) {
    let i = products.find((s) => s.id === id)
    return i.name;
   
  }
  

  // render results
  return (
    <div className="App">
      {error}
      <h1>Cart</h1>
      
      {cart.map(item => ( 
          <div className="price">
          
            <p>{pname(item.id)}, {item.quantity} <button onClick={e => subToCart(item)}>-</button> <button onClick={e => addToCart(item)}>+</button> <button onClick={e => deleteFromCart(item)}>Remove from cart</button></p>
          </div>

      ))}     
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id} className="product">
          <div className="price">
            <p>{product.name}, {product.price} <button onClick={e => addToCart(product)}>Add To Cart</button></p>
         
          </div>
        </div>
      ))} 
      <a href="https://github.com/BYU-CS-260/grocery-store-duane2222"> Github Repository</a>
    </div>
  );
}

export default App;