import { useState } from 'react';
import './SupCreditHistory.css'

interface SupCreditProps {
    index: number,
    supCredit: SupCreditData
}

function SupCreditHistory(props: SupCreditProps) {
    const { supCredit, index } = props;
    const [isSupCreditListShow, setSupCreditListShow] = useState(true as boolean);

    const showSupCreditList = () => {
        const orderListEle = document.getElementById("orderList" + index)
        if (orderListEle) {
            setSupCreditListShow(!isSupCreditListShow)
            if (isSupCreditListShow) {
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
            <div className="trow" onClick={showSupCreditList}>
                <div className="td supplier">{supCredit.from}</div>
                <div className="td used">{supCredit.used}</div>
                <div className="td amount">{supCredit.amount}</div>
                <div className="td total">{supCredit.total}</div>
            </div>
            <div className="order-list" id={"orderList" + index}>
                {supCredit.history.map((supCreditHistory: SupCreditHistoryData, id: number) => (
                    <div className="pd-trow" key={id}>
                        <div className="td typr">{supCreditHistory.typr}</div>
                        <div className="td amount">{supCreditHistory.amount}</div>
                        <div className="td total">{supCreditHistory.total}</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SupCreditHistory
