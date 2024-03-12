
import './SupCredit.css'
import { useEffect, useState } from 'react'
import SupCreditHistory from './child/SupCreditHistory';
function SupCredit() {
    const [supCreditList, setsupCreditList] = useState([] as SupCreditData[]);

    useEffect(() => {
        const supCreditDataTmp: SupCreditData[] = []
        for (let index = 0; index < 100; index++) {
            const elementShop: SupCreditData = {
                id: index,
                from: 'cus'+index,
                total: 9999,
                amount: 9999,
                used:0,
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
            supCreditDataTmp.push(elementShop);
        }
        setsupCreditList(supCreditDataTmp)
    }, [])

    return (
        <div className='sup-credit-page-container'>
            <div className="table">
                <div className="thead">
                    <div className="trow">
                        <div className="th supplier">Customer</div>
                        <div className="th used">Used</div>
                        <div className="th amount">Amount</div>
                        <div className="th total">Total</div>
                    </div>
                </div>
                <div className="tbody">
                    {supCreditList.map((supCredit: SupCreditData, index: number) => (
                            <SupCreditHistory key={index} index={index} supCredit={supCredit} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SupCredit
