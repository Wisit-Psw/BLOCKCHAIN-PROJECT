
import './SupCredit.css'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight ,faSearch} from "@fortawesome/free-solid-svg-icons";
// import SupCreditHistory from './child/SupCreditHistory';

function SupCredit() {
    const [supCreditList, setsupCreditList] = useState([] as SupCreditData[]);

    useEffect(() => {
        const supCreditDataTmp: SupCreditData[] = []
        for (let index = 0; index < 100; index++) {
            const elementShop: SupCreditData = {
                id: index,
                cusName: 'cus'+index,
                creditTotal: 9999,
                creditAmount: 9999,
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
        <div className='credit-page-container'>
            <div className="sup-credit-search search-container cus-home-search text-light-gray">
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
            {/* <div className="table">
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
            </div> */}
             {supCreditList.map((credit: SupCreditData, index: number) => (
                // <OrderRow key={index} index={index} order={order} />
                <div className='credit-list'>
                    <div className="credit-list-shop-name">
                        {credit.cusName}
                    </div>
                    <div key={index} className='credit-list-info'>
{/* 
                        <div className="credit-shop-info">
                            <div className="credit-image-wrap">
                                <img className='credit-image' src={credit.shopImage} alt="" />
                            </div>

                        </div> */}
                        <div className="credit-info">
                            <div className="credit-create-date row">
                                <div className='credit-topic'>เครดิตทั้งหมด : </div>
                                <div> {credit.creditTotal}</div>
                            </div>
                            <div className="credit-send-date row">
                                <div className='credit-topic'>เครดิตคงเหลือ : </div>
                                <div> {credit.creditAmount}</div>
                            </div>
                        </div>
                        <div className="credit-list-shop-detail">
                            <div className='credit-topic'><FontAwesomeIcon icon={faAngleRight} /></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SupCredit
