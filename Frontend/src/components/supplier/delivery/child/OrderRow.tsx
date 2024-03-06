import './OrderRow.css'
import { useState } from 'react'

interface OrderProps {
    index: number,
    order: deliveryData
}

function OrderRow(props: OrderProps) {
    const { index, order } = props;
    const [isProductListShow, setProductListShow] = useState(true as boolean);

    const showProductList = () => {
        const orderListEle = document.getElementById("orderList" + index)
        if (orderListEle) {
            setProductListShow(!isProductListShow)
            if (isProductListShow) {
                orderListEle.style.height = '10rem'
                orderListEle.style.overflow = 'auto';

            } else {
                orderListEle.style.height = '0px';
                orderListEle.style.overflow = 'hidden';
            }
        }
    }

    return (
        <>
            <div className="trow" onClick={showProductList}>
                <div className="td order">{order.orderData.orderId}</div>
                <div className="td price">{order.orderData.price}</div>
                <div className="td address">{order.address}</div>
                <div className="td status">{order.status}</div>
            </div>
            {order.orderData.productList.map((product: orderProductData, id: number) => (
                <div className="order-list pd-trow" id={"orderList" + index} key={id}>
                    <div className="td id">{product.id}</div>
                    <div className="td name">{product.name}</div>
                    <div className="td price">{product.price}</div>
                    <div className="td quantity">{product.quantity}</div>
                </div>
            ))
            }

        </>

    )
}

export default OrderRow
