import './Home.css'
import { useEffect, useState } from 'react'
import ProductBox from './child/ProductBox'
import { Link } from 'react-router-dom';

function Home() {
    const [isRequestModalShow, setRequestModalShow] = useState(false);

    const [shopList, setShopList] = useState([] as shopData[]);
    const [productList, setProductList] = useState([] as productData[]);
    const [credit, setCredit] = useState({} as creditData);

    useEffect(() => {
        const tempProdList: productData[] = [];
        for (let index = 0; index < 100; index++) {
            const element: productData = {
                id: index,
                image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                name: 'Product' + index,
                detail: '',
                quantity: 0,
                price: 9999,
            };
            tempProdList.push(element);
        }
        setProductList(tempProdList);

        const tempShopList: shopData[] = [];
        for (let index = 0; index < 100; index++) {
            const elementShop: shopData = {
                name: 'Shop' + index,
            };
            tempShopList.push(elementShop);
        }
        setShopList(tempShopList);
        setCredit({
            shopName: 'Shop 1',
            creditAmount: 9999,
        });
    }, []);


    return (
        <div className='home-page-container'>
            <div className="shop-list">
                {shopList.map((shop, index) => (
                    <div className='shop-name' key={index}>{shop.name}</div>
                ))}
            </div>
            <div className="product-list">
                {productList.map((product, index) => (
                    <Link to={'/product/' + product.id} key={index}><ProductBox product={product} /></Link>
                ))}
            </div>
            <div className="credit-box">
                <div className='credit-shop-name'>{credit.shopName}</div>
                <div className='credit-credit-amount'><label>Credit</label> <label>{credit.creditAmount}</label></div>
                <div className='request-credit' onClick={() => setRequestModalShow(true)}>Requests Credit</div>
            </div>


            {isRequestModalShow && (
                <>
                    <div className="card alert-container bg-ele-team">
                        <label className="modal-header-text modal-shop-name">{credit.shopName}</label>
                        <div className="card-body home-card-body">
                            <div className="form-container">
                                <div className="input-container home-input-container">
                                    <div className="input-label">
                                        <label htmlFor="detail" className="controll-label modal-amount">Amount</label>
                                    </div>
                                    <div className="input-wrap">
                                        <input type="text" className="input-controller" placeholder="detail" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn-wrap">
                            <button className="btn bg-light-gray text-white" style={{ margin: '1rem 1rem 0 1rem' }} onClick={() => setRequestModalShow(false)}>Cancel</button>
                            <button className="btn bg-team-blue text-white" style={{ margin: '1rem 1rem 0 1rem' }} >Requests</button>
                        </div>
                    </div>
                    <div className="backdrop" onClick={() => setRequestModalShow(false)}></div>
                </>
            )}
        </div>
    )
}

export default Home
