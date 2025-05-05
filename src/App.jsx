import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Collection from './pages/Collection';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
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

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <Searchbar />
      <Routes>
        <Route path='/collection' element={<Collection />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/placeOrder' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/' element={<PlantIdentification />} />
        <Route path='/plantDoctor' element={<PlantDoctor />} />
        <Route path='/plantCare' element={<PlantCare />} />
        <Route path='/companionPlanting' element={<CompanionPlanting />} />
        <Route path='/plantationGuide' element={<PlantationGuide />} />
        <Route path='/Ecom' element={<Ecom />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
