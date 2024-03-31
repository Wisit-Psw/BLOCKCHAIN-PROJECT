import './Setting.css'
import { useState } from 'react'
function Setting() {
    const [isEditState, setEditState] = useState(false);
    return (
        <div className='setting-page-container'>
            <div className="setting-page-header">
                ตั้งค่าข้อมูลาส่วนตัว
            </div>
            <div className="page-content">
                <div className="info-container">
                    <div className="infomation-text">
                        {!isEditState && (
                            <>
                                <div className="feild-wrap">
                                    <div className="feild-name">อีเมล</div>
                                    <div className="feild-data">Wisit@gmail.com</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">ชื่อ-สกุล</div>
                                    <div className="feild-data">Wisit Poonsawat</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">มือถือ</div>
                                    <div className="feild-data">061407780</div>
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">ที่อยู่</div>
                                    <div className="feild-data">1/1 bankok 10100</div>
                                </div>
                            </>
                        )
                        } {isEditState && (
                            <>
                                <div className="feild-wrap">
                                    <div className="feild-name">อีเมล</div>
                                    <input type="text" />
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">ชื่อ-สกุล</div>
                                    <input type="text" />
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">มือถือ</div>
                                    <input type="text" />
                                </div>
                                <div className="feild-wrap">
                                    <div className="feild-name">ที่อยู่</div>
                                    <input type="text" />
                                </div>
                            </>
                        )
                        }
                    </div>
                </div>
                {!isEditState && (
                    <div className="btn-container">
                        <div className="btn team-btn text-white" onClick={() => { setEditState(!isEditState) }}>อัพเดท</div>
                    </div>
                )}
                {isEditState && (
                    <div className="btn-container">
                        <div className="btn bg-light-gray text-white" onClick={() => { setEditState(!isEditState) }}>ยกเลิก</div>
                        <div className="btn team-btn text-white" onClick={() => { setEditState(!isEditState) }}>อัพเดท</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Setting
