import axios from 'axios';
import { environments } from '../../../environment/environment';
import './History.css'
import { useState, useEffect } from 'react'
import Alert from '../../commons/alert/Alert';
import { Link } from 'react-router-dom';
// import OrderRow from './child/OrderRow';

function History() {

    const [orderList, setOrderList] = useState([] as OrderData[]);

    const [isAlert, setisAlert] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }

    const receiveOrd = async (order: OrderData) => {
        handleAlert({
            headerText: "รับสินค้า",
            contentText: "ยืนยันการรับสินค้า",
            btn1: {
                btnText: "ยืนยัน",
                btnFunc: () => {
                    sumitReceiveOrd(order);
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

    const sumitReceiveOrd = async (order: OrderData) => {

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
            const response = await axios.get(environments.paths.getCusOrder, { withCredentials: true });
            if (response.data) {
                setOrderList(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getOrderData();
    }, [])
    return (
        <div className='history-page-container'>
            {/* <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th order">Order</div>
                        <div className="th price">Price</div>
                        <div className="th status">Status</div>
                    </div>
                </div>
                <div className="tbody">
                    {orderList.map((order: HistoryData, index: number) => (
                        <OrderRow key={index} index={index} order={order} />
                    ))}
                </div>
            </div> */}
            {orderList.map((order: OrderData, index: number) => (
                // <OrderRow key={index} index={index} order={order} />
                <div className='history-list' key={index}>
                    <div className="history-list-shop-name">
                        <div className="history-create-date row">
                            <div className='history-topic'>เลขที่คำสั่งซื้อ : </div>
                            <div>{order.orderId}</div>
                        </div>
                    </div>
                    <div className='history-list-row'>
                        <div className="history-image-wrap">
                            <img className='history-image' src={order.productList[0].productImage} alt="" />
                        </div>
                        <div className="history-info">
                            <div className="history-create-date row">
                                <div className='history-topic'>ชื่อร้าน : </div>
                                <div>{order.shopName}</div>
                            </div>
                            <div className="history-create-date row">
                                <div className='history-topic'>วันที่สั่งซื้อ : </div>
                                <div>{order.createDate?.split('T')[0]}</div>
                            </div>
                            <div className="history-send-date row">
                                <div className='history-topic'>วันที่จัดส่ง : </div>
                                <div>{order.sendDate?.split('T')[0]}</div>
                            </div>

                            <div className="history-approv-date row">
                                <div className='history-topic'>วันที่รับสินค้า : </div>
                                <div>{order.approvDate?.split('T')[0]}</div>
                            </div>
                            <div className="history-price row">
                                <div className='history-topic'>ราคารวม : </div>
                                <div>{order.totalPrice}</div>
                            </div>
                            <div className="history-status row">
                                <div className='history-topic'>สถานะ : </div>
                                <div>{order.status}</div>
                            </div>
                            {order.status === 'Sending' && (
                                <div className="btn-wrap">
                                    <div className="btn receive-ord" onClick={() => { receiveOrd(order) }}>รับสินค้า</div>

                                </div>
                            )}
                        </div>
                    </div>
                    <div className="history-list-shop-detail">
                        <Link to={"/history-info/" + order.orderId}>
                            <div className='history-topic'>เพิ่มเติม</div>
                        </Link>
                    </div>
                </div>
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

export default History

