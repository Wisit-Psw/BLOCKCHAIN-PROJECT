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

function CustomerApp() {

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
                </Routes>
            </div>
        </>
    );
}

export default CustomerApp;
