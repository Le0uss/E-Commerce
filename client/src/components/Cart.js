import {useContext, React, useEffect} from 'react';
import { MainContext } from './MainContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const Cart = () => {
    const {
        actions: { requestCart, addToCart, removeFromCart, clearCart },
        state: { cart },
    } = useContext(MainContext);

const handleClearCart = () => {
    clearCart();
};
useEffect(
    ()=>{requestCart();}
    ,[])
// Calculate total price and quantity for each item in the cart
const getTotalPrice = () => {
    let totalPrice = 0;

    cart.forEach((item) => {
        // Remove the "$" sign from the price before converting to a number
        const itemPrice = parseFloat(item.price.replace('$', ''));
        totalPrice += itemPrice * item.quantity;
    });

    return totalPrice.toFixed(2);
};

const handleConfirm = async (setConfirmed) => {
    let _problem = false;
    console.log("cart", cart);

    try {
        for (const element of cart) {
            const response = await fetch('/itemsId/' + element._id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const res = await response.json();

            if (res.numInStock < element.quantity) {
                _problem = true;
                element.quantity = res.numInStock;
            }
        }

        if (_problem) {
            alert("Cart has an issue, numbers adjusted");
            return null;
        }

        for (const element of cart) {
            await fetch('/purchaseItem/', {
                method: "POST",
                body: JSON.stringify({
                    itemId: element._id,
                    quantity: element.quantity,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        setConfirmed(true);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Calculate total quantity for each unique item in the cart based on item name
const getTotalQuantityPerItem = () => {
    const totalQuantityPerItem = {};

    cart.forEach((item) => {
        if (totalQuantityPerItem[item.name]) {
            totalQuantityPerItem[item.name] += item.quantity;
        } else {
            totalQuantityPerItem[item.name] = item.quantity;
        }
    });

    return totalQuantityPerItem;
};
    
return (
    <Wrapper>
    <h1>Shopping Cart</h1>
    <ItemsInCart>
    <ul>
                    {cart.map((cartItem, index) => (
                        <li key={cartItem.name}>
                            {cartItem.name} - {cartItem.price} - Quantity: {cartItem.quantity}
                            <RemoveCartButton onClick={() => removeFromCart(cartItem._id)}>
                                Remove from Cart
                            </RemoveCartButton>
                        </li>
                    ))}
                </ul>
    </ItemsInCart>
    <TotalPrice>
    <p>Order Total: ${getTotalPrice()}</p>
            </TotalPrice>
    <EndOfPageButtons>
    <Link to="/confirmation">
    <button className='confirmationButton' onClick={handleConfirm}>Proceed to Confirmation</button>
    </Link>
    <button className='ClearCartButton' onClick={handleClearCart}>Empty Cart</button>
    </EndOfPageButtons>
    </Wrapper>
);
};


const Wrapper = styled.div`
border: 1px solid #ccc;
margin-top: 40px;
margin-left: 150px;
margin-right: 150px;
padding: 40px;
background-color: #8cd9c4;
border-radius: 10px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
max-width: 130vw;

h1{
margin-bottom: 20px;
color: white;
font-size: 2.5em;
text-decoration: underline;
}

.confirmationButton{
margin-top: 20px;
background-color: #008060;
color: white;
padding: 10px;
border-radius: 5px;
border-style: none;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
cursor: pointer;
transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
font-weight: bold;
}
.confirmationButton:hover{
    background-color: #5bcdda;
    transform: scale(1.2);
}


.ClearCartButton{
    margin-top: 15px;
    font-weight: bold;
    background-color: #008060;
    border-style: none;
    border-radius: 5px;
    color: white;
    padding: 10px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.ClearCartButton:hover{
    background-color: #d82c0d;
}

`
const EndOfPageButtons = styled.div`
display: flex;
justify-content: space-between;
`


const ItemsInCart = styled.div`


li{
    list-style: none;
    padding: 5px;
    font-size: 1.2em;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    border-bottom: 1px solid #f0f0f0;
}


`
const RemoveCartButton = styled.button`
margin-left: 30px;
margin-bottom: 15px;
margin-top: 5px;
background-color: #008060 ;
color: white;
padding: 10px;
border-radius: 5px;
cursor: pointer;
border-style: none;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
font-weight: bold;


    &:hover{
        background-color: #d82c0d;
    }
`
const TotalPrice = styled.div`
    margin-top: 10px;
    font-weight: bold;
    color: #d82c0d;
    border: 2px solid transparent; 
    border-image: linear-gradient(45deg, #008060, #d82c0d); 
    border-image-slice: 1; 
    padding: 10px; 
    display: inline-block;
`;

export default Cart;
