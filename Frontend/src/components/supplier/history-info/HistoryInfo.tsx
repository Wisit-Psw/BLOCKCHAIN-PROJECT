import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { environments } from '../../../environment/environment';
import './HistoryInfo.css'
import { useState, useEffect } from 'react'
import Alert from '../../commons/alert/Alert';
// import OrderRow from './child/OrderRow';

const historyStatus = {
    Success: "สำเร็จ",
    Reject: "ถูกปฏิเสธ",
    Waiting: "รอการยืนยัน",
    Sending: "กำลังจัดส่ง"
}

function SupHistoryInfo() {
    const { id } = useParams();

    const [order, setOrder] = useState<OrderData>({} as OrderData);

    const [isAlert, setisAlert] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);

    const acceptReq = async () => {
        handleAlert({
            headerText: "ยอมรับคำสั่งซื้อ",
            contentText: "ยอมรับคำสั่งซื้อใช่หรือไม่",
            btn1: {
                btnText: "ยืนยัน",
                btnFunc: () => { sumitAcceptReq() }
            },
            btn2: {
                btnText: "ยกเลิก",
                btnFunc: () => { setisAlert(false) }
            }
        })
    }

    const sumitAcceptReq = async () => {
        const response = await axios.post(environments.paths.submitOrder, {
            orderId: order.orderId,
            cusEmail: order.cusEmail
        }, { withCredentials: true });
        if (response.status === 200) {
            handleAlert({
                headerText: "ยอมรับคำสั่งซื้อ",
                contentText: "ยอมรับคำสั่งซื้อเสร็จสิ้น",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => {
                        setisAlert(false);
                        getOrderData();
                    }
                }
            })
            return
        }
        handleAlert({
            headerText: "ยอมรับคำสั่งซื้อ",
            contentText: "มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่อีกครั้ง",
            btn1: {
                btnText: "ยืนยัน",
                btnFunc: () => {
                    setisAlert(false);
                }
            }
        });
    }

    const rejectReq = async () => {
        handleAlert({
            headerText: "ปฏิเสธคำสั่งซื้อ",
            contentText: "ปฏิเสธคำสั่งซื้อใช่หรือไม่",
            btn1: {
                btnText: "ยืนยัน",
                btnFunc: () => {
                    sumitRejectReq();
                }
            },
            btn2: {
                btnText: "ยกเลิก",
                btnFunc: () => {
                    setisAlert(false);
                }
            }
        })
    }

    const sumitRejectReq = async () => {

        const response = await axios.post(environments.paths.rejectOrder, {
            cusEmail: order.cusEmail,
            orderId: order.orderId
        }, { withCredentials: true });
        if (response.status === 200) {
            handleAlert({
                headerText: "ปฏิเสธคำสั่งซื้อ",
                contentText: "ปฏิเสธคำสั่งซื้อเสร็จสิ้น",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => {
                        setisAlert(false);
                        getOrderData();
                    }
                }
            })
            return
        }
        handleAlert({
            headerText: "ปฏิเสธคำสั่งซื้อ",
            contentText: "มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่อีกครั้ง",
            btn1: {
                btnText: "ยืนยัน",
                btnFunc: () => {
                    setisAlert(false);
                }
            }
        });
    }

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }

    const getOrderData = async () => {
        try {
            const response = await axios.get(environments.paths.getSupOrderInfo + `/${id}`, { withCredentials: true });
            if (response.data) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getOrderData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useEffect(() => {
    //     getOrderData();
    // }, [])
    return (
        <div className='history-info-page-container'>
            <div className='history-info-list' >
                <div className="history-info-list-shop-name">
                    <div className="history-info-create-date row">
                        <div className='history-info-topic'>เลขที่คำสั่งซื้อ : </div>
                        <div>{order.orderId}</div>
                    </div>
                </div>
                <div className='history-info-list-row'>
                    <div className="history-info-info">
                        <div className="history-info-create-date row">
                            <div className='history-info-topic'>ชื่อร้าน : </div>
                            <div>{order.shopName}</div>
                        </div>
                        <div className="history-info-create-date row">
                            <div className='history-info-topic'>วันที่สั่งซื้อ : </div>
                            <div>{(order.createDate?.split('T')[0] || "")}</div>
                        </div>
                        <div className="history-info-create-date row">
                            <div className='history-info-topic'>รหัสการสั่งซื้อ : </div>
                            <div className='txid'>{(order.createTxId)}</div>
                        </div>
                        <div className="history-info-send-date row">
                            <div className='history-info-topic'>วันที่จัดส่ง : </div>
                            <div className='txid'>{(order.sendDate?.split('T')[0] || "")}</div>
                        </div>
                        <div className="history-info-create-date row">
                            <div className='history-info-topic'>รหัสการอนุมัติ : </div>
                            <div className='txid'>{(order.sendTxId)}</div>
                        </div>
                        <div className="history-info-approv-date row">
                            <div className='history-info-topic'>วันที่รับสินค้า : </div>
                            <div>{(order.approvDate?.split('T')[0] || "")}</div>
                        </div>
                        <div className="history-info-create-date row">
                            <div className='history-info-topic'>รหัสการเซ็นรับ : </div>
                            <div className='txid'>{(order.approvTxId)}</div>
                        </div>
                        <div className="history-info-price row">
                            <div className='history-info-topic'>ราคารวม : </div>
                            <div>{order.totalPrice}</div>
                        </div>
                        <div className="history-info-status row">
                            <div className='history-info-topic'>สถานะ : </div>
                            <div>{historyStatus[order.status]}</div>
                        </div>
                        <div className="btn-wrap">
                            {order.status === "Waiting" && (
                                <div className="btn-wrap">
                                    <div className="btn bg-red" onClick={rejectReq}>ปฏิเสธ</div>
                                    <div className="btn acc-btn" onClick={acceptReq}>ยอมรับ</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="history-info-list-shop-detail">
                </div>
            </div>
            {order.productList && order.productList.map((prod: orderProductData, index: number) => (
                // <OrderRow key={index} index={index} order={order} />
                <Link to={"/product/" + prod.productId}>
                    <div className='history-info-list' key={index}>
                        <div className="history-info-list-shop-name">
                            <div className="history-info-create-date row">
                                <div className='history-info-topic'>ชื่อสินค้า : </div>
                                <div>{prod.productName}</div>
                            </div>
                        </div>
                        <div className='history-info-list-row'>
                            <div className="history-info-image-wrap">
                                <img className='history-info-image' src={prod.productImage} alt="" />
                            </div>
                            <div className="history-info-info">
                                <div className="history-info-create-date row">
                                    <div className='history-info-topic'>จำนวน : </div>
                                    <div>{prod.quantity}</div>
                                </div>
                                <div className="history-info-send-date row">
                                    <div className='history-info-topic'>ราคาต่อชิ้น : </div>
                                    <div>{prod.productPrice}</div>
                                </div>

                            </div>
                        </div>
                        <div className="history-info-list-shop-detail">
                        </div>
                    </div>
                </Link>
            ))}
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

export default SupHistoryInfo


