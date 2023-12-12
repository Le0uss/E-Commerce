import React, { useState, useEffect, useRef } from 'react'; // Importing React, useState and useEffect hooks from 'react'
import styled from 'styled-components'; // Importing styled-components for styling
import { Link } from 'react-router-dom';

// Styled Components
const StyledSearchInput = styled.input` // Creating a styled input component
  padding: 10px; // Padding inside the input
  border: 1px solid #ccc; // Border styling
  padding: 1vw;
  font-size: 1.5vw;
  width: 30vw;
  height: 3vh;
  max-width: 400vw;
  margin-top: 2vh;
    &:focus{
      outline: none;
      border-color: #2e72d2;
      box-shadow: 0 0 8px rgba(30, 144, 255, 0.8);
    }
    &::placeholder {
      color: #aaa;
    }
`;

const StyledResultsContainer = styled.div` // Creating a styled div for results container
  position: absolute; // Absolute positioning
  width: 32vw; // Full width
  max-height: 300px; // Maximum height
  overflow-y: auto; // Scrollable vertically
  border: 1px solid #ccc; // Border styling
  border-top: none; // No top border
  z-index: 1000; // Stack order
  background: white; // Background color
  border-radius: 0 0 4px 4px; // Rounded corners at the bottom
`;

const StyledResultItem = styled.div` // Creating a styled div for each result item
  padding: 10px; // Padding inside each item
  border-bottom: 1px solid #eee; // Bottom border for each item

  &:hover {
    background-color: #f0f0f0; // Background color on hover
  }
`;

// Debounce function
const debounce = (func, delay) => { // Declaring a debounce function
  let debounceTimer;
  return function() { // Returns a function
    const context = this; // Context of the function
    const args = arguments; // Arguments passed to the function
    clearTimeout(debounceTimer); // Clears the existing timer
    debounceTimer = setTimeout(() => func.apply(context, args), delay); // Sets a new timer
  };
};

const SearchComponent = () => { // Main search component
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [results, setResults] = useState([]); // State for search results
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef(null);


  // Fetch search results
  const fetchSearchResults = async (query) => { // Function to fetch search results
    try {
      const response = await fetch(`/itemSearch?query=${query}`); // Fetching data from the server
      const data = await response.json(); // Converting response to JSON
      setResults(data);
      setIsSearchVisible(true) // Setting the results in state
    } catch (error) {
      console.error('Error fetching items:', error); // Error handling
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  // Debounced search function
  const handleSearch = debounce(() => { // Debounced search function
    if (searchTerm) {
      fetchSearchResults(searchTerm); // If searchTerm is present, fetch results
    } else {
      setResults([]); // If searchTerm is empty, clear results
    }
  }, 300); // 300ms delay for debounce

  // Effect to trigger search on searchTerm change
  useEffect(() => {
    handleSearch(); // Call handleSearch function
  }, [searchTerm]); // Dependency array includes searchTerm

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setIsSearchVisible(false);
  };

  return (
    <div ref={searchRef}>
      <StyledSearchInput
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isSearchVisible && results.length > 0 && (
        <StyledResultsContainer>
          {results.map((item, index) => (
            <Link 
              to={`/itemsId/${item._id}`} 
              key={index} 
              style={{ textDecoration: 'none' }}
              onClick={clearSearch} // Attach the clearSearch function to Link click
            >
              <StyledResultItem>
                {item.name}
              </StyledResultItem>
            </Link>
          ))}
        </StyledResultsContainer>
      )}
    </div>
  );
};

export default SearchComponent;
