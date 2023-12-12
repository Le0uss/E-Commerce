import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { MainContext } from "./MainContext";

import ItemThumbnail from "./ItemThumbnail"; 

const ItemsShopCompany = () => {
    
    const {company} = useParams();

    const {
        actions: { requestItemsByCompany ,emptyPage },
        state: {  itemsCurrentPage },
         } = useContext(MainContext);

    // State to store the list of companies
    const [companies, setCompanies] = useState([]); 
    const [categories, setCategories] = useState([]);
    const [companyObj, setCompanyObj] = useState({name:"",country:"",url:""});
    const [windowWidth,setWindowWidth] = useState(window.innerWidth);

    //initial company import
    useEffect(()=>{
        emptyPage(); 
        requestItemsByCompany({company});
    },[company])

     ///update Width and its use effect to keep track of window width for the items display grid to be reactive
     const updateWidth = () =>{
        setWindowWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // Fetch companies data when the component mounts
    useEffect(() => { 

        fetch("/companies")
        .then(response => response.json())
        .then(data => {
            setCompanies(data)
            data.forEach(element => {
                if (element.name === company)
                {
                    setCompanyObj(element);
                } 
            })
        })
        fetch("/categories")
        .then(response => response.json())
        .then(data => setCategories(data))
    }, [])

    const ThumbGrid = (itemsPerRow) =>{
        let _index = 0;
        const _maxIndex = itemsCurrentPage.length;
        const _maxRows = _maxIndex/itemsPerRow; 
        const elements = [];

        for (let _i =0; _i< _maxRows;_i++)
        {
            const _gridItems = [];
            for (let _j=0; _j < itemsPerRow;_j++)
            {
                if (_index >= _maxIndex)
                {
                    _i= 9999;
                    _j= 9999;
                    break;  
                }
                else
                { 
                    const _item = itemsCurrentPage[_index];
                    const _gridItem = ( <ItemThumbnail key={_item._id} item={_item}/>)
                    _gridItems.push(_gridItem);
                    _index += 1;
                }
            }
            const _gridRow = (<ItemsList key={"keyGrid"+String(_i)}>{_gridItems}</ItemsList>);
            console.log("gridrow",_gridRow);
            elements.push(_gridRow);
        }
        return elements;
    }

// Return the JSX for the AllProducts component
    return(
        
        <ItemsMainDiv>
            
        <Categories>
            <Tab>
                <SmallTab>Search By Company!</SmallTab>
                <LargeTab> 
                    <ul>
                    {companies.map(company => (
                        <li key={company._id}>
                            <Link to={`/itemsCompany/${company.name}`}>{company.name}</Link>
                        </li>
                    ))}
                </ul>
                </LargeTab>
            </Tab> 

                {categories.map(category => (
                    <Link className="categoryNames"key={category} to={`/items/${category}/${1}`}>
                        {category}
                    </Link>
                ))}
            </Categories>

        <div style={{flex:"1"}}></div>
        <div style={{flex:"40",margin:"20px 10px 10px 10px"}}>

             <CategoryTitle>{ company} </CategoryTitle> <CategorySubTitle>{companyObj.country} </CategorySubTitle>
             {companyObj.url != "" && (<CategoryLink href={companyObj.url}>manufacturer website</CategoryLink>)}
                    {/* important thumbgrid reactive function */}
                    {ThumbGrid(Math.min(10,Math.floor((windowWidth-300)/160)))}
                </div>
        </ItemsMainDiv> 
    )
}

// Styled components
const CoolLink = styled.span`
    color:rgb(255, 120, 0);
    cursor:pointer;
    font-size: 16px;
    &:hover{
    text-decoration: underline;}
    margin-right:5px;
    &.hide{
        cursor: none;
        visibility: hidden;
    }
`

const ItemsMainDiv = styled.div`
display: flex;
max-height: 100vh;
` 
const CategoryTitle = styled.span`
font-size: 45px;
margin-right:20px;
`
const CategorySubTitle = styled.span`
font-size: 25px; 
margin-right:20px;
`
const CategoryLink = styled.a`
color:#008060;
font-size: 20px; 
margin-right:20px;
margin-left:20px;
&:hover{
    text-decoration: underline;
}
`

const ItemsList = styled.div`
position: relative; 
left:-30px;
min-width:fit-content;
height:230px; 
display: grid;
grid-template-columns: repeat(auto-fill, minmax(130px, 100px));
gap:10px;
margin-top: 30px; 
`

const Tab = styled.div`
position: fixed;
bottom: 0;
left: 0;
display: flex;
flex-direction: column;
align-items: flex-start;
`;

const SmallTab = styled.div`
background-color: #008060;
color: #fff;
padding: 10px;
cursor: pointer;
transition: width 0.3s ease-in-out;



    &:hover{
        width: 0;
        display: none;
    }
`
const Categories = styled.div` 
margin:90px 50px 50px 50px;
display: grid;
grid-template-columns: repeat(2, 2fr);
gap:10px; 
height: 400px;
min-width: 350px;

.categoryNames{   
display: -webkit-flex;
display: flex;
align-items: center;
justify-content: center;
text-align:center;  
text-decoration: none;
color: black;
background-color: #8cd9c4;
border-radius: 8px;
font-size: 1.5em;
width:150px;
max-height: 50px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
padding:10px;

    &:hover{
        background-color: rgba(255, 250, 240);
        font-weight: bold;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
} 
`


const LargeTab = styled.div`
display: none;
background-color: #008060;
color: #fff;
padding: 20px;
border-radius: 0 5px 5px 0;
margin-top: 10px;
width: 150px; 
height: 300px;
overflow-y: auto;
border-right: 1px solid #ccc;

h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li{
        margin-bottom: 8px;
    }

    a{
        text-decoration: none;
        color: white;
        font-weight: bold;
        font-size: 1rem;

        &:hover{
            color: #333;
        }
    }
}

${Tab}:hover & {
    display: block;
    }
`;


export default ItemsShopCompany