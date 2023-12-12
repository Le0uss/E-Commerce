import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import SearchComponent from './SearchComponent';

const Navbar = ({ cartSize }) => {
    return (
        <>
        <StyledNavBar>
        <Link to="/" className='Homepage'> RoboProducts </Link>
        <SearchComponent />
        <NavBarButtons>
            <Link to="/about" className='navBarButtons'> About Us </Link>
            <Link to="/contactUs" className='navBarButtons'> Contact Us</Link>
            <Link to="/cart" className='navBarButtons'> Cart ({cartSize})</Link>
        </NavBarButtons>
        </StyledNavBar>
        </>
    );
    };



const StyledNavBar = styled.header`
margin: 0;
border-bottom: 3px solid #ccc;
background-color: #8cd9c4;
padding-left: 3vw;
padding-right: 3vw;
padding-top: 2vh;
padding-bottom: 1vh;
display: flex;
justify-content: space-between;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
.Homepage{
    font-size: 2.3vw;
    font-weight: bold;
    text-decoration: none;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    border-radius: 5px;
    padding: 1vw;
    margin-bottom: 2vh;
    
    &:hover{
        background-color: deepskyblue;
        color: floralwhite;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
}
`;

const NavBarButtons = styled.div`
display: flex;
align-items: center;
margin-top: 1vh;
padding-left: 1vw;
.navBarButtons{
    border: 1px ;
    border-radius: 5px;
    margin-right:1vw;
    margin-left: 1vw;
    padding:1vw;
    background-color: #008060;
    color: white;
    text-decoration: none;
    font-size: 1.5vw;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    &:hover{
        background-color: deepskyblue;
        color: floralwhite;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
}
`;
export default Navbar;
