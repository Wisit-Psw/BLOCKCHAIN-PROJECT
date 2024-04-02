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
        // const tmpData:CartData[] = []
        
        // for (let index = 0; index < 100; index++) {
        //     const element:CartData = {
        //         cartId:index,
        //         supEmail:index+"asd",
        //         shopName:'shop '+index,
        //         totalPrice:9999,
        //         totalQuantity:9,
        //         productList:[
        //             {
        //                 id:0,
        //                 image:'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
        //                 name:'product0',
        //                 price:1111,
        //                 quantity:3,
        //                 sumPrice:3333
        //             },{
        //                 id:1,
        //                 image:'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
        //                 name:'product1',
        //                 price:1111,
        //                 quantity:3,
        //                 sumPrice:3333
        //             },{
        //                 id:2,
        //                 image:'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
        //                 name:'product2',
        //                 price:1111,
        //                 quantity:3,
        //                 sumPrice:3333
        //             }
        //         ]
        //     }
        //     tmpData.push(element)
        // }
        // setCartList(tmpData)
    },[])

    return (
        <div className='cart-page-container'>
            <div className="table">
                {/* <div className="thead">
                    <div className="trow">
                        <div className="th product">Product</div>
                        <div className="th unit-price">Unit Price</div>
                        <div className="th quantity">Quantity</div>
                        <div className="th total-price">Total Price</div>
                        <div className="th action">Action</div>
                    </div>
                </div> */}
                <div className="tbody">
                    {cartList.map((cart: CartData, index: number) => (
                        <ProductRow key={index} indexProps={index} cartProps={cart} getCartData={getCartData}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Cart
