import { createContext,useReducer } from "react";  

const initialState = {  

    cart: [], //what our cart currently contains, will be an array of item objects with extra property "quantity" for when multiples of the same item are in cart
    itemsCurrentPage: [], // a page request, always contains 20 different items. does not have the cart property "quantity"
 
    itemsCompanyPage: [], //page request but will only find them by company
    
    items: [], //probably to be avoided, but we can have all of the database's items in here

    companies: [], //placeholder, waiting for companies list endpoint, currently populated by requestAllItems
    categories: [], //placeholder, waiting for categories list endpoint, currently populated by requestAllItems
 
    itemsIndex: {}, //probably deprecated
    companiesIndex: {}, //probably deprecated
  };
  /*current usable actions:
          requestAllItems ==== PARAMS:(), updates `items` to an array of all item objects

          emptyPage ==== PARAMS:(), just a thing to empty the items page
          requestItemPage ==== PARAMS:(PAGE) (PAGE must be int, the number of the page you want)  updates `itemsCurrentPage` to an array of 20 items at that page index 
                                example: requestItemPage(2); (updates: itemsCurrentPage)

          requestItemCategoryPage, //placeholder

          requestCart ==== PARAMS:(), updates `cart` to an array of all item in carts. items here will have a `quantity` property of how many times the item is in cart

          addToCart ==== PARAMS:(OBJECT) (OBJECT is one obj with two properties: {_id:(must be the item _id),_quantity:(quantity to set the amount in cart to) ) adds if necessary and sets the amount of items in cart
                              example: addToCart({_id:3333,quantity:2}); (updates: cart)
          clearCart ==== PARAMS: () empties the cart array

          removeFromCart ==== PARAMS:(_id one number:(_id of object to remove from cart)), removes that object whatever the quantity completely from cart
                                example: removeFromCart(3333); (updates: cart)
  
          */          
  

 
const reducer = (state, action) => { 
     
    //receive item info from server - currently does a little too much, receives ALL items from server and creates a bunch of
    //useful arrays. unfortunately it's a bit much to ask all items from server on page load, so we should 
    // move away from this for now.
    switch(action.type) {
    case 'receive-item-info-from-server': { 

      const _tempItemsIndex = {};
      const _tempItemsArray= []; 
      const _tempCategoriesArray = [];
      const _tempCompaniesArray = [];

      for (let _i = 0; _i < Object.keys(action.data).length; _i +=1)
      { 
        const _item = action.data[String(_i)]; 
         
        _tempItemsArray[_i] = {..._item};
        _tempItemsIndex[_item._id] = _i;  
        if (_tempCategoriesArray.indexOf(_item.category) === -1)
        {
          _tempCategoriesArray.push(_item.category);
        }

        if (_tempCategoriesArray.indexOf(_item.company) === -1)
        {
          _tempCompaniesArray.push(_item.company);
        }
        
      }     

        return {
          ...state,
          items: _tempItemsArray,
          itemsIndex: _tempItemsIndex,
          companies: _tempCompaniesArray,
          categories: _tempCategoriesArray,
        } 
        
    }
 
    //this is more what we want, setting itemsCurrentPage to 20 items (hardcoded in the endpoint, your fault Ossama)
    //we should be using this whenever we want a list of items not from categories etc
    case 'receive-page-info-from-server': {

      const _tempItemsArray= []; 
      for (let _i = 0; _i < Object.keys(action.data).length; _i +=1)
      { 
         const _item = action.data[String(_i)]; 
        _tempItemsArray[_i] = {..._item};
      }
      return {
        ...state, 
        itemsCurrentPage: _tempItemsArray,
      } 
    }

    //this sets your entire cart data, this is necessary to know what's in the cart
    //do note the quantity property that only exists for items in the cart
    case 'receive-cart-info-from-server': {
      const _tempItemsArray= []; 
      for (let _i = 0; _i < Object.keys(action.data).length; _i +=1)
      { 
         const _item = action.data[String(_i)]; 
        _tempItemsArray[_i] = {..._item};
      }
       
      return {
        ...state,  
        cart: _tempItemsArray,
      } 
 
    }

    
    case 'empty-page':{
      const _tempPage = [];
      return {
        ...state,  
        itemsCurrentPage: _tempPage,
      } 

    }
    case 'add-to-cart': { 
      const _tempCart = state.cart.slice();
      let _inCart = false;  
      for (let _i = 0; _i < _tempCart.length;_i++)
      {
        if (_tempCart[_i]._id === action.data.item._id)
        {
          _tempCart[_i].quantity = action.data.item.quantity;
          _inCart = true;
        }
      }
      if (!_inCart)
      {
        _tempCart.push(action.data.item);
      }
      return {
        ...state,  
        cart: _tempCart,
      } 

    }

    case 'remove-from-cart': { 
      const _tempCart = state.cart.slice(); 
      for (let _i = 0; _i < state.cart.length;_i++)
      {
        const _item = state.cart[_i];
        if (_item._id  === action.data)
        {
          _tempCart.splice(_i, 1); 
          break;
        }
      } 

      return {
        ...state,  
        cart: _tempCart,
      } 

    }

    case 'clear-cart': { 
      const _tempCart = [];

      return {
        ...state,  
        cart: _tempCart,
      } 

    }

    case 'get-items-by-company': { 

      return {
        ...state,  
        itemsCurrentPage: action.data,
      } 
    }



    

    //data required: category string
    //sets itemsByCategory to 

    case 'get-items-by-category-page': { 
        const _tempItemCatArray = action.data.slice();  

        return {
          ...state,
          itemsCurrentPage:_tempItemCatArray,
        };
    }
      

    default: {
              throw new Error(`Unrecognized action: ${action.type}`);
        }
    }

}

