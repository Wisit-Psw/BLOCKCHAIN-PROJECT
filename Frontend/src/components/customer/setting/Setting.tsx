import './Setting.css';
import { useState } from 'react';
import Alert from '../../commons/alert/Alert';
import { environments } from '../../../environment/environment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userCliend } from '../../../user-data/UserData';

function Setting() {
    const navigate = useNavigate()
    const [isEditState, setEditState] = useState(false);
    const [isLogoutState, setLogoutState] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);

    const handleLogoutBtn = () => {
        if (!isLogoutState) {
            setAlertProps({
                headerText: 'ออกจากระบบ',
                contentText: 'ยืนยันการออกจากระบบหรือไม่',
                btn1: {
                    btnText: 'ยืนยัน',
                    btnFunc: async () => { await submitLogout() }
                },
                btn2: {
                    btnText: 'ยกเลิก',
                    btnFunc: () => { setLogoutState(false)}
                }
            })
        }
        setLogoutState(!isLogoutState)
    }
    const submitLogout = async () => {
        try {
            const response = await axios.post(environments.paths.logout, {}, { withCredentials: true });
            if (response.status === 200) {
                setLogoutState(!isLogoutState)
                await userCliend.clearUserData()
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', (error as Error).message || 'An error occurred');
        }
    }

    return (
        <div className='setting-page-container'>
            <div className="page-header shop-infomations">
                Shop Infomations
            </div>
            <div className="page-content">
                <div className="info-container">
                    <div className="infomation-text">
                        {!isEditState && (
                            <>
                                <div className="feild-wrap">
                                    <div className="feild-name">อีเมล</div>
                                    <div className="feild-data">{userCliend.userData?.userData.email}</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">ชื่อ</div>
                                    <div className="feild-data">{userCliend.userData?.userData.name}</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">เบอร์</div>
                                    <div className="feild-data">{userCliend.userData?.userData.phone}</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">ที่อยู่</div>
                                    <div className="feild-data">{userCliend.userData?.userData.address}</div>
                                </div>
                            </>
                        )
                        } {isEditState && (
                            <>
                                <div className="feild-wrap">
                                    <div className="feild-name">Email</div>
                                    <input type="text" />
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">Name</div>
                                    <input type="text" />
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">Phone</div>
                                    <input type="text" />
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">Address</div>
                                    <input type="text" />
                                </div>
                            </>
                        )
                        }
                    </div>
                </div>
                {!isEditState && (
                    <div className="btn-container">
                        {/* <div className="btn text-white setting-update-btn" onClick={() => { setEditState(!isEditState) }}>Update</div> */}
                        <div className="btn bg-red text-white setting-update-btn" onClick={() => { handleLogoutBtn() }}>Logout</div>
                    </div>
                )}
                {isEditState && (
                    <div className="btn-container">
                        <div className="btn bg-light-gray text-white setting-update-btn" onClick={() => { setEditState(!isEditState) }}>Cancel</div>
                        <div className="btn text-white setting-update-btn" onClick={() => { setEditState(!isEditState) }}>Update</div>
                    </div>
                )}
            </div>
            {isLogoutState && (
                <Alert
                    headerText={alertProps?.headerText || ''}
                    contentText={alertProps?.contentText || ''}
                    btn1={alertProps?.btn1}
                    btn2={alertProps?.btn2}
                />
            )}

        </div>
    )
}

export default Setting
