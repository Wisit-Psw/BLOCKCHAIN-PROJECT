
import './SupCredit.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react'
import axios from 'axios';
import { environments } from '../../../environment/environment';
import { Link } from 'react-router-dom';

function SupCredit() {
    const [walletList, setWalletList] = useState([] as WalletData[]);

    const getwalletList = async () => {
        try {
            const response = await axios.get(environments.paths.getSupCredit, { withCredentials: true });
            if (response.data) {
                setWalletList(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getwalletList();
    }, [])

    return (
        <div className='wallet-page-container'>
            {walletList.map((wallet: WalletData, index: number) => (
                <div className='wallet-list' key={index}>
                    <div className="wallet-list-shop-name">
                        {wallet.cusName}
                    </div>
                    <div className='wallet-list-info'>
                        <div className="wallet-info">
                            <div className="wallet-create-date row">
                                <div className='wallet-topic'>เครดิตทั้งหมด : </div>
                                <div> {wallet.creditTotal}</div>
                            </div>
                            <div className="wallet-send-date row">
                                <div className='wallet-topic'>เครดิตคงเหลือ : </div>
                                <div> {wallet.creditAmount}</div>
                            </div>
                            <div className="wallet-send-date row">
                                <div className='wallet-topic'>เครดิตที่ใช้ไป : </div>
                                <div> {wallet.creditTotal - (wallet.creditAmount || 0)}</div>
                            </div>
                        </div>
                        <div className="wallet-list-shop-detail">
                            <Link to={"/credit-info/" + wallet.creditId}>
                                <div className='wallet-topic'><FontAwesomeIcon icon={faAngleRight} /></div>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SupCredit
