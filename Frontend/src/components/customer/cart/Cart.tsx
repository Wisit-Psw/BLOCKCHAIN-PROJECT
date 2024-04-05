import './Cart.css'
import { useState,useEffect } from 'react';
import ProductRow from './child/ProductRow';
import axios from 'axios';
import { environments } from '../../../environment/environment';

function Cart() {

    const [cartList,setCartList] = useState([] as CartData[])
    const getCartData = async() => {
        try {
            const response = await axios.get<CartData[]>(environments.paths.getCartData, { withCredentials: true });
            if (response.data) {
                setCartList(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        getCartData();
    },[])

    return (
        <div className='cart-page-container'>
            <div className="table">
                <div className="tbody fullpage">
                    {cartList.map((cart: CartData, index: number) => (
                        <ProductRow key={index} indexProps={index} cartProps={cart} getCartData={getCartData}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Cart
