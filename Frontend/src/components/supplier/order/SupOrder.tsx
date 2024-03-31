import './SupOrder.css'
import { useState, useEffect } from 'react';
import ProductRow from './child/ProductRow';

function SupOrder() {

    const [cartList, setCartList] = useState([] as OrderData[])

    useEffect(() => {
        const tmpData: OrderData[] = []
        const d = (new Date()).toISOString()
        for (let index = 0; index < 100; index++) {
            const element: OrderData = {
                orderId: index,
                shopName: 'shop ' + index,
                totalPrice: 9999,
                cusEmail: '',
                createDate: d,
                createTxId: '',
                sendDate: d,
                sendTxId: '',
                approvDate: d,
                approvTxId: '',
                status: "Success",
                productList: [
                    {
                        id: 0,
                        image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                        name: 'product0',
                        price: 1111,
                        quantity: 3,
                    }, {
                        id: 1,
                        image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                        name: 'product1',
                        price: 1111,
                        quantity: 3,
                    }, {
                        id: 2,
                        image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                        name: 'product2',
                        price: 1111,
                        quantity: 3,
                    }
                ]
            }
            tmpData.push(element)
        }
        setCartList(tmpData)
    }, [])

    return (
        <div className='cart-page-container'>
            <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th order">เลขที่คำสั่งซื้อ</div>
                        <div className="th status">สถานะ</div>
                    </div>
                </div>
                <div className="tbody">
                    {cartList.map((order: OrderData, index: number) => (
                        <ProductRow key={index} index={index} order={order} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SupOrder
