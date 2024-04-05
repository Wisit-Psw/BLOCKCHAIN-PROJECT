import { useState } from 'react';
import './Register.css'
import axios from 'axios';
import { environments } from '../../../environment/environment';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Alert from '../../commons/alert/Alert';

const SupRegister = () => {
    const [emailInputValue, setEmailInputValue] = useState('');
    const [nameInputValue, setNameInputValue] = useState('');
    const [phoneInputValue, setPhoneInputValue] = useState('');
    const [addressInputValue, setAddressInputValue] = useState('');
    const [passwordInputValue, setPasswordInputValue] = useState('');
    const [confirmPasswordInputValue, setConfirmPasswordInputValue] = useState('');
    const navigate = useNavigate();

    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);
    const [isAlert, setisAlert] = useState(false);

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }

    const onRegisterClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(environments.paths.supRegister, {
                email: emailInputValue,
                name: nameInputValue,
                phone: phoneInputValue,
                address: addressInputValue,
                password: passwordInputValue,
                confirmPassword: confirmPasswordInputValue
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                handleAlert({
                    headerText: "สมัครสมาชิก",
                    contentText: "สำเร็จ",
                    btn1: {
                        btnText: "ยืนยัน",
                        btnFunc: () => {
                            setisAlert(false);
                            navigate('/login');
                        }
                    }
                })
                return
            }

            handleAlert({
                headerText: "สมัครสมาชิก",
                contentText: "มีข้อผิดพลาดเกิดขึ้น",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => { setisAlert(false) }
                }
            })
        } catch (error) {
            handleAlert({
                headerText: "สมัครสมาชิก",
                contentText: "มีข้อผิดพลาดเกิดขึ้น",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => { setisAlert(false) }
                }
            })
            console.error('Registration error:', (error as Error).message);
            return
        }

    }
    return (
        <div className="sup-reg-page">
            <div className="sup-reg-container " id="loginbox">
                <div className="card-header">
                    <div className="header-text">สมัครสมาชิก</div>
                    <label className="header-detail">ร้านค้า</label>
                </div>
                <form onSubmit={onRegisterClick}>
                    <div className="form-group">
                        <label htmlFor="email">อีเมล</label>
                        <input
                            className="form-control"
                            value={emailInputValue}
                            onChange={(e) => setEmailInputValue(e.target.value)}
                            name="email"
                            // type="email"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">ชื่อ</label>
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
                        <label htmlFor="phone">เบอร์</label>
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
                        <label htmlFor="phone">ที่อยู่</label>
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
                        <label htmlFor="password">รหัสผ่าน</label>
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
                        <label htmlFor="confirm-password">ยื่นยันรหัสผ่าน</label>
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
                        <Link to='/login' className='login-wrap'>เข้าสู่ระบบ</Link>
                    </div>
                    <div className="responseLog">
                    </div>

                    <button type="submit" className="sigin-btn bg-blue text-white">สมัครสมาชิก</button>
                </form>
            </div>
            <div className="card-footer"></div>

            {isAlert && (
                <Alert
                    headerText={alertProps?.headerText || ''}
                    contentText={alertProps?.contentText || ''}
                    btn1={alertProps?.btn1}
                    btn2={alertProps?.btn2}
                />
            )}
        </div>
    );
};

export default SupRegister;
