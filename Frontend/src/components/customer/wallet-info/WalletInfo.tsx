
import './WalletInfo.css';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { environments } from '../../../environment/environment';
import { useParams } from 'react-router-dom';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { userCliend } from '../../../user-data/UserData';
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

function WalletInfo() {
    const [creditPay, setCreditPay] = useState(0);
    const [slipImage, setSlipImage] = useState('');
    const [qrURL, setQrURL] = useState('');
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
        setCreditPay(wallet.creditTotal - (wallet.creditAmount || 0))
    }

    const handleCreditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreditPay(Number(event.target.value));
        setQrURL(`https://promptpay.io/${userCliend.userData?.userData.phone}/${Number(event.target.value)}`);
    }

    const genQr = () => {
        setQrURL(`https://promptpay.io/${userCliend.userData?.userData.phone}/${creditPay}`);
    }

    const calcelPay = () => {
        setSlipImage('');
        setCreditPay(0);
        setQrURL('');
        setPayState(false);
    }

    const submitPay = async () => {
        const response = await axios.post(environments.paths.creditPayment, {
            supEmail: wallet.supEmail,
            totalPayment: creditPay,
            slipImage: slipImage,
        }, { withCredentials: true })

        if (response.status !== 200) {
            handleAlert({
                headerText: "ชำระเงิน",
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
            headerText: "ชำระเงิน",
            contentText: "ชำระเงินสำเร็จ รอการยืนยันจากผู้ขาย",
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


    const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result;
                    if (base64String) {
                        setSlipImage(String(base64String));
                    } else {
                        setSlipImage('');
                    }
                };
                reader.readAsDataURL(file);
            }
        }

    };

    const getWalletData = async () => {
        try {
            const response = await axios.get(environments.paths.getCusWalletInfo + `/${id}`, { withCredentials: true });
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
    }, [creditPay])

    return (
        <div className='wallet-info-page-container'>
            <div className='wallet-info-list'>
                <div className="wallet-info-list-shop-name">
                    {wallet.shopName}
                </div>
                <div className='wallet-info-list-info'>
                    <div className="wallet-info-info">
                        <div className="wallet-info-create-date row">
                            <div className='wallet-info-topic'>เครดิตทั้งหมด : </div>
                            <div> {wallet.creditTotal}</div>
                        </div>
                        <div className="wallet-info-send-date row">
                            <div className='wallet-info-topic'>เครดิตคงเหลือ : </div>
                            <div> {wallet.creditAmount}</div>
                        </div>
                        <div className="wallet-info-send-date row">
                            <div className='wallet-info-topic'>เครดิตที่ใช้ไป : </div>
                            <div> {wallet.creditTotal - (wallet.creditAmount || 0)}</div>
                        </div>
                    </div>
                    <div className="wallet-info-list-shop-detail">
                        {wallet.creditTotal - (wallet.creditAmount || 0) > 0 && (<div className="btn pay-btn" onClick={handlePayState}>จ่ายเงิน</div>)}
                        {/* <div className='wallet-info-topic'><FontAwesomeIcon icon={faAngleRight} /></div> */}
                    </div>
                </div>
            </div>

            <div className="wallet-history-list">
                <div className="wallet-history-label">
                    รายการ
                </div>
                {wallet.history && wallet.history.map((info: walletHistoryData, index: number) => (
                    <div className='wallet-info-list' key={index}>
                        <div className="wallet-info-header">
                            <div className="wallet-info-type">
                                {historyType[info.updateType]}
                            </div>
                            <div className={"wallet-info-update " + ((info.updateType === "Add" || info.updateType === "Payment") ? "text-green" : "text-red")}>
                                {info.status !== "Reject" ? (((info.updateType === "Add" || info.updateType === "Payment") ? "+" : "-") + info.creditUpdate) : ""}
                            </div>
                        </div>

                        <div className="wallet-info-body">
                            <div className="wallet-info-wrap" >
                                <div className="wallet-info-label">
                                    เครดิตทั้งหมด :
                                </div>
                                {info.creditTotal}
                            </div>
                            <div className="wallet-info-wrap" >
                                <div className="wallet-info-label">
                                    {historyType[info.updateType]} :
                                </div>
                                {info.creditUpdate}
                            </div>
                            <div className="wallet-info-wrap" >
                                <div className="wallet-info-label">
                                    เครดิตที่ใช้งานได้ :
                                </div>
                                {info.creditAmount}
                            </div>
                            <div className="wallet-info-wrap" >
                                <div className="wallet-info-label">
                                    วันที่ทำรายการ :
                                </div>
                                {info.requestsDate?.split('T')[0] + " " + info.requestsDate?.split('T')[1].slice(0, 5)}
                            </div>

                            <div className="wallet-info-wrap" >
                                <div className="wallet-info-label">
                                    วันที่อนุมัติ :
                                </div>
                                {(info.approvDate?.split('T')[0] || "") + " " + (info.approvDate?.split('T')[1].slice(0, 5)||"")}
                            </div>

                            <div className="wallet-info-wrap" >
                                <div className="wallet-info-label">
                                    รหัสรายการ :
                                </div>
                                <div className="txid">{info.txId} </div>
                            </div>
                            <div className="wallet-info-wrap" >
                                <div className="wallet-info-label">
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
                        <div className="pay-modal">
                            <div className="modal-header">
                                ชำระเงิน
                            </div>
                            <div className="modal-body">
                                <div className="wallet-info-wrap" >
                                    <div className="wallet-info-label quantity-label">
                                        จำนวน :
                                    </div>
                                    <input type="number" id="credit-pay-input" value={creditPay} onChange={handleCreditChange} min={1} max={wallet.creditTotal - (wallet.creditAmount || 0)} />
                                    <div className="btn qr-btn" onClick={genQr}>
                                        สร้าง QR
                                    </div>
                                </div>
                                <div className="spli-img-container">
                                    {slipImage !== '' && (
                                        <div className='spli-img-wrap'>
                                            <img src={slipImage} alt="" className="spli-img" />
                                            <div className="close-icon" onClick={() => { setSlipImage('') }}>
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            </div>
                                        </div>
                                    )}
                                    {slipImage === '' && (
                                        <div className='spli-img-wrap'>
                                            <img src={qrURL} alt="" className="spli-img" />
                                            <div className="close-icon" onClick={() => { setSlipImage('') }}>
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            </div>
                                            <input type="file" className="spli-img-input" placeholder='แนบหลักฐานการชำระเงิน' name="" onChange={handleImageInputChange} />

                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="btn-wrap">
                                <div className="btn bg-light-gray" onClick={calcelPay}>ยกเลิก</div>
                                {slipImage !== '' && (<div className="btn sbmt-btn" onClick={submitPay}>ยืนยัน</div>)}
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

export default WalletInfo
