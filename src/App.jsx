import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Pages
import Collection from './pages/Collection';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Contacts from './pages/Contacts';
import PlantIdentification from './pages/PlantIdentification';
import PlantDoctor from './pages/PlantDoctor';
import PlantCare from './pages/PlantCare';
import PlantationGuide from './pages/PlantationGuide';
import Ecom from './pages/Ecom';
import CompanionPlanting from './pages/CompanionPlanting';
import ProfilePage from "./pages/ProfilePage";
import VerifyPage from './pages/VerifyPage';
import UserDashboard from './pages/userDashboard';
import PlantProfile from './pages/PlantProfile';
import AddNewPlantProfile from './pages/AddNewPlantProfile';
import CommunityChat from './pages/CommunityChat';
import ChooseRole from './pages/chooseRole';
import NotificationsPage from "./pages/NotificationsPage";
import VisualAidPage from './pages/VisualAidPage';
import AdminDashboard from "./pages/AdminDashboard";
import CommunityComplaints from './pages/CommunityComplaints';
import ForgotPassword from './compononts/ForgotPassword';

// Components
import Navbar from './compononts/Navbar';
import Footer from './compononts/Footer';
import Searchbar from './compononts/Searchbar';
import { ToastContainer } from 'react-toastify';

// Contexts / Providers
import { ShopContext } from './context/ShopContext';
import { AiProvider } from './context/AiContext';
import { WeatherProvider } from "./context/WeatherContext";
import { ChatbotProvider } from "./context/ChatbotContext";
import { VisualAidProvider } from "./context/VisualAidContext";
import { MistakeProvider } from "./context/MistakeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DiseaseProvider } from './context/disease';

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
              <ChatbotProvider>
                <WeatherProvider>
                  <NotificationProvider>
                    <PlantCare />
                  </NotificationProvider>
                </WeatherProvider>
              </ChatbotProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path='/notification'
          element={
            <ProtectedRoute message="Please login to access notifications">
              <NotificationProvider>
                <NotificationsPage />
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path='/plantationGuide'
          element={
            <ProtectedRoute message="Please login to access Plantation Guide">
              <AiProvider>
                <VisualAidProvider>
                  <MistakeProvider>
                    <PlantationGuide />
                  </MistakeProvider>
                </VisualAidProvider>
              </AiProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/visual-aid"
          element={
            <ProtectedRoute message="Please login to access Visual Aids">
              <AiProvider>
                <VisualAidProvider>
                  <MistakeProvider>
                    <VisualAidPage />
                  </MistakeProvider>
                </VisualAidProvider>
              </AiProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path='/plantDoctor'
          element={
            <ProtectedRoute message="Please login to access Plant Doctor">
              <DiseaseProvider>
                <PlantDoctor />
              </DiseaseProvider>
            </ProtectedRoute>
          }
        />

        {/* ✅ Public Routes */}
        <Route path="/communityComplaints" element={<CommunityComplaints />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
        <Route path='/companionPlanting' element={<CompanionPlanting />} />

        {/* ✅ Ecom Protected Route */}
        <Route
          path='/Ecom'
          element={
            <ProtectedEcomRoute>
              <Ecom />
            </ProtectedEcomRoute>
          }
        />

        {/* ✅ Admin Route */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />

        {/* ✅ Misc Routes */}
        <Route path='/profilePage' element={<ProfilePage />} />
        <Route path='/verify' element={<VerifyPage />} />
        <Route path='/CommunityChat' element={<CommunityChat />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;