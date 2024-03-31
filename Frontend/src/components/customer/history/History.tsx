import './History.css'
import { useState, useEffect } from 'react'
// import OrderRow from './child/OrderRow';

function History() {

    const [orderList, setOrderList] = useState([] as HistoryData[]);

    useEffect(() => {
        const orderList: HistoryData[] = []
        const date = (new Date()).toISOString()
        for (let index = 0; index < 100; index++) {
            const elementShop: HistoryData = {
                orderData: {
                    orderId: index,
                    totalPrice: 9999,
                    approvDate: date.split('T')[0],
                    createDate: date.split('T')[0],
                    sendDate: date.split('T')[0],
                    approvTxId: '',
                    sendTxId: '',
                    createTxId: '',
                    cusEmail: '',
                    shopName: 'shop' + index,
                    status: "Success",
                    productList: [
                        {
                            image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                            id: 0,
                            name: 'Product 1',
                            price: 9999,
                            quantity: 3
                        }, {
                            image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                            id: 1,
                            name: 'Product 2',
                            price: 9999,
                            quantity: 3
                        }, {
                            image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                            id: 2,
                            name: 'Product 3',
                            price: 9999,
                            quantity: 3
                        }
                    ]
                },
            };
            orderList.push(elementShop);
        }
        setOrderList(orderList)
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
            {orderList.map((order: HistoryData, index: number) => (
                // <OrderRow key={index} index={index} order={order} />
                <div className='history-list'>
                    <div className="history-list-shop-name">
                        {order.orderData.shopName}
                    </div>
                    <div key={index} className='history-list-row'>
                        <div className="history-image-wrap">
                            <img className='history-image' src={order.orderData.productList[0].image} alt="" />
                        </div>
                        <div className="history-info">
                            <div className="history-create-date row">
                                <div className='history-topic'>วันที่สั่งซื้อ : </div>
                                <div>{order.orderData.createDate}</div>
                            </div>
                            {/* <div className="history-create-txid">
                            <label className='history-topic'>รหัสรายการสั่งซื้อ : </label>
                            <label>{order.orderData.createTxId}</label>
                        </div> */}
                            <div className="history-send-date row">
                                <div className='history-topic'>วันที่จัดส่ง : </div>
                                <div>{order.orderData.sendDate}</div>
                            </div>
                            {/* <div className="history-send-txid">
                            <label className='history-topic'>รหัสรายการจัดส่ง : </label>
                            <label>{order.orderData.sendTxId}</label>
                        </div> */}

                            <div className="history-approv-date row">
                                <div className='history-topic'>วันที่รับสินค้า : </div>
                                <div>{order.orderData.approvDate}</div>
                            </div>
                            {/* <div className="history-approv-txid">
                            <label className='history-topic'>รหัสรายการรับสินค้า : </label>
                            <label>{order.orderData.approvTxId}</label>
                        </div> */}
                            <div className="history-price row">
                                <div className='history-topic'>ราคารวม : </div>
                                <div>{order.orderData.totalPrice}</div>
                            </div>
                            <div className="history-status row">
                                <div className='history-topic'>สถานะ : </div>
                                <div>{order.orderData.status}</div>
                            </div>
                        </div>
                    </div>
                    <div className="history-list-shop-detail">
                        <div className='history-topic'>เพิ่มเติม</div>
                    </div>
                </div>

            ))}
        </div>
    )
}

export default History
