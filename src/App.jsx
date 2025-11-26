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
import { DiseaseProvider } from './context/disease';
import ForgotPassword from './compononts/ForgotPassword';
import { PlantIdentificationProvider } from './context/plantIdentification';

// Extra contexts
import NotificationsPage from "./pages/NotificationsPage";
import VisualAidPage from './pages/VisualAidPage';
import { WeatherProvider } from "./context/WeatherContext";
import { ChatbotProvider } from "./context/ChatbotContext";
import { VisualAidProvider } from "./context/VisualAidContext";
import { MistakeProvider } from "./context/MistakeContext";
import { NotificationProvider } from "./context/NotificationContext";

// Landing page components
import LandingPage from "./pages/LandingPage";
import LandingNavbar from "./compononts/landingPage/Navbar";
import AboutEcobotanica from "./pages/Aboutecobotnica";

// ✅ ProtectedRoute
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
  if (!token) return <ChooseRole />;
  return children;
};

// ✅ Public Route - Redirect to dashboard if logged in
const PublicRoute = ({ children }) => {
  const { token } = useContext(ShopContext);
  
  if (token) {
    return <Navigate to="/UserDashboard" replace />;
  }
  return children;
};

// ✅ Layout component for Navbar switching
const Layout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/" || location.pathname === "/AboutEcobotanica";
  const { token } = useContext(ShopContext);

  // Show searchbar only for logged-in users and not on landing pages
  const showSearchbar = token && !isLandingPage;

  return (
    <>
      <ToastContainer />
      {isLandingPage ? <LandingNavbar /> : <Navbar />}
      {showSearchbar && <Searchbar />}
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        {children}
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <PlantIdentificationProvider>
      <Layout>
        <Routes>
          {/* 🌿 Public Landing Pages */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/AboutEcobotanica" element={<PublicRoute><AboutEcobotanica /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/verify" element={<PublicRoute><VerifyPage /></PublicRoute>} />
          <Route path="/chooseRole" element={<PublicRoute><ChooseRole /></PublicRoute>} />

          {/* 🔒 Protected Routes - All require login */}
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
          <Route 
            path='/plantidentification' 
            element={
              <ProtectedRoute message="Please login to access Plant Identification">
                <PlantIdentification />
              </ProtectedRoute>
            } 
          />
          <Route
            path='/companionPlanting'
            element={
              <ProtectedRoute message="Please login to access Companion Planting">
                <CompanionPlanting />
              </ProtectedRoute>
            }
          />
          <Route
            path='/PlantProfile'
            element={
              <ProtectedRoute message="Please login to access Plant Profile">
                <PlantProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/addnewplantprofile'
            element={
              <ProtectedRoute message="Please login to add new plant profile">
                <AddNewPlantProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/CommunityChat'
            element={
              <ProtectedRoute message="Please login to access Community Chat">
                <CommunityChat />
              </ProtectedRoute>
            }
          />
          
          <Route
            path='/profilePage'
            element={
              <ProtectedRoute message="Please login to access your profile">
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 🛒 Ecom Routes */}
          <Route
            path='/Ecom'
            element={
              <ProtectedEcomRoute>
                <Ecom />
              </ProtectedEcomRoute>
            }
          />
          <Route
            path='/collection'
            element={
              <ProtectedEcomRoute>
                <Collection />
              </ProtectedEcomRoute>
            }
          />
          <Route
            path='/product/:productId'
            element={
              <ProtectedEcomRoute>
                <Product />
              </ProtectedEcomRoute>
            }
          />
          <Route
            path='/cart'
            element={
              <ProtectedEcomRoute>
                <Cart />
              </ProtectedEcomRoute>
            }
          />
          <Route
            path='/placeOrder'
            element={
              <ProtectedEcomRoute>
                <PlaceOrder />
              </ProtectedEcomRoute>
            }
          />
          <Route
            path='/orders'
            element={
              <ProtectedEcomRoute>
                <Orders />
              </ProtectedEcomRoute>
            }
          />
          <Route
            path='/aboutUs'
            element={
              <ProtectedEcomRoute>
                <AboutUs />
              </ProtectedEcomRoute>
            }
          />
          <Route
            path='/contacts'
            element={
              <ProtectedEcomRoute>
                <Contacts />
              </ProtectedEcomRoute>
            }
          />

          {/* 🔄 Redirect unknown routes to appropriate page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </PlantIdentificationProvider>
  );
};

export default App;