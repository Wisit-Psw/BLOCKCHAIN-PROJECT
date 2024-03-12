import './SupplierApp.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { environments } from '../../environment/environment';
import { userCliend } from '../../user-data/UserData';

import NavBar from './navbar/Navbar';
import Menu from './menu/Menu';
import SupHome from './home/SupHome';
import Delivery from './delivery/Delivery';
import SupCredit from './credit/SupCredit';
import Setting from './setting/Setting';
import Cart from './cart/Cart';
import Product from './product/Product';
import SupAdd from './add/SupAddProduct';


function SupplierApp() {
    useEffect(() => {
        const checkSession = async () => {
          console.log(environments.paths.getProduct);
          if (!(await userCliend.isSessionActive())) {
            const link = document.createElement('a');
            link.href = '/login';
            link.click();
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
                    <Route path="/" element={<SupHome />} />
                    <Route path="/add" element={<SupAdd />} />
                    <Route path="/delivery" element={<Delivery />} />
                    <Route path="/credit" element={<SupCredit />} />
                    <Route path="/settings" element={<Setting />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:productId" element={<Product />} />
                </Routes>
            </div>
        </>
    );
}

export default SupplierApp;
