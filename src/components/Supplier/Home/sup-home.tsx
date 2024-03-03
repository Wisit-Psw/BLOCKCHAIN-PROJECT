import './sup-home.css'
import { useEffect, useState } from 'react'
import ProductBox from './Child/ProductBox/product-box'

function SupHome() {
    // const [isRequestModalShow, setRequestModalShow] = useState(false);

    // const [shopList, setShopList] = useState([] as shopData[]);
    const [productList, setProductList] = useState([] as productData[]);
    // const [credit, setCredit] = useState({} as creditData);

    useEffect(() => {
        const tempProdList: productData[] = [];
        for (let index = 0; index < 100; index++) {
            const element: productData = {
                image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                name: 'Product' + index,
                detail: '',
                quantity: 0,
                price: 9999,
            };
            tempProdList.push(element);
        }
        setProductList(tempProdList);
    }, []);


    return (
        <div className='home-page-container'>
            {/* <div className="shop-list">
                {shopList.map((shop) => (
                    <div className='shop-name'>{shop.name}</div>
                ))}
            </div> */}
            <div className="product-list">
                {productList.map((product, index) => (
                    <ProductBox key={index} product={product} />
                ))}
            </div>
            {/* <div className="credit-box">
                <div className='credit-shop-name'>{credit.shopName}</div>
                <div className='credit-credit-amount'><label>Credit</label> <label>{credit.creditAmount}</label></div>
                <div className='request-credit' onClick={() => setRequestModalShow(true)}>Requests Credit</div>
            </div> */}
        </div>
    )
}

export default SupHome;
