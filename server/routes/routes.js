const express = require('express');
const router = express.Router();
const itemsInfo = require('./handlers/itemsInfo');
const postItemToCart = require('./handlers/postItemToCart');
const deleteItemFromCart = require('./handlers/deleteItemFromCart');
const purchaseItem = require('./handlers/purchaseItem');
const cartItems = require('./handlers/cartItems'); 
const itemsByPage = require("./handlers/itemsByPage");
const companyInfo = require("./handlers/companyInfo")
const getItemById = require('./handlers/itemById')
const categoryPage = require('./handlers/categoryPage')
const categoryItem = require('./handlers/categoryItem')
const itemsByCompanyName = require('./handlers/itemsByCompany')
const getCategories = require('./handlers/categories');

const itemSearch = require('./handlers/itemSearch')
const deleteAllItemsFromCart = require('./handlers/deleteAllItemsFromCart');


router.use(express.json());

// Route to get items with company information from 'Data_Items' and 'Data_Companies' collections
router.get('/items', itemsInfo);

//Route to search items
router.get('/itemSearch', itemSearch)

// Route to get 20 items by page with company information from 'Data_Items' and 'Data_Companies' collections 
router.get('/items/:page', itemsByPage);

// Route to get 20 items by page with company information from 'Data_Items' and 'Data_Companies' collections 
router.get('/company/:companyName', itemsByCompanyName);

// Route to get 20 items by page by category from 'Data_Items' and 'Data_Companies' collections 
router.get('/items/:category/:page', categoryPage);

// Route for getting an item and its associated company information by ID
router.get('/itemsId/:_id', getItemById);

// Route for getting an item and its associated company information by Category WITH NO S BECAUSE IT WILL CONFUSE ITSELF WITH THE OTHER ROUTE
router.get('/category/:category', categoryItem);

// Route for getting the category
router.get('/categories', getCategories);

// New GET route to retrieve items in the cart
router.get('/cart', cartItems); 

// New GET route to retrieve companies info
router.get('/companies', companyInfo)

// New POST route to add an item to the cart
router.post('/addToCart', postItemToCart);

// New DELETE route to remove an item from the cart
router.delete('/removeFromCart', deleteItemFromCart);

// New POST route for purchasing an item
router.post('/purchaseItem', purchaseItem);

//New DELETE route to remove all items from the cart
router.delete('/removeAllFromCart', deleteAllItemsFromCart);

module.exports = router;
