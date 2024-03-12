import { useState } from 'react';
// import { userCliend } from '../../../user-data/UserData';
import './Login.css'

interface LoginProps {
    onLoginClick: (email: string, password: string) => void;
}

const LoginPage = ({ onLoginClick }: LoginProps) => {
    const [usernameInputValue, setUsernameInputValue] = useState('');
    const [passwordInputValue, setPasswordInputValue] = useState('');

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onLoginClick(usernameInputValue, passwordInputValue)
    }

    return (
        <div className="page">
            <div className="container">
                <div className="card bg-white" id="loginbox">
                    <div className="card-header">
                        <div className="header-text">Sign In</div>
                        <label className="header-detail">Sign in to stay connected.</label>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                className="form-control"
                                value={usernameInputValue}
                                onChange={(e) => setUsernameInputValue(e.target.value)}
                                name="username"
                                type="email"
                                placeholder="Email"
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
                            <div className="forgot-pass-wrap">Forgot Password</div>
                        </div>

                        {/* Render responseLog div conditionally */}
                        <div className="responseLog">
                            {/* Your response log content */}
                        </div>

                        <button type="submit" className="sigin-btn bg-blue text-white">Sign in</button>
                    </form>
                </div>
                <div className="card-footer"></div>
            </div>
        </div>
    );
};

export default LoginPage;
