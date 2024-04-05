import './SupOrder.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { environments } from '../../../environment/environment';
import OrderRow from './child/OrderRow';

function SupOrder() {

    const [orderList, setOrderList] = useState([] as OrderData[])

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
