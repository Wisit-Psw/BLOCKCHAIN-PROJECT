import './Setting.css'
import { useState } from 'react'
function Setting() {
    const [isEditState, setEditState] = useState(false);
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
                                    <div className="feild-name">Email</div>
                                    <div className="feild-data">shop1@gmail.com</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">Shop Name</div>
                                    <div className="feild-data">shop1</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">Phone</div>
                                    <div className="feild-data">061407780</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">Address</div>
                                    <div className="feild-data">1/1 bankok 10100</div>
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
                        <div className="btn text-white setting-update-btn" onClick={() => { setEditState(!isEditState) }}>Update</div>
                    </div>
                )}
                {isEditState && (
                    <div className="btn-container">
                        <div className="btn bg-light-gray text-white setting-update-btn" onClick={() => { setEditState(!isEditState) }}>Cancel</div>
                        <div className="btn text-white setting-update-btn" onClick={() => { setEditState(!isEditState) }}>Update</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Setting
