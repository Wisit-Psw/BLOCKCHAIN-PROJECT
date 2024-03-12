import './CustomerApp.css';
import { Routes, Route } from 'react-router-dom';

import NavBar from './navbar/Navbar';
import Menu from './menu/Menu';
import Home from './home/Home';
import Delivery from './delivery/Delivery';
import History from './history/History';
import Wallet from './wallet/Wallet';
import Setting from './setting/Setting';
import Cart from './cart/Cart';
import Product from './product/Product';
import { useEffect } from 'react';
import { environments } from '../../environment/environment';
import { userCliend } from '../../user-data/UserData';

function CustomerApp() {

    useEffect(() => {
        const checkSession = async () => {
          console.log(environments.paths.getProduct);
          if (!(await userCliend.isSessionActive())) {
            // const link = document.createElement('a');
            // link.href = '/login';
            // link.click();
          }
        };
    
        checkSession();
      })

    return (
        <>
            <div className="page-header">
                <NavBar />
                <Menu />
            </div>
            <div className="page-body">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/delivery" element={<Delivery />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/settings" element={<Setting />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:productId" element={<Product />} />
                </Routes>
            </div>
        </>
    );
}

export default CustomerApp;
