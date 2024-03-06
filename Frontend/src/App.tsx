import './App.css';
import { useEffect } from 'react';
import { UserCliend } from './user-data/UserData';
import { environment } from './environment/environment';
import CustomerApp from './components/customer/CustomerApp';
import SupplierApp from './components/supplier/SupplierApp';
import { Routes, Route } from 'react-router-dom';

function App() {
  const userData = new UserCliend();
  const environments = new environment();

  useEffect(() => {
    console.log(environments.paths.getProduct)
    if (!userData.isSessionActive()) {
      return
    }
  })

  return (
    <>
      {userData.isCustomer() && (
        <Routes>
          <Route path="/customer/*" element={<CustomerApp />} />
        </Routes>
      )}

      {userData.isSupplier() && (
        <Routes>
          <Route path="/supplier/*" element={<SupplierApp />} />
        </Routes>
      )}

    </>
  );
}

export default App;
