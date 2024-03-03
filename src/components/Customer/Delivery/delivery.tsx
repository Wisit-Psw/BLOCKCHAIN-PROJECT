import './delivery.css'
import { useEffect, useState } from 'react'
import OrderRow from './Child/OrderRow/order-row'
function Delivery() {
    const [orderList, setOrderList] = useState([] as deliveryData[]);

    useEffect(() => {
        const orderList: deliveryData[] = []
        for (let index = 0; index < 100; index++) {
            const elementShop: deliveryData = {
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
                address: '1/1 bankok',
                status: 'success'
            };
            orderList.push(elementShop);
        }
        setOrderList(orderList)
    }, [])

    return (
        <div className='delivery-page-container'>
            <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th order">Order</div>
                        <div className="th price">Price</div>
                        <div className="th address">Address</div>
                        <div className="th status">Status</div>
                    </div>
                </div>
                <div className="tbody">
                    {orderList.map((order: deliveryData, index: number) => (
                            <OrderRow key={index} index={index} order={order} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Delivery
