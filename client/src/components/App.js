import GlobalStyles from './GlobalStyles';
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Cart from './Cart'; 
import Navbar from './Navbar';
import ItemDetail from './ItemDetail';
import { MainContext } from './MainContext';
import AboutUs from './AboutUsContent/AboutUs';
import ContactUs from './ContactUs';
import Items from './Items';
import ItemsShopCompany from './ItemsShopCompany';
import Confirmation from './Confirmation';

const App = () => {

  //Renaud: app itself doesn't need too much context or state etc as each individual component will be checking server for their info.
  //this is done in case someone "multiplayer" buys all your watches before you lol
  const {
    actions: {  },
    state: {  cart },
     } = useContext(MainContext);

    

  return (
    <>
    <GlobalStyles/>
      <Router>
        <Navbar cartSize={cart.length} />  
        <Routes>
          {"temp text"}
          <Route path="/" element={<Home   />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contactus" element={<ContactUs />} /> 
          <Route path="/items/:category/:page" element={<Items/>} />
          <Route path="/itemsCompany/:company" element={<ItemsShopCompany/>} />
          <Route path="/itemsId/:_id" element={<ItemDetail />} /> 
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </Router>
      
    </>
  );
};

export default App;


