import './SupOrder.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { environments } from '../../../environment/environment';
import OrderRow from './child/OrderRow';

function SupOrder() {

    const [orderList, setOrderList] = useState([] as OrderData[])

    // useEffect(() => {
    //     const tmpData: OrderData[] = []
    //     const d = (new Date()).toISOString()
    //     for (let index = 0; index < 100; index++) {
    //         const element: OrderData = {
    //             orderId: index,
    //             shopName: 'shop ' + index,
    //             totalPrice: 9999,
    //             cusEmail: '',
    //             cusName:'cus'+index,
    //             createDate: d,
    //             createTxId: '',
    //             sendDate: d,
    //             sendTxId: '',
    //             approvDate: d,
    //             approvTxId: '',
    //             status: "Success",
    //             productList: [
    //                 {
    //                     id: 0,
    //                     image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
    //                     name: 'product0',
    //                     price: 1111,
    //                     quantity: 3,
    //                 }, {
    //                     id: 1,
    //                     image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
    //                     name: 'product1',
    //                     price: 1111,
    //                     quantity: 3,
    //                 }, {
    //                     id: 2,
    //                     image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
    //                     name: 'product2',
    //                     price: 1111,
    //                     quantity: 3,
    //                 }
    //             ]
    //         }
    //         tmpData.push(element)
    //     }
    //     setOrderList(tmpData)
    // }, [])

    const getOrderData = async () => {
        try {
            const response = await axios.get(environments.paths.getOrder, { withCredentials: true });
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
                <OrderRow order={order} key={index} index={index} getOrderData={getOrderData} />
            ))}
        </div>
    )
}

export default SupOrder
