
import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce'
import { Navbar, Products, Cart, Checkout } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';



const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({})
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    const fetchProducts = async () => {
        await axios.get('http://localhost:3000/productos').then(res=>{
            
            setProducts(res.data)
            console.log(res.data)
            
        })
    }
    
    Array(3) [ {…}, {…}, {…} ]
​
0: Object { id: 1, nombre: "remera", precio: 18000, … }
​
1: Object { id: 5, nombre: "pantalon", precio: 8500, … }
​
2: Object { id: 6, nombre: "zapatillas", precio: 12000, … }
​
length: 3

    const fetchCart = async () => {

        setCart(await await commerce.cart.retrieve());

    }

    const handleAddToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity);

        setCart(cart);
    };

    const handleUpdateCarQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity })
        setCart(cart)
    }

    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);

        setCart(cart)
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart(cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }


    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)
            setOrder(incomingOrder)
            refreshCart();
        } catch (error) {
            setErrorMessage(error.data.error.message)
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, [])



    return (

        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />


                <Switch>

                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/cart">
                        <Cart cart={cart}
                            handleUpdateCarQty={handleUpdateCarQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart}

                        />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout
                            cart={cart}
                            order={order}
                            onCaptureCheckout={handleCaptureCheckout}
                            error={errorMessage}

                        />
                    </Route>


                </Switch>

            </div>

        </Router>
    )


}

export default App;
