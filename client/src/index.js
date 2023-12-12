import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { MainProvider } from './components/MainContext';

import App from './components/App'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <MainProvider>
      <App /> 
    </MainProvider>
    
); 