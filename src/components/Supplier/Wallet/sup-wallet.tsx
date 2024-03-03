
import './sup-wallet.css'
import { useEffect, useState } from 'react'
import WalletHistory from './Child/ProductBox/wallet-history';
function SupWallet() {
    const [walletList, setWalletList] = useState([] as walletData[]);

    useEffect(() => {
        const walletDataTmp: walletData[] = []
        for (let index = 0; index < 100; index++) {
            const elementShop: walletData = {
                id: index,
                from: 'Shop1',
                total: 9999,
                amount: 9999,
                history: [{
                    id: 0,
                    typr: 'Requests',
                    amount: 3000,
                    total: 3000,
                }, {
                    id: 1,
                    typr: 'Payment',
                    amount: 3000,
                    total: 6000,
                }, {
                    id: 2,
                    typr: 'Requests',
                    amount: 3999,
                    total: 9999,
                }]
            }
            walletDataTmp.push(elementShop);
        }
        setWalletList(walletDataTmp)
    }, [])

    return (
        <div className='wallet-page-container'>
            <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th supplier">Supplier</div>
                        <div className="th amount">Amount</div>
                        <div className="th total">Total</div>
                    </div>
                </div>
                <div className="tbody">
                    {walletList.map((wallet: walletData, index: number) => (
                            <WalletHistory key={index} index={index} wallet={wallet} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SupWallet
