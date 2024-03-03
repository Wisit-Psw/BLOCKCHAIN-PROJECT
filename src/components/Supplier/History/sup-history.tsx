import './sup-history.css'
import { useState, useEffect } from 'react'
import OrderRow from './Child/order-row';

function SupHistory() {

    const [orderList, setOrderList] = useState([] as historyData[]);

    useEffect(() => {
        const orderList: historyData[] = []
        for (let index = 0; index < 100; index++) {
            const elementShop: historyData = {
                orderData: {
                    orderId: index,
                    price: 9999,
                    productList: [
                        {
                            id: 0,
                            name: 'Product 1',
                            price: 9999,
                            quantity: 3
                        }, {
                            id: 1,
                            name: 'Product 2',
                            price: 9999,
                            quantity: 3
                        }, {
                            id: 2,
                            name: 'Product 3',
                            price: 9999,
                            quantity: 3
                        }
                    ]
                },
                status: 'success'
            };
            orderList.push(elementShop);
        }
        setOrderList(orderList)
    }, [])

    return (
        <div className='history-page-container'>
            <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th order">Order</div>
                        <div className="th price">Price</div>
                        {/* <div className="th address">Address</div> */}
                        <div className="th status">Status</div>
                    </div>
                </div>
                <div className="tbody">
                    {orderList.map((order: historyData, index: number) => (
                        <OrderRow key={index} index={index} order={order} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SupHistory
