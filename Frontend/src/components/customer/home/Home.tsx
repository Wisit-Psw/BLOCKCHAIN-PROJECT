import './Home.css';
import { useEffect, useState } from 'react';
import ProductBox from './child/ProductBox';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { environments } from '../../../environment/environment';
import Alert from '../../commons/alert/Alert';

function Home() {
    const [isRequestModalShow, setRequestModalShow] = useState<boolean>(false);
    const [shopList, setShopList] = useState<ShopData[]>([]);
    const [currentShop, setCurrentShop] = useState<ShopData>();
    const [productList, setProductList] = useState<ProductData[]>([]);
    const [changeShopState, setChangeShopState] = useState<boolean>(true);
    const [creditAmount, setCreditAmount] = useState<number>(0);

    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);
    const [isAlert, setisAlert] = useState(false);

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }

    const selectShop = (shop: ShopData) => {
        setChangeShopState(!changeShopState)
        setCurrentShop(shop)
        getProductList(shop.email);
    };

    const getShopList = async () => {
        try {
            const response = await axios.get<ShopData[]>(environments.paths.getShopList, { withCredentials: true });
            if (response) {
                const tmp = [...response.data];
                setShopList(tmp)
            }

            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);

            const supEmail = params.get('supEmail');
            if (supEmail) {
                for (let index = 0; index < shopList.length; index++) {
                    if (shopList[index].email === supEmail) {
                        selectShop(shopList[index]);
                    }
                    break;
                }
            }
        } catch (error) {
            handleAlert({
                headerText: "ขอเครดิต",
                contentText: "มีข้อผิดพลาดเกิดขึ้น",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => { setisAlert(false) }
                }
            })
            console.error(error);
        }
    };

    const getProductList = async (supId: string) => {
        try {
            const response = await axios.get<ProductData[]>(`${environments.paths.getProduct}?supId=${supId}`, { withCredentials: true });
            if (response.data) {
                setProductList(response.data);
            }
        } catch (error) {
            handleAlert({
                headerText: "ขอเครดิต",
                contentText: "มีข้อผิดพลาดเกิดขึ้น",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => { setisAlert(false) }
                }
            })
            console.error(error);
        }
    };

    const reqCredit = async () => {
        try {
            const response = await axios.post(environments.paths.requestsCredit, {
                supEmail: currentShop?.email,
                creditAmount: creditAmount
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                if (currentShop) {
                    selectShop(currentShop)
                    setCreditAmount(0)
                }
                setRequestModalShow(false);
                handleAlert({
                    headerText: "ขอเครดิต",
                    contentText: "รอการอนุมัติจากเจ้าของร้าน",
                    btn1: {
                        btnText: "ยืนยัน",
                        btnFunc: () => { setisAlert(false) }
                    }
                })
                return
            }
        } catch (error) {
            handleAlert({
                headerText: "ขอเครดิต",
                contentText: "มีข้อผิดพลาดเกิดขึ้น",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => { setisAlert(false) }
                }
            })
            console.error('Registration error:', (error as Error).message);
            return
        }
    }

    useEffect(() => {
        getShopList();
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
                            <div className="shop-info">
                                <div className="shop-name">ชื่อร้าน : {currentShop.shopName}</div>
                                <div className="shop-credit">เครดิตคงเหลือ : {currentShop.creditAmount || 0}</div>
                                <div className="req-credit" onClick={() => setRequestModalShow(true)}>ขอเครดิตเพิ่ม</div>
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
                            height: currentShop ? '62dvh' : "74dvh"
                        }}>
                        {shopList && shopList.map((shop, index) => (
                            // <div className='shop-list-order' key={index} onClick={() => {
                            //     selectShop(shop)
                            // }}>{shop.shopName}</div>
                            <div
                                className="shop-list-order"
                                key={index}
                                onClick={() => {
                                    selectShop(shop)
                                }}>
                                {/* <div className="shop-image-wrap">
                                    <img className='shop-image' src={"" + shop?.image} alt="" />
                                </div> */}
                                <div className="shop-info">
                                    <div className="shop-name">ชื่อร้าน : {shop.shopName}</div>
                                    <div className="shop-credit">เครดิตคงเหลือ : {shop.creditAmount || 0}</div>
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

            {isRequestModalShow && (
                <>
                    <div className="alert-container">
                        <div className="modal-header-text modal-shop-name">{currentShop?.shopName}</div>
                        <div className="modal-body">
                            <div className="form-container">
                                <div className="home-input-container">
                                    <div className="input-wrap">
                                        <input type="number" className="input-controller" placeholder="จำนวนเครดิตที่ต้องการ"
                                            value={creditAmount}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setCreditAmount(Number(event.target.value))
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn-wrap">
                            <button className="btn bg-light-gray text-white" onClick={() => setRequestModalShow(false)}>ยกเลิก</button>
                            <button className="btn text-white req-btn" onClick={() => reqCredit()}>ขอเครดิต</button>
                        </div>
                    </div>
                    <div className="backdrop" onClick={() => setRequestModalShow(false)}></div>
                </>
            )}

            {isAlert && (
                <Alert
                    headerText={alertProps?.headerText || ''}
                    contentText={alertProps?.contentText || ''}
                    btn1={alertProps?.btn1}
                    btn2={alertProps?.btn2}
                />
            )}
        </div>
    );
}

export default Home;