export const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);


    //requestItemPage must be used in use effect, it's the first half that will obtain the item page data
    //once done it will add it to the itemsCurrentPage state

    const requestItemPage = (data) => {
            fetch('/items/'+String(data), //data contains only the _id, so we can directly string it
            {
            method: "GET", //method always important to set
            headers: {  //make sure headers is headers, not just header.
                "Content-Type":"application/json",
              } 
            }
          )
          .then(res => res.json()) //turn them into json
          .then(data => receiveItemPageFromServer(data)) //goes to the reducer so we can set the context proper 
          .catch((error)=>{
            console.log(error); //log the errors.
          }) 
    }
    //not copying this basic comment bc most functions are server fetches like this, will only add comments to the weirder ones
    
    const requestAllItems = () => {
        fetch('/items',
        {
        method: "GET",
        headers: {
            "Content-Type":"application/json",
          } 
        }
      )
      .then(res => res.json())
      .then(data => receiveItemInfoFromServer(data)) 
      .catch((error)=>{
        console.log(error);  
      }) 
    }

    const requestCart = () => {
      fetch('/cart',
      {
      method: "GET",
      headers: {
          "Content-Type":"application/json",
        } 
      }
    )
    .then(res => res.json())
    .then(data => receiveCartInfoFromServer(data)) 
    .catch((error)=>{
      console.log(error);  
    }) 
  }

  
  const receiveCartInfoFromServer = (data) => {
    dispatch({
      type: "receive-cart-info-from-server",
      data: data,
    }); 
  }; 

    const receiveItemPageFromServer = (data) => {
      dispatch({
        type: "receive-page-info-from-server",
        data: data,
      }); 
    }; 

    const receiveItemInfoFromServer = (data) => {
      dispatch({
        type: "receive-item-info-from-server",
        data: data,
      }); 
    }; 

    const inputSearch = (data) => {
      dispatch({
        type:"input-search",
        data: data,
      });

    }
 

    const addToCart = (data) => {  
      fetch('/addToCart',
        {
        method: "POST", 
        body: JSON.stringify({"_id":data._id,"quantity":data.quantity}), //body will NOT WORK if you type header: instead of headers: lol
        headers: {
            "Content-Type":"application/json",
          },
        })
        .then(res => res.json())
        .then((res) => {  
          dispatch({
        type: "add-to-cart",
        data: res,
        }) }  )
      .catch((error)=>{
        console.log(error);  
        })
    }; 

    const removeFromCart = (data) => {
      fetch('/removeFromCart',
        {
        method: "DELETE", 
        body: JSON.stringify({"_id":data}),
        headers: {
            "Content-Type":"application/json",
          },
        })
        .then(res => res.json())
        .then((res) => { 
          dispatch({
        type: "remove-from-cart",
        data: data, //notice that sometimes data is data and sometimes it's res. really depends on what i want to pass to the reducer
        }) }  )  
      .catch((error)=>{
        console.log(error);  
        }) 
    }

    const clearCart = (data) =>{
      fetch(`/removeAllFromCart`,
        {
        method: "DELETE",
        headers: {
            "Content-Type":"application/json",
            } 
          }
        )
        .then(res => res.json())
      
        .then((res) => { 
        dispatch({
          type: "clear-cart",
          data: res,
          })
        })
    }

    const requestItemCategoryPage = (data) => {
        fetch(`/items/${data.category}/${data.page}`,
        {
        method: "GET",
        headers: {
            "Content-Type":"application/json",
            } 
          }
        )
      .then(res => res.json())
      
      .then((res) => { 
      dispatch({
        type: "get-items-by-category-page",
        data: res,
        })
      })
    }

      const requestItemsByCompany = (data) => {
        fetch(`/company/${data.company}`,
        {
        method: "GET",
        headers: {
            "Content-Type":"application/json",
            } 
          }
        )
      .then(res => res.json()) 
      .then((res) => {  
      dispatch({
        type: "get-items-by-company",
        data: res,
        })
      })
    }

    const emptyPage = (data) => {
      dispatch({
        type:"empty-page",
        data:data,
      })
    }

    const checkoutPurchase = (data) => {
      dispatch({
        type: "checkout-purchase",
        data: data,
      }); 
    }; 

    //data required: category string
    const getItemsByCategory = (data) => {
      dispatch({
      type: "get-items-by-category",
      data: data,
      })
    }

  return (
    <MainContext.Provider
      value={{
        state,
        actions: { 
          requestAllItems,
          requestItemPage,
          requestItemsByCompany,
          requestItemCategoryPage,
          emptyPage,
          requestCart,  
          addToCart, 
          removeFromCart,
          clearCart,

          checkoutPurchase,  //placeholder
        },
      }}
    >
      {children}
    </MainContext.Provider>
  );
};



export const MainContext = createContext();
