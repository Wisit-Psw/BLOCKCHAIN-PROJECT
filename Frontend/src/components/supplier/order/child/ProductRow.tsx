import './ProductRow.css'
import { useState } from 'react'

interface ProductRowProps {
    index: number,
    order: OrderData
}

function ProductRow(props: ProductRowProps) {
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
                <div className="td order">{order.orderId}</div>
                <div className="td customer">{order.cusEmail}</div>
                <div className="td status">{order.status}</div>
            </div>
            <div className="order-list" id={"orderList" + index}>
                {order.productList.map((product: orderProductData, id: number) => (
                    <div className="pd-trow" key={id}>
                        <div className="td pd-trow-image">
                            <img className='pd-row-image' src={product.image} alt="" />
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

export default ProductRow
