
import './Wallet.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from 'react'
// import Walletwallet from './child/Walletwallet';
function Wallet() {
    const [walletList, setWalletList] = useState([] as WalletData[]);

    useEffect(() => {
        const walletDataTmp: WalletData[] = []
        for (let index = 0; index < 100; index++) {
            const elementShop: WalletData = {
                creditId: index,
                shopName: 'ร้านป้าสวยยยยยย',
                shopImage: "https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png",
                creditTotal: 9999,
                creditAmount: 9999,
                // wallet: [{
                //     id: 0,
                //     typr: 'Requests',
                //     amount: 3000,
                //     total: 3000,
                // }, {
                //     id: 1,
                //     typr: 'Payment',
                //     amount: 3000,
                //     total: 6000,
                // }, {
                //     id: 2,
                //     typr: 'Requests',
                //     amount: 3999,
                //     total: 9999,
                // }]
            }
            walletDataTmp.push(elementShop);
        }
        setWalletList(walletDataTmp)
    }, [])

    return (
        <div className='wallet-page-container'>
            {/* <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th supplier">Supplier</div>
                        <div className="th amount">Amount</div>
                        <div className="th total">Total</div>
                    </div>
                </div>
                <div className="tbody">
                    {walletList.map((wallet: WalletData, index: number) => (
                            <Walletwallet key={index} index={index} wallet={wallet} />
                    ))}
                </div>
            </div> */}
            {walletList.map((wallet: WalletData, index: number) => (
                // <OrderRow key={index} index={index} order={order} />
                <div className='wallet-list'>
                    <div className="wallet-list-shop-name">
                        {wallet.shopName}
                    </div>
                    <div key={index} className='wallet-list-info'>
{/* 
                        <div className="wallet-shop-info">
                            <div className="wallet-image-wrap">
                                <img className='wallet-image' src={wallet.shopImage} alt="" />
                            </div>

                        </div> */}
                        <div className="wallet-info">
                            <div className="wallet-create-date row">
                                <div className='wallet-topic'>เครดิตทั้งหมด : </div>
                                <div> {wallet.creditTotal}</div>
                            </div>
                            <div className="wallet-send-date row">
                                <div className='wallet-topic'>เครดิตคงเหลือ : </div>
                                <div> {wallet.creditAmount}</div>
                            </div>
                        </div>
                        <div className="wallet-list-shop-detail">
                            <div className='wallet-topic'><FontAwesomeIcon icon={faAngleRight} /></div>
                        </div>
                    </div>

                </div>

            ))}
        </div>
    )
}

export default Wallet
