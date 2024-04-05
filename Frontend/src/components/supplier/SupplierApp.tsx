import './SupplierApp.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import NavBar from './navbar/Navbar';
import Menu from './menu/Menu';
import SupHome from './home/SupHome';
import SupCredit from './credit/SupCredit';
import Setting from './setting/Setting';
import SupOrder from './order/SupOrder';
import Product from './product/Product';
import SupAdd from './add/SupAddProduct';
import CreditReq from './credit-req/CreditReq';
import SupCreditInfo from './credit-info/SupCreditInfo';
import SupHistoryInfo from './history-info/HistoryInfo';
import Notification from '../commons/notification/Notification';

function SupplierApp() {
    useEffect(() => {

    })
    return (
        <>
            <Notification></Notification>
            <div className="page-header">
                <NavBar />
            </div>
            <div className="page-body">
                <Routes>
                    <Route path="/" element={<SupHome />} />
                    <Route path="/credit-info/:id" element={<SupCreditInfo />} />
                    <Route path="/add" element={<SupAdd />} />
                    <Route path="/credit" element={<SupCredit />} />
                    <Route path="/credit-req" element={<CreditReq />} />
                    <Route path="/settings" element={<Setting />} />
                    <Route path="/order" element={<SupOrder />} />
                    <Route path="/order-info/:id" element={<SupHistoryInfo />} />
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
