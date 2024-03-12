import  { useState } from 'react';
import './Register.css'
import { Link } from 'react-router-dom';

const SupRegister = () => {
    const [emailInputValue, setEmailInputValue] = useState('');
    const [nameInputValue, setNameInputValue] = useState('');
    const [phoneInputValue, setPhoneInputValue] = useState('');
    const [addressInputValue, setAddressInputValue] = useState('');
    const [passwordInputValue, setPasswordInputValue] = useState('');
    const [confirmPasswordInputValue, setConfirmPasswordInputValue] = useState('');
    const onRegisterClick = (event: React.FormEvent<HTMLFormElement>) => {
        console.log(event)
    }
    return (
        <div className="sup-reg-page">
        <div className="sup-reg-container">
            <div className="card bg-white" id="loginbox">
                <div className="card-header">
                    <div className="header-text">Sign up</div>
                </div>
                <form onSubmit={onRegisterClick}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            value={emailInputValue}
                            onChange={(e) => setEmailInputValue(e.target.value)}
                            name="email"
                            type="email"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            className="form-control"
                            value={nameInputValue}
                            onChange={(e) => setNameInputValue(e.target.value)}
                            name="name"
                            type="name"
                            placeholder="Full name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            className="form-control"
                            value={phoneInputValue}
                            onChange={(e) => setPhoneInputValue(e.target.value)}
                            name="phone"
                            type="tell"
                            placeholder="Phone"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Address</label>
                        <input
                            className="form-control"
                            value={addressInputValue}
                            onChange={(e) => setAddressInputValue(e.target.value)}
                            type="text"
                            name="address"
                            placeholder="Address"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            value={passwordInputValue}
                            onChange={(e) => setPasswordInputValue(e.target.value)}
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Password</label>
                        <input
                            className="form-control"
                            value={confirmPasswordInputValue}
                            onChange={(e) => setConfirmPasswordInputValue(e.target.value)}
                            name="confirm-password"
                            type="password"
                            placeholder="Confirm password"
                        />
                    </div>
                    <div className="form-group">
                            <Link to='/login' className='login-wrap'>Login</Link>
                        </div>
                    <div className="responseLog">
                    </div>

                    <button type="submit" className="sigin-btn bg-blue text-white">Sign up</button>
                </form>
            </div>
            <div className="card-footer"></div>
        </div>
    </div>
    );
};

export default SupRegister;
