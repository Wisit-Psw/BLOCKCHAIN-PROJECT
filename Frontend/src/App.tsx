import './App.css';
import NavBar from './components/customer/navbar/Navbar';
import Menu from './components/customer/menu/Menu';
import Home from './components/customer/home/Home';
import Delivery from './components/customer/delivery/Delivery';
import History from './components/customer/history/History';
import Wallet from './components/customer/wallet/Wallet';
import Setting from './components/customer/setting/Setting';
import Cart from './components/customer/cart/Cart';

// import SupNavBar from './components/Supplier/Navbar/navbar';
// import SupMenu from './components/Supplier/Menu/menu';
// import SupHome from './components/Supplier/Home/sup-home';
// import SupDelivery from './components/Supplier/Delivery/sup-delivery';
// import SupHistory from './components/Supplier/History/sup-history';
// import SupWallet from './components/Supplier/Wallet/sup-wallet';
// import SupSetting from './components/Supplier/Setting/sup-setting';
// import SupCart from './components/Supplier/Cart/sup-cart';

import { Routes, Route  } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="page-header">
        <NavBar />
        <Menu />
      </div>
      <div className="page-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customer" element={<Home />} />
            <Route path="/customer/delivery" element={<Delivery />} />
            <Route path="/customer/history" element={<History />} />
            <Route path="/customer/wallet" element={<Wallet />} />
            <Route path="/customer/settings" element={<Setting />} />
            <Route path="/customer/cart" element={<Cart />} />

            {/* <Route path="/supplier" element={<SupHome />} />
            <Route path="/supplier/delivery" element={<SupDelivery />} />
            <Route path="/supplier/history" element={<SupHistory />} />
            <Route path="/supplier/wallet" element={<SupWallet />} />
            <Route path="/supplier/settings" element={<SupSetting />} /> */}
            {/* <Route path="/supplier/cart" element={<SupCart />} /> */}
          </Routes>
      </div>
    </>
  );
}

export default App;
