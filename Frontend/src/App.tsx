import './App.css';
import { useState, useEffect } from 'react';
import { userCliend } from './user-data/UserData';
import CustomerApp from './components/customer/CustomerApp';
import SupplierApp from './components/supplier/SupplierApp';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/commons/login/Login';
import SupRegister from './components/supplier/register/Register';
import CusRegister from './components/customer/register/Register';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { environments } from './environment/environment';

function App() {
  // const [userCliendData, setUserCliendData] = useState(userCliend.userData);
  const navigate = useNavigate()
  useEffect(() => {
    // userCliend.isSessionActive()
    // setUserCliendData(userCliend.userData)
  }, [])

  const onLoginClick = async (email: string, password: string) => {

    try {
      const response = await axios.post(environments.paths.login, {
        email: email,
        password: password
      }, { withCredentials: true });
      
      userCliend.setUserData(response.data);
      navigate('/');

    } catch (error) {
      console.error('Login error:', (error as Error).message || 'An error occurred');
    }
  };

  return (
    <>
      {userCliend.userData?.isCustomer && !userCliend.userData?.isSupplier && (
        <Routes>
          <Route path="/*" element={<CustomerApp />} />
        </Routes>
      )}

      {userCliend.userData?.isSupplier && !userCliend.userData?.isCustomer && (
        <Routes>
          <Route path="/*" element={<SupplierApp />} />
        </Routes>
      )}

      {!userCliend.userData?.isSupplier && !userCliend.userData?.isCustomer && (
        <Routes>
          <Route path="*" element={<LoginPage onLoginClick={onLoginClick} />} />
          <Route path="/customer/register" element={<CusRegister />} />
          <Route path="/supplier/register" element={<SupRegister />} />
        </Routes>
      )}
    </>
  );
}

export default App;
