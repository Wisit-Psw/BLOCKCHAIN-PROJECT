import { useState } from 'react';
import './WalletHistory.css'

interface WalletProps {
    index: number,
    wallet: walletData
}

function WalletHistory(props: WalletProps) {
    const { wallet, index } = props;
    const [isWalletListShow, setWalletListShow] = useState(true as boolean);

    const showWalletList = () => {
        const orderListEle = document.getElementById("orderList" + index)
        if (orderListEle) {
            setWalletListShow(!isWalletListShow)
            if (isWalletListShow) {
                orderListEle.style.height = '10rem'
                orderListEle.style.overflow = 'auto';

            } else {
                orderListEle.style.height = '0px';
                orderListEle.style.overflow = 'hidden';
            }
        }
    }
    return (
        <>
            <div className="trow" onClick={showWalletList}>
                <div className="td supplier">{wallet.from}</div>
                <div className="td amount">{wallet.amount}</div>
                <div className="td total">{wallet.total}</div>
            </div>
            <div className="order-list" id={"orderList" + index}>
                {wallet.history.map((walletHistor: walletHistoryData, id: number) => (
                    <div className="pd-trow" key={id}>
                        <div className="td typr">{walletHistor.typr}</div>
                        <div className="td amount">{walletHistor.amount}</div>
                        <div className="td total">{walletHistor.total}</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default WalletHistory
