import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'Rs';
  const delivery_fee = 70;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);

  // Axios configuration
  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const addToCart = async (itemId) => {
    const cartData = { ...cartItems };

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      const product = products.find(item => item._id === itemId);
      if (product) {
        cartData[itemId] = 1;
      }
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/cart/add', 
          { itemId }, 
          { headers: getAuthHeaders() }
        );
        toast.success('Added to cart!');
      } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
          handleLogout();
        } else {
          toast.error(error.response?.data?.message || error.message);
        }
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalCount += cartItems[itemId];
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, quantity) => {
    let cartData = { ...cartItems };
    
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/cart/update', 
          { itemId, quantity }, 
          { headers: getAuthHeaders() }
        );
      } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
          handleLogout();
        } else {
          toast.error(error.response?.data?.message || error.message);
        }
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (userToken = token) => {
    if (!userToken) return;
    
    try {
      const response = await axios.post(
        backendUrl + '/api/cart/get', 
        {}, 
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setCartItems({});
    toast.info('Logged out successfully');
    navigate('/');
  };

  const clearCart = () => {
    setCartItems({});
  };

  // Set user data when token is set (from login response)
  const setUserData = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
      // Removed getUserData() call to avoid 404 error
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart();
      // Removed getUserData() call to avoid 404 error
    }
  }, [token]);

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
    navigate,
    backendUrl,
    setToken,
    token,
    setCartItems,
    user,
    userId: user?._id,
    clearCart,
    handleLogout,
    getAuthHeaders,
    setUser: setUserData // Added this to set user from login
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;