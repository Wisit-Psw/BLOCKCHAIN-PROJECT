import './OrderRow.css'
import { useState } from 'react'

interface OrderProps {
    index: number,
    order: HistoryData
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
                <div className="td image">
                    <img src={order.orderData.productList[0].image} alt="" />
                </div>
                {/* <div className="td price">{order.orderData.price}</div>
                <div className="td status">{order.status}</div> */}
            </div>
            <div className="order-list" id={"orderList" + index}>
                {order.orderData.productList.map((product: orderProductData, id: number) => (
                    <div className="pd-trow" key={id}>
                        <div className="td image">
                            <img src={product.image} alt="" />
                        </div>
                        <div className="td name">{product.name}</div>
                        <div className="td price">{product.price}</div>
                        <div className="td quantity">{product.quantity}</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default OrderRow
