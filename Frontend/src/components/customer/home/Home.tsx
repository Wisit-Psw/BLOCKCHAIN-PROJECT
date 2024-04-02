import './Home.css';
import { useEffect, useState } from 'react';
import ProductBox from './child/ProductBox';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const [isRequestModalShow, setRequestModalShow] = useState<boolean>(false);
    const [shopList, setShopList] = useState<ShopData[]>([]);
    const [currentShop, setCurrentShop] = useState<ShopData>();
    const [productList, setProductList] = useState<ProductData[]>([]);
    const [changeShopState, setChangeShopState] = useState<boolean>(true);
    // const [credit, setCredit] = useState<CreditData | null>(null);

    const selectShop = (shop: ShopData) => {
        // setCredit({
        //     shopName: shop.shop_name,
        //     creditAmount: shop.creditAmount
        // });
        setChangeShopState(!changeShopState)
        setCurrentShop(shop)
    };

    // const getShopList = async () => {
    //     try {
    //         const response = await axios.get<ShopData[]>(environments.paths.getShopList, { withCredentials: true });
    //         if (response) {
    //             setShopList([...response.data])
    //             setCredit({
    //                 shopName: response.data[0].shop_name,
    //                 creditAmount: response.data[0].creditAmount
    //             })
    //             getProductList(response.data[0].email);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const getProductList = async (supId: string) => {
    //     try {
    //         const response = await axios.get<ProductData[]>(`${environments.paths.getProduct}?supId=${btoa(supId)}`, { withCredentials: true });
    //         if (response.data) {
    //             setProductList(response.data);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    useEffect(() => {
        const tempProdList: ProductData[] = [];
        for (let index = 0; index < 100; index++) {
            const element: ProductData = {
                productId: index,
                productImage: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                productName: 'Product' + index,
                productDescription: '',
                productQuantity: 0,
                productPrice: 9999,
            };
            tempProdList.push(element);
        }
        setProductList(tempProdList);

        const tempShopList: ShopData[] = [];
        for (let index = 0; index < 100; index++) {
            const elementShop: ShopData = {
                image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                shop_name: 'Shop' + index,
                email: 'Shop' + index,
                creditAmount: 999
            };
            tempShopList.push(elementShop);
        }
        setShopList(tempShopList);
        // setCredit({
        //     shopName: tempShopList[0].shop_name,
        //     creditAmount: tempShopList[0].creditAmount,
        // });
        // setCurrentShop(tempShopList[0])

        // getShopList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='home-page-container'>
            <div className="search-container cus-home-search text-light-gray">
                <div className="search-icon">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="ค้นหา"
                    />
                </div>
            </div>
            {
                currentShop && (
                    <>
                        <div className="current-shop">
                            <div className="shop-image-wrap">
                                <img className='shop-image' src={"" + currentShop?.image} alt="" />
                            </div>
                            <div className="shop-info">
                                <div className="shop-name">ชื่อร้าน : {currentShop.shop_name}</div>
                                <div className="shop-credit">เครดิตคงเหลือ : {currentShop.creditAmount}</div>
                            </div>
                            <div className="change-btn" onClick={() => { setChangeShopState(!changeShopState) }}>
                                เปลี่ยน
                            </div>
                        </div>
                    </>
                )
            }
            {
                (
                    <div className="shop-list" style={
                        (currentShop && !changeShopState) ? {
                            height: '0px',
                            margin: '0',
                            padding: '0',
                            overflow: 'hidden'
                        } : {
                            height: '60dvh'
                        }}>
                        {shopList && shopList.map((shop, index) => (
                            // <div className='shop-list-order' key={index} onClick={() => {
                            //     selectShop(shop)
                            // }}>{shop.shop_name}</div>
                            <div
                                className="shop-list-order"
                                key={index}
                                onClick={() => {
                                    selectShop(shop)
                                }}>
                                <div className="shop-image-wrap">
                                    <img className='shop-image' src={"" + shop?.image} alt="" />
                                </div>
                                <div className="shop-info">
                                    <div className="shop-name">ชื่อร้าน : {shop.shop_name}</div>
                                    <div className="shop-credit">เครดิตคงเหลือ : {shop.creditAmount}</div>
                                </div>

                                <div className="change-btn">
                                    {
                                        shop.email === currentShop?.email && (
                                            "ร้านปัจจุบัน"
                                        )
                                    }
                                </div>

                            </div>
                        ))}
                    </div>
                )
            }


            {/* </div> */}
            <div className="product-list" style={
                (currentShop && !changeShopState) ? {
                    height: '60dvh'
                } : {
                    height: '0px'
                }}>
                {productList && productList.map((product, index) => (
                    <Link to={'/product/' + product.productId} key={index}><ProductBox product={product} /></Link>
                ))}
            </div>
            {/* <div className="credit-box">
                {credit && (
                    <>
                        <div className='credit-shop-name'>{credit.shopName}</div>
                        <div className='credit-credit-amount'><label>Credit:</label> <label>{credit.creditAmount}</label></div>
                    </>
                )}
                <div className='request-credit' onClick={() => setRequestModalShow(true)}>Request Credit</div>
            </div> */}

            {isRequestModalShow && (
                <>
                    <div className="card alert-container bg-ele-team">
                        {/* Modal Content */}
                    </div>
                    <div className="backdrop" onClick={() => setRequestModalShow(false)}></div>
                </>
            )}
        </div>
    );
}

export default Home;
