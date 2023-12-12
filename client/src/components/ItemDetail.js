import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { MainContext } from './MainContext';

const ItemDetail = () => {
const { _id } = useParams();
const {
    state: { cart, items, companies },
    actions: { addToCart,requestCart },
} = useContext(MainContext);

const [item, setItem] = useState(null);
const [company, setCompany] = useState(null);
const [quantity, setQuantity] = useState(1);
const [inCart,setInCart] = useState(0); 

//Renaud: Fetching specific item info as well as cart info 
useEffect(()=>{ 
    requestCart();  
    fetch('/itemsId/'+String(_id),
            {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
              } 
            }
          )
          .then(res => res.json())
          .then(data => { 
            console.log("THE DATA",data)
            setCompany(data.company);
            setItem(data);}) 
          .catch((error)=>{
            console.log(error); 
          });
},[])

///Renaud: use effect to track number of this item in the cart
useEffect(
    ()=>{
        let _count = 0;
        for (let _i =0; _i < cart.length; _i++)
        { 
            if (cart[_i]._id === Number(_id))
            { 
                setItem(cart[_i]);
                setInCart(cart[_i].quantity); 
                _count = cart[_i].quantity;
                break;
            }
        }
        if (_count === 0){setInCart(0);} 
    }
    ,[cart]);

/* Renaud: commented this out as it seems to do what some of my functions did, Omed if this still still useful
   feel free to recycle any of it etc otherwise please delete in your next commit

useEffect(() => {
    const selectedItem = items.find((i) => i._id === itemId);
    setItem(selectedItem);

    if (selectedItem) {
    const selectedCompany = companies.find((c) => c._id === selectedItem.companyId);
    setCompany(selectedCompany);
    }
}, [itemId, items, companies]);
*/ 

return (
<>
{!item || !company ? (
    <LoadingText>Loading...</LoadingText>
) : (
    <ProductContainer>
    <ProductWrapper>
        <ProductImage src={item.imageSrc} alt="productImg" />
        <ProductDetailsWrapper>
        <ProductName>{item.name}</ProductName>
        <ProductPrice>{item.price}</ProductPrice>
            <AdditionalInfo>
            <DetailsHeader>Product Details</DetailsHeader>
            <DetailsList>
            Crafted by{' '}
            <StyledLink to={`/ItemsCompany/${company.name}`}>
                {company.name}
            </StyledLink>
            </DetailsList>
        </AdditionalInfo>
        {item.numInStock === 0 ? (
            <OutOfStockButton>OUT OF STOCK</OutOfStockButton>
        ) : (
            <AddToCartSection>
            <QuantitySelector>
                <QuantityButton
                onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                disabled={quantity === 1}
                >
                -
                </QuantityButton>
                <QuantityValue>{quantity}</QuantityValue>
                <QuantityButton
                onClick={() =>
                    setQuantity(Math.min(quantity + 1, item.numInStock))
                }
                disabled={quantity === item.numInStock}
                >
                +
                </QuantityButton>
            </QuantitySelector>
            {quantity + inCart >= item.numInStock && (
                <StockMessage>Maximum stock reached!</StockMessage>
            )}
            {/* Renaud: fixed add to cart functionality here*/}
            <AddToCartButton onClick={()=>{
                addToCart({_id:item._id,quantity:inCart+quantity});
            }}>
                ADD TO CART
            </AddToCartButton>
             
            </AddToCartSection>
        )}
        {/* Renaud: also added in cart thing, Omed please add remove, feel free to inspire from ItemThumbnail and MainContext*/}
        {/* TODO Either Omed or Brian can also make beautiful, delete my comment once css done*/}
        {`${inCart} in cart`}
        </ProductDetailsWrapper>
    </ProductWrapper>
    </ProductContainer>
)}
</>
);
};


// Styled Components
const LoadingText = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
font-size: 24px;
color: #007bff;
`;

const ProductContainer = styled.div`
display: flex;
justify-content: center;
padding: 20px;
`;

const ProductWrapper = styled.div`
display: flex;
max-width: 800px;
margin: 0 auto;
background-color: #ffffff;
border-radius: 8px;
padding:20px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
width: 100%;
border-radius: 8px;
`;

const ProductDetailsWrapper = styled.div`
padding: 20px;
`;

const ProductCategory = styled.div`
font-size: 16px;
color: #555555;
`;

const ProductName = styled.div`
font-size: 24px;
font-weight: bold;
margin-top: 10px;
margin-bottom: 10px;
`;

const ProductPrice = styled.div`
font-size: 18px;
margin-bottom: 10px;
`;

const AdditionalInfo = styled.div`
margin-top: 20px;
`;

const DetailsHeader = styled.div`
font-weight: bold;
margin-bottom: 10px;
`;

const DetailsList = styled.div`
font-size: 14px;
color: #777777;
`;

const StyledLink = styled(Link)`
color: #007bff;
text-decoration: none;
&:hover {
    text-decoration: underline;
}
`;

const Location = styled.div`
margin-top: 10px;
font-size: 14px;
color: #777777;
`;

const DisabledButton = styled.button`
background-color: #dddddd;
color: #999999;
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: not-allowed;
font-size: 16px;
`;

const Flex = styled.div`
display: flex;
align-items: center;
margin-top: 20px;
`;

const Quantity = styled.div`
margin-top: 20px;
`;

const QuantitySelector = styled.div`
display: flex;
align-items: center;
`;

const QuantityButton = styled.button`
font-size: 18px;
margin: 0 5px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
padding: 5px 10px;
&:hover {
    background-color: #0056b3;
}
`;

const QuantityValue = styled.div`
font-size: 18px;
margin: 0 10px;
`;

const MessageQuant = styled.div`
color: red;
font-size: 14px;
`;

const AddToCartButton = styled.button`
background-color: #007bff;
color: white;
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 16px;
&:hover {
    background-color: #0056b3;
}
`;

const StockMessage = styled.div`
color: red;
font-size: 14px;
`;

const OutOfStockButton = styled.button`
background-color: #dddddd;
color: #999999;
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: not-allowed;
font-size: 16px;
`;

const AddToCartSection = styled.div`
display: flex;
align-items: center;
`;

export {
LoadingText,
ProductContainer,
ProductWrapper,
ProductImage,
ProductDetailsWrapper,
ProductCategory,
ProductName,
ProductPrice,
AdditionalInfo,
DetailsHeader,
DetailsList,
StyledLink,
Location,
DisabledButton,
Flex,
Quantity,
QuantitySelector,
QuantityButton,
QuantityValue,
MessageQuant,
AddToCartButton,
StockMessage,
OutOfStockButton,
AddToCartSection,
};

export default ItemDetail;