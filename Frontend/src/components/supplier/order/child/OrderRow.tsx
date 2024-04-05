import './OrderRow.css'
import { useState } from 'react'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from '../../../commons/alert/Alert';
import axios from 'axios';
import { environments } from '../../../../environment/environment';

interface OrderRowProps {
    index: number,
    order: OrderData,
    getOrderData: () => void
}

const historyStatus = {
    Success: "สำเร็จ",
    Reject: "ถูกปฏิเสธ",
    Waiting: "รอการยืนยัน",
    Sending: "กำลังจัดส่ง"
}

function OrderRow(props: OrderRowProps) {

    const { index, order, getOrderData } = props;
    const [isProductListShow, setProductListShow] = useState<boolean>(true);

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
            orderId: order.orderId
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

    const showProductList = () => {
        const orderListEle = document.getElementById("orderList" + index);
        if (orderListEle) {
            setProductListShow(!isProductListShow);
            if (isProductListShow) {
                orderListEle.style.height = '10rem';
                orderListEle.style.overflow = 'auto';
            } else {
                orderListEle.style.height = '0px';
                orderListEle.style.overflow = 'hidden';
            }
        }
    }

    return (
        <div className='sup-order-list'>
            <div className="sup-order-info-wrap row order-id">
                <div className='sup-order-topic'>เลขคำสั่งซื้อ : </div>
                <div> {order.orderId}</div>
            </div>
            <div key={index} className='sup-order-list-info'>
                <div className="sup-order-info">
                    <div className="sup-order-info-wrap row">
                        <div className='sup-order-topic'>ชื่อผู้ซื้อ : </div>
                        <div> {order.cusName}</div>
                    </div>
                    <div className="sup-order-info-wrap row">
                        <div className='sup-order-topic'>สถานะ : </div>
                        <div> {historyStatus[order.status]}</div>
                    </div>
                </div>
                <div className="sup-order-list-shop-detail">
                    <div className='sup-order-topic' onClick={showProductList}><FontAwesomeIcon icon={faAngleRight} /></div>
                </div>
            </div>
            {order.status === "Waiting" && (
                <div className="btn-wrap">
                    <div className="btn bg-red" onClick={rejectReq}>ปฏิเสธ</div>
                    <div className="btn acc-btn" onClick={acceptReq}>ยอมรับ</div>
                </div>
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

export default OrderRow
