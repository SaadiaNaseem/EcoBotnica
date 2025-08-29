import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Collection from './pages/Collection';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Navbar from './compononts/Navbar';
import Contacts from './pages/Contacts';
import PlantIdentification from './pages/PlantIdentification';
import PlantDoctor from './pages/PlantDoctor';
import PlantCare from './pages/PlantCare';
import PlantationGuide from './pages/PlantationGuide';
import Ecom from './pages/Ecom';
import CompanionPlanting from './pages/CompanionPlanting';
import Footer from './compononts/Footer';
import Searchbar from './compononts/Searchbar';
import { AiProvider } from './context/AiContext';
import ProfilePage from "./pages/ProfilePage";
import { ToastContainer } from 'react-toastify';
import VerifyPage from './pages/VerifyPage';
import UserDashboard from './pages/userDashboard';
import PlantProfile from './pages/PlantProfile';
import AddNewPlantProfile from './pages/AddNewPlantProfile';
import CommunityChat from './pages/CommunityChat';
import ChooseRole from './pages/chooseRole';
import { ShopContext } from './context/ShopContext';

// ✅ Normal ProtectedRoute
const ProtectedRoute = ({ children, message }) => {
  const { token } = useContext(ShopContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location, msg: message }} replace />;
  }
  return children;
};

// ✅ Special ProtectedRoute for Ecom
const ProtectedEcomRoute = ({ children }) => {
  const { token } = useContext(ShopContext);

  if (!token) {
    // agar login nahi hai to ChooseRole pe bhejo
    return <ChooseRole />;
  }
  return children;
};

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <Searchbar />
      <Routes>
        {/* ✅ Protected Routes with dynamic messages */}
        <Route
          path='/UserDashboard'
          element={
            <ProtectedRoute message="Please login to access your Dashboard">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/plantCare'
          element={
            <ProtectedRoute message="Please login to access Plant Care Assistant">
              <PlantCare />
            </ProtectedRoute>
          }
        />
        <Route
          path='/plantationGuide'
          element={
            <ProtectedRoute message="Please login to access Plantation Guide">
              <AiProvider>
                <PlantationGuide />
              </AiProvider>
            </ProtectedRoute>
          }
        />

        {/* ✅ Public Routes */}
        <Route path='/PlantProfile' element={<PlantProfile />} />
        <Route path='/addnewplantprofile' element={<AddNewPlantProfile />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/aboutUs' element={<AboutUs />} />
        <Route path='/placeOrder' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/' element={<PlantIdentification />} />
        <Route path='/plantDoctor' element={<PlantDoctor />} />
        <Route path='/companionPlanting' element={<CompanionPlanting />} />

        {/* ✅ Ecom Special Protected Route */}
        <Route
          path='/Ecom'
          element={
            <ProtectedEcomRoute>
              <Ecom />
            </ProtectedEcomRoute>
          }
        />

        <Route path='/profilePage' element={<ProfilePage />} />
        <Route path='/verify' element={<VerifyPage />} />
        <Route path='/CommunityChat' element={<CommunityChat />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;