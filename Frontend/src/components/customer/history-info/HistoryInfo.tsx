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

function HistoryInfo() {
    const { id } = useParams();

    const [order, setOrder] = useState<OrderData>({} as OrderData);

    const [isAlert, setisAlert] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }

    const receiveOrd = async () => {
        handleAlert({
            headerText: "รับสินค้า",
            contentText: "ยืนยันการรับสินค้า",
            btn1: {
                btnText: "ยืนยัน",
                btnFunc: () => {
                    sumitReceiveOrd();
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

    const sumitReceiveOrd = async () => {

        const response = await axios.put(environments.paths.receiveOrder, {
            supEmail: order.supEmail,
            orderId: order.orderId,
            totalPrice: order.totalPrice,

        }, { withCredentials: true });
        if (response.status === 200) {
            handleAlert({
                headerText: "รับสินค้า",
                contentText: "รับสินค้าเสร็จสิ้น",
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
            headerText: "รับสินค้า",
            contentText: "มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่อีกครั้ง",
            btn1: {
                btnText: "ยืนยัน",
                btnFunc: () => {
                    setisAlert(false);
                }
            }
        });
    }



    const getOrderData = async () => {
        try {
            const response = await axios.get(environments.paths.getCusOrderInfo + `/${id}`, { withCredentials: true });
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
                            <div>{(order.sendDate?.split('T')[0] || "")}</div>
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
                        {order.status === 'Sending' && (
                            <div className="btn-wrap">
                                <div className="btn receive-ord" onClick={() => { receiveOrd() }}>รับสินค้า</div>
                            </div>
                        )}
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

export default HistoryInfo


