import { createContext, useState } from "react";
import { products } from "../assets/assets";
//import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'Rs';
  const delivery_fee = 70;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();


  const addToCart = async (itemId) => {
    // Make a copy of the current cartItems object
    const cartData = { ...cartItems };

    // Check if the item is already in the cart
    if (cartData[itemId]) {
      // If item exists, increase the quantity
      cartData[itemId] += 1;
    } else {
      // If item doesn't exist, add it to the cart with quantity 1
      const product = products.find(item => item._id === itemId);
      if (product) {
        cartData[itemId] = 1; // Add the product with quantity 1
      }
    }

    // Update the cartItems state with the new cart data
    setCartItems(cartData);

    // Add console log to check cartItems after they are updated
    //console.log("Updated Cart Items:", cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };
  
  const updateQuantity = async(itemId,quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      try {
        if (cartItems[items] > 0) {
          totalAmount += itemInfo.price * cartItems[items];
        }
      } catch (error) {
        // handle error if needed
      }
    }
    return totalAmount;
  };
  

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems, 
    addToCart, 
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
