import './SupplierApp.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import NavBar from './navbar/Navbar';
import Menu from './menu/Menu';
import SupHome from './home/SupHome';
// import Delivery from './delivery/Delivery';
import SupCredit from './credit/SupCredit';
import Setting from './setting/Setting';
import SupOrder from './order/SupOrder';
import Product from './product/Product';
import SupAdd from './add/SupAddProduct';


function SupplierApp() {
    useEffect(() => {

      })
    return (
        <>
            <div className="page-header">
                <NavBar />
            </div>
            <div className="page-body">
                <Routes>
                    <Route path="/" element={<SupHome />} />
                    <Route path="/add" element={<SupAdd />} />
                    {/* <Route path="/delivery" element={<Delivery />} /> */}
                    <Route path="/credit" element={<SupCredit />} />
                    <Route path="/settings" element={<Setting />} />
                    <Route path="/order" element={<SupOrder />} />
                    <Route path="/product/:productId" element={<Product />} />
                </Routes>
            </div>
            <div className="page-footer">
                <Menu />
            </div>
        </>
    );
}

export default SupplierApp;
