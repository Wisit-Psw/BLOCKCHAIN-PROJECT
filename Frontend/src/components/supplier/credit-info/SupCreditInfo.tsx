
import './SupCreditInfo.css';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { environments } from '../../../environment/environment';
import { useParams } from 'react-router-dom';
import Alert from '../../commons/alert/Alert';

const historyType = {
    Add: "ได้รับเครดิต",
    Used: "ซื้อสินค้า",
    Decrease: "ถูกลดเครดิต",
    Payment: "ชำระหนี้",
}

const historyStatus = {
    Accept: "สำเร็จ",
    Reject: "ถูกปฏิเสธ",
    Waiting: "รอการยืนยัน"
}

function SupCreditInfo() {
    const [creditTotalUpdate, setcreditTotalUpdate] = useState(0);
    const [payState, setPayState] = useState(false);

    const [isAlert, setisAlert] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }


    const [wallet, setWallet] = useState({} as WalletData);
    const { id } = useParams();


    const handlePayState = () => {
        setPayState(!payState)
        setcreditTotalUpdate(wallet.creditTotal)
    }

    const handleCreditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setcreditTotalUpdate(Number(event.target.value));
    }

    const calcelPay = () => {
        setcreditTotalUpdate(0);
        setPayState(false);
    }

    const submitPay = async () => {
        try{
            const response = await axios.post(environments.paths.updateCreditTotal, {
                creditId: wallet.creditId,
                newCreditTotal: creditTotalUpdate
            }, { withCredentials: true })
    
            if (response.status !== 200) {
                handleAlert({
                    headerText: "อัพเดทเครดิต",
                    contentText: "มีข้อผิดพลาดเกินขึ้น",
                    btn1: {
                        btnText: "ยืนยัน",
                        btnFunc: () => {
                            setisAlert(false);
                            setPayState(false);
                            getWalletData();
                        }
                    }
                })
                return
            }
            handleAlert({
                headerText: "อัพเดทเครดิต",
                contentText: "อัพเดทเครดิตสำเร็จ",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => {
                        setisAlert(false);
                        setPayState(false);
                        getWalletData();
                    }
                }
            })
        }catch(e){
            console.error(e)
            handleAlert({
                headerText: "อัพเดทเครดิต",
                contentText: "มีข้อผิดพลาดเกินขึ้น กรุณาตรวจสอบจำนวนเครดิต",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => {
                        setisAlert(false);
                        setPayState(false);
                        getWalletData();
                    }
                }
            })
        }
        
    }

    const getWalletData = async () => {
        try {
            const response = await axios.get(environments.paths.getSupCreditInfo + `/${id}`, { withCredentials: true });
            if (response.data) {
                setWallet(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getWalletData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [creditTotalUpdate])

    return (
        <div className='sup-credit-info-page-container'>
            <div className='sup-credit-info-list'>
                <div className="sup-credit-info-list-shop-name">
                    {wallet.shopName}
                </div>
                <div className='sup-credit-info-list-info'>
                    <div className="sup-credit-info-info">
                        <div className="sup-credit-info-create-date row">
                            <div className='sup-credit-info-topic'>เครดิตทั้งหมด : </div>
                            <div> {wallet.creditTotal}</div>
                        </div>
                        <div className="sup-credit-info-send-date row">
                            <div className='sup-credit-info-topic'>เครดิตคงเหลือ : </div>
                            <div> {wallet.creditAmount}</div>
                        </div>
                        <div className="sup-credit-info-send-date row">
                            <div className='sup-credit-info-topic'>เครดิตที่ใช้ไป : </div>
                            <div> {wallet.creditTotal - (wallet.creditAmount || 0)}</div>
                        </div>
                    </div>
                    <div className="sup-credit-info-list-shop-detail">
                        <div className="btn pay-btn" onClick={handlePayState}>แก้ไข</div>
                        {/* <div className='sup-credit-info-topic'><FontAwesomeIcon icon={faAngleRight} /></div> */}
                    </div>
                </div>
            </div>

            <div className="sup-credit-history-list">
                <div className="sup-credit-history-label">
                    รายการ
                </div>
                {wallet.history && wallet.history.map((info: walletHistoryData, index: number) => (
                    <div className='sup-credit-info-list' key={index}>
                        <div className="sup-credit-info-header">
                            <div className="sup-credit-info-type">
                                {historyType[info.updateType]}
                            </div>
                            <div className={"sup-credit-info-update " + ((info.updateType === "Add" || info.updateType === "Payment") ? "text-green" : "text-red")}>
                                {info.status !== "Reject" ? (((info.updateType === "Add" || info.updateType === "Payment") ? "+" : "-") + info.creditUpdate) : ""}
                            </div>
                        </div>

                        <div className="sup-credit-info-body">
                            <div className="sup-credit-info-wrap" >
                                <div className="sup-credit-info-label">
                                    เครดิตทั้งหมด :
                                </div>
                                {info.creditTotal}
                            </div>
                            <div className="sup-credit-info-wrap" >
                                <div className="sup-credit-info-label">
                                    {historyType[info.updateType]} :
                                </div>
                                {info.creditUpdate}
                            </div>
                            <div className="sup-credit-info-wrap" >
                                <div className="sup-credit-info-label">
                                    เครดิตที่ใช้งานได้ :
                                </div>
                                {info.creditAmount}
                            </div>
                            <div className="sup-credit-info-wrap" >
                                <div className="sup-credit-info-label">
                                    วันที่ทำรายการ :
                                </div>
                                {info.requestsDate?.split('T')[0] + " " + info.requestsDate?.split('T')[1].slice(0, 5)}
                            </div>

                            <div className="sup-credit-info-wrap" >
                                <div className="sup-credit-info-label">
                                    วันที่อนุมัติ :
                                </div>
                                {(info.approvDate?.split('T')[0] || "") + " " + (info.approvDate?.split('T')[1].slice(0, 5) || "")}
                            </div>

                            <div className="sup-credit-info-wrap" >
                                <div className="sup-credit-info-label">
                                    รหัสรายการ :
                                </div>
                                {info.txId}
                            </div>
                            <div className="sup-credit-info-wrap" >
                                <div className="sup-credit-info-label">
                                    สถานะ :
                                </div>
                                {historyStatus[info.status]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {payState && (
                <>
                    <div className="backdrop">
                        <div className="sup-credit-update-modal ">
                            <div className="modal-header">
                                ชำระเงิน
                            </div>
                            <div className="modal-body">
                                <div className="sup-credit-info-wrap" >
                                    <div className="sup-credit-info-label quantity-label">
                                        เครติดทั้งหมด :
                                    </div>
                                    <input type="number" id="credit-pay-input" value={creditTotalUpdate} onChange={handleCreditChange} min={1} max={wallet.creditTotal - (wallet.creditAmount || 0)} />
                                </div>
                            </div>
                            <div className="btn-wrap">
                                <div className="btn bg-light-gray" onClick={calcelPay}>ยกเลิก</div>
                                <div className="btn sbmt-btn" onClick={submitPay}>ยืนยัน</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isAlert && (
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

export default SupCreditInfo
