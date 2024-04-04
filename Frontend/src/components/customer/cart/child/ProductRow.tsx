import './ProductRow.css';
import QuantityButton from '../../../commons/quantity-button/QuantityButton';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Alert from '../../../commons/alert/Alert';
import axios from 'axios';
import { environments } from '../../../../environment/environment';
import { Link } from 'react-router-dom';

interface ProductRowProps {
    indexProps: number,
    cartProps: CartData,
    getCartData: () => void
}

function ProductRow(props: ProductRowProps) {

    const { indexProps, cartProps, getCartData } = props;

    const [index, setIndex] = useState(indexProps);
    const [cart, setCart] = useState(cartProps);

    const [isAlert, setisAlert] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }

    const payment = async () => {
        try {
            setAlertProps({
                headerText: 'ชำระเงิน',
                contentText: 'ยืนยันการชำระเงินหรือไม่',
                btn1: {
                    btnText: 'ยืนยัน',
                    btnFunc: async () => { await submitPayment() }
                },
                btn2: {
                    btnText: 'ยกเลิก',
                    btnFunc: () => { setisAlert(false) }
                }
            })
            setisAlert(true);
        } catch (e) {
            console.error(e)
            handleAlert({
                headerText: "ชำระเงิน",
                contentText: "มีข้อผิดพลาดเกินขึ้น กรุณาตรวจสอบจำนวนเครดิต",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => {
                        setisAlert(false);
                    }
                }
            })
        }
    }

    const submitPayment = async () => {
        try {
            const response = await axios.post(environments.paths.createOrder, {
                cartId: cart.cartId,
                supEmail: cart.supEmail,
                totalPrice: cart.totalPrice,
                productList: cart.productList
            }, { withCredentials: true });
            if (response.status) {
                setAlertProps({
                    headerText: 'ชำระเงิน',
                    contentText: 'รอผู้ขายยืนยันออเดอร์',
                    btn1: {
                        btnText: 'ยืนยัน',
                        btnFunc: async () => {
                            setisAlert(false);
                            getCartData();
                        }
                    }
                })
            }
        } catch (error) {
            console.error(error);
            handleAlert({
                headerText: "ชำระเงิน",
                contentText: "มีข้อผิดพลาดเกินขึ้น กรุณาตรวจสอบจำนวนเครดิต",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => {
                        setisAlert(false);
                    }
                }
            })
        }
    }

    const change = async (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        if (index !== undefined) {
            const updatedCart = { ...cart };

            if (cart.productList[index].productQuantity <= Number(event?.target?.value) || Number(event?.target?.value) < 0) {
                setCart(updatedCart);
                return
            }

            updatedCart.totalQuantity -= updatedCart.productList[index].quantity;
            updatedCart.totalPrice -= updatedCart.productList[index].productPrice * updatedCart.productList[index].productQuantity;

            updatedCart.productList[index].quantity = Number(event?.target?.value);
            updatedCart.totalQuantity += Number(event?.target?.value);
            updatedCart.totalPrice += updatedCart.productList[index].productPrice * Number(event?.target?.value);

            const res = await axios.post<ProductData>(`${environments.paths.updateProductInCart}`, {
                cartId: cart.cartId,
                productId: updatedCart.productList[index].productId,
                quantity: updatedCart.productList[index].quantity,
                supEmail: updatedCart.productList[index].supEmail
            }, { withCredentials: true });

            if (res.status === 200) {
                setCart(updatedCart);
            }
        }
    }

    const add = async (index?: number) => {
        if (index !== undefined) {
            const updatedCart = { ...cart };

            if (cart.productList[index].productQuantity < cart.productList[index].quantity + 1) {
                setCart(updatedCart);
                return;
            }

            updatedCart.productList[index].quantity += 1;
            updatedCart.totalQuantity += 1;
            updatedCart.totalPrice += updatedCart.productList[index].productPrice;

            const res = await axios.post<ProductData>(`${environments.paths.updateProductInCart}`, {
                cartId: cart.cartId,
                productId: updatedCart.productList[index].productId,
                quantity: updatedCart.productList[index].quantity,
                supEmail: updatedCart.productList[index].supEmail
            }, { withCredentials: true });

            if (res.status === 200) {
                setCart(updatedCart);
            }
        }
    }

    const minus = async (index?: number) => {
        if (index !== undefined && cart.productList[index].quantity > 1) {
            const updatedCart = { ...cart };
            updatedCart.productList[index].quantity -= 1;
            updatedCart.totalQuantity -= 1;
            updatedCart.totalPrice -= updatedCart.productList[index].productPrice;

            const res = await axios.post<ProductData>(`${environments.paths.updateProductInCart}`, {
                cartId: cart.cartId,
                productId: updatedCart.productList[index].productId,
                quantity: updatedCart.productList[index].quantity,
                supEmail: updatedCart.productList[index].supEmail
            }, { withCredentials: true });

            if (res.status === 200) {
                setCart(updatedCart);
            }
        }
    }

    const handleDelBtn = (cartProdId: number) => {
        if (!isAlert) {
            setAlertProps({
                headerText: 'ออกจากระบบ',
                contentText: 'ยืนยันการออกจากระบบหรือไม่',
                btn1: {
                    btnText: 'ยืนยัน',
                    btnFunc: async () => { await submitDel(cartProdId) }
                },
                btn2: {
                    btnText: 'ยกเลิก',
                    btnFunc: () => { setisAlert(false) }
                }
            })
        }
        setisAlert(!isAlert)
    }

    const submitDel = async (cartProdId: number) => {
        try {
            const response = await axios.delete(environments.paths.deleteProductInCart + `?cartId=${cart.cartId}&cartProdId=${cartProdId}`, { withCredentials: true });
            if (response.status === 200) {
                setisAlert(false);
                getCartData()
            }
        } catch (error) {
            console.error('Login error:', (error as Error).message || 'An error occurred');
        }
    }

    useEffect(() => {
        setIndex(indexProps)
        setCart(cartProps)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartProps])

    return (
        <div className='trow-wrap'>
            <div className="trow ">
                <div className="td product cart-pdrow-shop-name">{cart.shopName}</div>
            </div>
            <div className="card-order-list" id={"card-orderList" + index}>
                {cartProps.productList.map((product: cartProductData, id: number) => (
                    <div className="card-pd-trow" key={id}>
                        <Link to={"/product/" + product.productId}>
                            <div className="td prod-image">
                                <img className="img" src={product.productImage} alt="" />
                            </div>
                        </Link>
                        <div className="td info">
                            <div className="info-data">{product.productName}</div>
                            <div className="info-data">
                                <QuantityButton id={id} quantity={product.quantity} add={add} minus={minus} change={change} />
                            </div>
                            <div className="info-data">{product.productPrice} บาท</div>
                        </div>
                        <div className="td delete-btn" onClick={() => { handleDelBtn(product.cartProdId) }}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </div>
                    </div>
                ))}
                <div className="summary-box">
                    <div className="total-price">รวม {cart.totalQuantity} ชิ้น {cart.totalPrice} บาท</div>
                    <div className="pay-btn btn team-btn text-white" onClick={payment}>
                        ชำระเงิน
                    </div>
                </div>

            </div>
            {isAlert && (
                <Alert
                    headerText={alertProps?.headerText || ''}
                    contentText={alertProps?.contentText || ''}
                    btn1={alertProps?.btn1}
                    btn2={alertProps?.btn2}
                />
            )}
        </div>
    )
}

export default ProductRow
