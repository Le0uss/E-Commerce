import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { MainContext } from './MainContext';
import { Link } from 'react-router-dom'; 

//start
const ItemThumbnail = (props) => {
    //important to know which item is passed here, this props is vital to thumbnail.
    //must be the full item object
    let _item = props.item;

    //getting cart info from context
    const {
        actions: {  addToCart, removeFromCart, },
        state: { cart },
            } = useContext(MainContext);
    
    //little fun state effect for different CSS when hovering
    const [bigHover,setBigHover] = useState(false);
    
    //local in-cart state for better cart management
    const [inCart,setInCart] = useState(0); 

    ///use effect to track number of this item in the cart when database changes
    useEffect(
    ()=>{
        let _count = 0;
        for (let _i =0; _i < cart.length; _i++)
        {
            if (cart[_i]._id === _item._id)
            {
                _item = cart[_i];
                setInCart(cart[_i].quantity); 
                _count = cart[_i].quantity;
                break;
            }
        }
        if (_count === 0){setInCart(0);} 
    }
    ,[cart])

    return (
        //changing state when hovering
        <ThumbDiv onMouseEnter={()=>{setBigHover(true)}} onMouseLeave={()=>{setBigHover(false)}  }>
            
            {/*checking if hovering to make the thumbnail bigger etc*/}
            {!bigHover && (
                <ThumbTitle style={{minHeight: "54px"}}>{_item.name.substr(0,25)+"..."}</ThumbTitle>
            )}
            {bigHover && (
                <BigThumbTitle>{_item.name}</BigThumbTitle>
            )}
            {/*important link to the ItemDetails route*/}
            <Link to={`/itemsId/${_item._id}`}><ThumbImg {...(bigHover ?{className: "bighover"}:{}) } src={_item.imageSrc}  /></Link>

            <ThumbTitle>
                
            {/*checking if enough items in stock*/}
            {_item.numInStock > 0 && (
                <>
                {/*when items are in stock but your cart is at the same amount*/}
                {inCart === _item.numInStock && (
                    <>{"Maximum "}{inCart > 0 && (
                        <>{` (${inCart})`}</> 
                    )}</>
                )}
                {/*when items are in stock and your cart is under, you can add*/}
                {inCart < _item.numInStock && (
                    <ThumbLink onClick={()=>{
                        //doing both addtoCart and set to cart for responsiveness, might be a way to do it better
                        addToCart({_id:_item._id,quantity:inCart+1});
                        setInCart(inCart+1);
                        }}>{"Add to cart"} 
                        {inCart > 0 && (
                        <>{` (${inCart})`}</> 
                        )}
                        </ThumbLink>
                    )}
                
                    
                </>
            )}    
            {/*out of stock message if item isn't in stock at all*/}
            {_item.numInStock === 0 && 
            (
                <>
                OUT OF STOCK
                </>
            )
            }  
            {/*if item in cart, add remove button w functionality*/}
            {inCart > 0 && (
            <ThumbLinkDelete onClick={()=>{
                removeFromCart(_item._id);
                }}><p>REMOVE</p></ThumbLinkDelete>
            )}
            </ThumbTitle>
        </ThumbDiv>
    )

}
//cool CSS starts here
const ThumbTitle = styled.p`
    flex:1;
    margin:5px;
    font-size: 16px;

`
const BigThumbTitle = styled.div` 
    flex:3;
    min-height: 60px;
    font-size: 16px;
    margin-bottom: 10px;
    word-wrap: break-word; 
    z-index: 6;
`
const ThumbLink = styled.a` 
    color:rgb(255, 120, 0);
    cursor:pointer;
    font-size: 16px;
    &:hover{
    text-decoration: underline;}
`
const ThumbLinkDelete = styled.a` 
    color:rgb(255, 0, 0);
    font-size: 16px;
    cursor:pointer;
    &:hover{text-decoration: underline;}
`
const ThumbDiv = styled.div` 
resize: none;
position: relative;
display: flex;
flex-direction:column;
text-align: center;
gap:5px; 
background-color: white;
padding:5px;
border-radius: 5px;
width:120px;
min-height: 210px; 
max-height:200px;
left:0px;
bottom:0px;
box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
transition: 100ms ease-in;
&:hover{
    background-color: rgba(255, 250, 240);
    font-size:16px;
    font-weight: 600;
    box-shadow: rgba(255, 120, 0, 0.07) 0px 1px 2px, rgba(255, 120, 0, 0.07) 0px 2px 4px, rgba(255, 120, 0, 0.07) 0px 4px 8px, rgba(255, 120, 0, 0.07) 0px 8px 16px, rgba(255, 120, 0, 0.07) 0px 16px 32px, rgba(255, 120, 0, 0.07) 0px 32px 64px;
    left:-25px;
    bottom:20px;
    width: 160px;
    min-height: 250px; 
    z-index: 5;
}
`

const ThumbImg = styled.img`
flex:2;
width:80px;
height:80px;
border-radius: 5px;
margin:5px;
&.bighover{
    width:100px;
    height:100px;
    margin:auto;
}

`


export default ItemThumbnail