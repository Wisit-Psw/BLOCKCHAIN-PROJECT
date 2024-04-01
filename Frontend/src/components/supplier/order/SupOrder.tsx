import './SupOrder.css'
import { useState, useEffect } from 'react';
// import ProductRow from './child/ProductRow';
import { faAngleRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SupOrder() {

    const [orderList, setOrderList] = useState([] as OrderData[])

    useEffect(() => {
        const tmpData: OrderData[] = []
        const d = (new Date()).toISOString()
        for (let index = 0; index < 100; index++) {
            const element: OrderData = {
                orderId: index,
                shopName: 'shop ' + index,
                totalPrice: 9999,
                cusEmail: '',
                cusName:'cus'+index,
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
        setOrderList(tmpData)
    }, [])

    return (
        <div className='order-page-container'>
            <div className="sup-order-search search-container cus-home-search text-light-gray">
                <div className="search-icon">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="ค้นหา"
                    />
                </div>
            </div>
            {orderList.map((order: OrderData, index: number) => (
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
                                <div> {order.status}</div>
                            </div>
                        </div>
                        <div className="sup-order-list-shop-detail">
                            <div className='sup-order-topic'><FontAwesomeIcon icon={faAngleRight} /></div>
                        </div>
                    </div>
                </div>
            ))}
            {/* <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th order">รหัส</div>
                        <div className="th customer">ผู้ซื้อ</div>
                        <div className="th status">สถานะ</div>
                    </div>
                </div>
                <div className="tbody">
                    {orderList.map((order: OrderData, index: number) => (
                        <ProductRow key={index} index={index} order={order} />
                    ))}
                </div>
            </div> */}
        </div>
    )
}

export default SupOrder
