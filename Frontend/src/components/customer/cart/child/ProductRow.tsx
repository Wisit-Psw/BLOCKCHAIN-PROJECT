import './ProductRow.css';
import QuantityButton from '../../../commons/quantity-button/QuantityButton';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
interface ProductRowProps {
    indexProps: number,
    cartProps: cartData
}

function ProductRow(props: ProductRowProps) {
    const { indexProps, cartProps } = props;

    const [index, setIndex] = useState(indexProps);
    const [cart, setCart] = useState(cartProps);

    const change = (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        if (index !== undefined) {
            const updatedCart = { ...cart };

            updatedCart.totalQuantity -= updatedCart.productList[index].quantity;
            updatedCart.totalPrice -= updatedCart.productList[index].price * updatedCart.productList[index].quantity;

            updatedCart.productList[index].quantity = Number(event?.target?.value);
            updatedCart.totalQuantity += Number(event?.target?.value);
            updatedCart.totalPrice += updatedCart.productList[index].price * Number(event?.target?.value);
            setCart(updatedCart);
        }
    }

    const add = (index?: number) => {
        if (index !== undefined) {
            const updatedCart = { ...cart };
            updatedCart.productList[index].quantity += 1;
            updatedCart.totalQuantity += 1;
            updatedCart.totalPrice += updatedCart.productList[index].price;
            setCart(updatedCart);
        }
    }

    const minus = (index?: number) => {
        if (index !== undefined && cart.productList[index].quantity > 1) {
            const updatedCart = { ...cart };
            updatedCart.productList[index].quantity -= 1;
            updatedCart.totalQuantity -= 1;
            updatedCart.totalPrice -= updatedCart.productList[index].price;
            setCart(updatedCart);
        }
    }

    useEffect(() => {
        setIndex(indexProps)
        setCart(cartProps)
    }, [indexProps, cartProps])

    return (
        <div className='trow-wrap'>
            <div className="trow ">
                <div className="td product cart-pdrow-shop-name">{cart.shopName}</div>
            </div>
            <div className="card-order-list" id={"card-orderList" + index}>
                {cartProps.productList.map((product: orderProductData, id: number) => (
                    <div className="card-pd-trow" key={id}>
                        <div className="td prod-image">
                            <img className="img" src={product.image} alt="" />
                        </div>
                        <div className="td info">
                            <div className="info-data">{product.name}</div>
                            <div className="info-data">
                                <QuantityButton id={id} quantity={product.quantity} add={add} minus={minus} change={change} />
                            </div>
                            <div className="info-data">{product.price} บาท</div>

                            {/* <div className="td total-price">{product.price * product.quantity}</div> */}
                        </div>
                        <div className="td delete-btn">
                            {/* delete */}
                            <FontAwesomeIcon icon={faTrashCan} />

                        </div>
                    </div>
                ))}
                <div className="summary-box">

                    <div className="total-price">รวม {cart.totalQuantity} ชิ้น {cart.totalPrice} บาท</div>
                    {/* <div className="td unit-price"></div> */}

                    {/* <div className="td total-price"></div> */}
                    <div className="pay-btn btn team-btn text-white">
                        ชำระเงิน
                    </div>
                </div>

            </div>
            {/* <div className="under-line"></div> */}
        </div>
    )
}

export default ProductRow
