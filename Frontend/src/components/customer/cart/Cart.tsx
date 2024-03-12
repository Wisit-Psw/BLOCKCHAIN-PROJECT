import './Cart.css'
import { useState,useEffect } from 'react';
import ProductRow from './child/ProductRow';

function Cart() {

    const [cartList,setCartList] = useState([] as cartData[])

    useEffect(()=>{
        const tmpData:cartData[] = []
        
        for (let index = 0; index < 100; index++) {
            const element:cartData = {
                shopId:index,
                shopName:'shop '+index,
                totalPrice:9999,
                totalQuantity:9,
                productList:[
                    {
                        id:0,
                        image:'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                        name:'product0',
                        price:1111,
                        quantity:3,
                        sumPrice:3333
                    },{
                        id:1,
                        image:'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                        name:'product1',
                        price:1111,
                        quantity:3,
                        sumPrice:3333
                    },{
                        id:2,
                        image:'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                        name:'product2',
                        price:1111,
                        quantity:3,
                        sumPrice:3333
                    }
                ]
            }
            tmpData.push(element)
        }
        setCartList(tmpData)
    },[])

    return (
        <div className='cart-page-container'>
            <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th product">Product</div>
                        <div className="th unit-price">Unit Price</div>
                        <div className="th quantity">Quantity</div>
                        <div className="th total-price">Total Price</div>
                        <div className="th action">Action</div>
                    </div>
                </div>
                <div className="tbody">
                    {cartList.map((cart: cartData, index: number) => (
                        <ProductRow key={index} indexProps={index} cartProps={cart} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Cart
