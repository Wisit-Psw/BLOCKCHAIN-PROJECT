import './App.css';
import NavBar from './components/Customer/Navbar/navbar';
import Menu from './components/Customer/Menu/menu';
import Home from './components/Customer/Home/home';
import Delivery from './components/Customer/Delivery/delivery';
import History from './components/Customer/History/history';
import Wallet from './components/Customer/Wallet/wallet';
import Setting from './components/Customer/Setting/setting';
import Cart from './components/Customer/Cart/cart';

// import SupNavBar from './components/Supplier/Navbar/navbar';
// import SupMenu from './components/Supplier/Menu/menu';
import SupHome from './components/Supplier/Home/sup-home';
import SupDelivery from './components/Supplier/Delivery/sup-delivery';
import SupHistory from './components/Supplier/History/sup-history';
import SupWallet from './components/Supplier/Wallet/sup-wallet';
import SupSetting from './components/Supplier/Setting/sup-setting';
// import SupCart from './components/Supplier/Cart/sup-cart';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="page-header">
        <NavBar />
        <Menu />
      </div>
      <div className="page-body">
          <Routes>
            <Route path="/customer" element={<Home />} />
            <Route path="/customer/delivery" element={<Delivery />} />
            <Route path="/customer/history" element={<History />} />
            <Route path="/customer/wallet" element={<Wallet />} />
            <Route path="/customer/settings" element={<Setting />} />
            <Route path="/customer/cart" element={<Cart />} />

            <Route path="/supplier" element={<SupHome />} />
            <Route path="/supplier/delivery" element={<SupDelivery />} />
            <Route path="/supplier/history" element={<SupHistory />} />
            <Route path="/supplier/wallet" element={<SupWallet />} />
            <Route path="/supplier/settings" element={<SupSetting />} />
            {/* <Route path="/supplier/cart" element={<SupCart />} /> */}
          </Routes>
      </div>
    </>
  );
}

export default App;
