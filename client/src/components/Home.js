import React, { useState, useEffect, useContext } from 'react';
import { MainContext } from './MainContext';
import styled from 'styled-components';
import ItemThumbnail from './ItemThumbnail';
import { Link } from 'react-router-dom';

const Home = () => {


    const {
        actions: { requestItemPage, requestCart, emptyPage },
        state: { itemsCurrentPage, cart },
        } = useContext(MainContext);

        const [loadPage,setLoadPage] = useState(false);

        const [recommendedArray, setRecommended] = useState([]);
        const [categories, setCategories] = useState([]);

        ///Home needs item page for recommended as well as their cart quantity, 
        useEffect(() => { 
            //empty recommended to reload new ones
            setRecommended([]);
            setLoadPage(true);
            // Fetch categories
            fetch("/categories")
            .then(response => response.json())
            .then(data => setCategories(data))
            
            //
            requestItemPage(Math.floor(Math.random()*10)+1);
            requestCart(); ///we do this here bc we don't want each individual thumbnail to make a full cart request
                            //it's necessary on any page that will contain thumbnails
        }, []);

        ////Setting the recommended according to random items in the page received
        ////20 is the hardcoded amount per page
        useEffect(()=>{ 

            if (itemsCurrentPage.length > 0 && loadPage)
            {  
                const _randomTempArray = [];
                let _rand = Math.floor(Math.random()*itemsCurrentPage.length)
                for (let _i =0; _i < Math.min(itemsCurrentPage.length,5); _i++)
                {    
                     if (_rand+_i >= itemsCurrentPage.length)
                     {
                        _rand = -_i;
                     } 
                    _randomTempArray.push(itemsCurrentPage[_rand+_i]);
                } 
                setRecommended(_randomTempArray); 
            }

        }
            ,[itemsCurrentPage])



    return (
        <>
        <Wrapper>
            <LeftGrid>
            <HomePageImage src='pexels-ovan-62689.jpg' alt="Home Page Image"/>
            </LeftGrid>
            <RightGrid>
            <h1>OUR CATEGORIES</h1> 
            <Categories>
                {categories.map(category => (
                    <Link className="categoryNames"key={category} to={`/items/${category}/${1}`}>
                        {category}
                    </Link>
                ))}
            </Categories>
            {/*
            Renaud: commented this out, waiting on Ossama's categories endpoint

            {items != [] &&(
                
                items.map((item)=>{
                    const _itemName = item.name;
                    return(
                        <div key ={item._id}>
                            <img src={item.imageSrc} />
                            <p>{_itemName}</p>
                        </div>
                    )
                })
                )
            }*/}

            {/* once the current page is received, display recommended which is just a bunch of items from 1st page */}
            {itemsCurrentPage != [] && (
                <>
                    <h1>RECOMMENDED</h1>
                    <RecommendedSection>
                    {recommendedArray.map((item)=>{

                        return (
                            <ItemThumbnail key={item._id} item={item} />
                        );
                    })}
                    </RecommendedSection> 
                    
                </>
                )}
            </RightGrid>
        </Wrapper>
        </>
    )
/*

Renaud: Commented this out but if it can be recycled feel free. you should leave most fetches to me though.

const [items, setItems] = useState([]);

useEffect(() => {
    fetch('/api/Data_Items')
    .then((response) => response.json())
    .then((data) => setItems(data.items))
    .catch((error) => console.error('Error fetching items:', error));
}, []);

return (
    <div>
    <h1>Available Items</h1>
    <ul>
        {items.map((item) => (
        <li key={item.id}>
            {item.name} - {item.price}
            <button onClick={() => addToCart(item)}>Add to Cart</button>
        </li>
        ))}
    </ul>
    </div>
);
*/
};



const Categories = styled.div`
display: grid;
grid-template-columns: repeat(2, 2fr);
gap:10px;
margin-top: 10px;
margin-bottom: 20px;

.categoryNames{ 
text-decoration: none;
color: black;
background-color: #8cd9c4;
border-radius: 8px;
font-size: 1.5em;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
padding: 5px;

    &:hover{
        background-color: rgba(255, 250, 240);
        font-weight: bold;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
} 
`


//TODO Brian make this not ugly pls
const RecommendedSection = styled.div`
position: relative;
/* left:-120px; */
width:700px;
height:230px; 
display: grid;
grid-template-columns: repeat(auto-fill, minmax(130px, 100px));
gap:10px;
margin-top: 30px; 
`

const Wrapper = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap:20px;
margin-top: 30px;
`
const LeftGrid = styled.div`
grid-area: 1 / 1 / 2 / 2;
margin-left: 20px;
`
const RightGrid = styled.div`
grid-area: 1 / 2 / 2 / 3;
text-align: center;
justify-self: center;
margin-right: 20px;
h1{
    font-weight: normal;
    border-bottom: 2px solid #ccc;
    width: 100%;
}
`
const HomePageImage = styled.img`
    width: 75%;
    height: auto;
    border-radius: 30px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`
export default Home;


