// components/Home.js
import React, {useState} from 'react';
import Navbar from '../components/home/Navbar';
import Header from '../components/labtest/Header';
import Bookedtest from '../components/labtest/Bookedtest';
import Health from '../components/labtest/Health';
import Middleone from '../components/labtest/Middleone';
import Middletwo from '../components/labtest/Middletwo';
import Border from '../components/home/Border';
import SignupPopup from '../components/home/SignupPopup';
import { CartProvider } from '../context/cartContext'; // Import CartProvider



const Labtest = () => {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <CartProvider> 
        <div>
            <Navbar onSignUpClick={() => setShowPopup(true)} />
            <Header />
            <Bookedtest/>
            <Health/>
            <Middleone/>
            <Middletwo/>
            <Border/>
           
            {showPopup && <SignupPopup onClose={() => setShowPopup(false)} />}
        </div>
            </CartProvider>
    )
}

export default Labtest;
