import axios from 'axios';
import { environments } from '../../../environment/environment';
import './CreditReq.css'
import { useEffect, useState } from 'react'
import Alert from '../../commons/alert/Alert';

function CreditReq() {
    const [reqList, setReqList] = useState<SupCreditReq[]>([]);

    const [creditVal, setCreditVal] = useState<number>();

    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);
    const [isAlert, setisAlert] = useState(false);


    const acceptReq = (req: SupCreditReq) => {

        setCreditVal(req.creditUpdate)

        const alertStructure: AlertStructure = {
            headerText: 'อนุมัติเครดิต',
            contentText: 'ยืนยันการให้เครดิตหรือไม่',
            input: [
                {
                    label: "จำนวน",
                    type: "number",
                    value: req.creditUpdate,
                    onChangeFunc: (event: React.ChangeEvent<HTMLInputElement>) => {
                        console.log(event.target.value)
                        setCreditVal(Number(event.target.value));
                        console.log(creditVal)
                    }
                }
            ],
            btn1: {
                btnText: 'ยืนยัน',
                btnFunc: () => { submitAcceptReq(req) }
            },
            btn2: {
                btnText: 'ยกเลิก',
                btnFunc: () => {
                    setisAlert(false);
                }
            }
        }
        handleAlert(alertStructure)
    }

    const submitAcceptReq = async (req: SupCreditReq) => {
        try {
            const response = await axios.post(environments.paths.creditApproval, {
                creditHisId: req.creditHisId,
                creditId: req.creditId,
                creditAmount: creditVal ? creditVal : req.creditUpdate,
                status: "Accept",
            }, { withCredentials: true });
            if (response.status === 200) {
                const alertStructure: AlertStructure = {
                    headerText: 'อนุมัติเครดิต',
                    contentText: 'อนุมัติเครดิตสำเร็จ',
                    btn1: {
                        btnText: 'ยืนยัน',
                        btnFunc: () => {
                            setisAlert(false);
                        }
                    }
                }
                handleAlert(alertStructure)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const rejectReq = (req: SupCreditReq) => {
        const alertStructure: AlertStructure = {
            headerText: 'ปฏิเสธการให้เครดิต',
            contentText: 'ยืนยันการปฏิเสธการให้เครดิตหรือไม่',
            btn1: {
                btnText: 'ยืนยัน',
                btnFunc: () => { submiRejectReq(req) }
            },
            btn2: {
                btnText: 'ยกเลิก',
                btnFunc: () => {
                    setisAlert(false);
                }
            }
        }
        handleAlert(alertStructure)
    }

    const submiRejectReq = async (req: SupCreditReq) => {
        try {
            const response = await axios.post(environments.paths.creditApproval, {
                creditHisId: req.creditHisId,
                creditId: req.creditId,
                creditAmount: creditVal ? creditVal : req.creditUpdate,
                status: "Reject",
            }, { withCredentials: true });
            if (response.status === 200) {
                const alertStructure: AlertStructure = {
                    headerText: 'ปฏิเสธการให้เครดิต',
                    contentText: 'ปฏิเสธการให้เครดิตสำเร็จ',
                    btn1: {
                        btnText: 'ยืนยัน',
                        btnFunc: () => {
                            setisAlert(false);
                        }
                    }
                }
                handleAlert(alertStructure)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }

    const getReqCreditList = async () => {
        try {
            const response = await axios.get(environments.paths.getCreditReq, { withCredentials: true });
            if (response) {
                setReqList(response.data)
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getReqCreditList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [creditVal])

    return (
        <div className='credit-req-page-container'>
            {reqList.map((req: SupCreditReq, index: number) => (
                <div className='credit-req-list' key={index}>
                    <div className="credit-req-list-shop-name">
                        {req.cusName}
                    </div>
                    <div className='credit-req-list-info'>
                        <div className="credit-req-info">
                            <div className="credit-req-create-date row">
                                <div className='credit-req-topic'>เครดิตปัจจุบัน : </div>
                                <div> {req.creditTotal}</div>
                            </div>
                            <div className="credit-req-send-date row">
                                <div className='credit-req-topic'>จำนวนที่ขอเพิ่ม : </div>
                                <div> {req.creditUpdate}</div>
                            </div>
                        </div>
                        <div className="credit-req-list-shop-detail">
                            {/* <div className='credit-req-topic'><FontAwesomeIcon icon={faAngleRight} /></div> */}
                        </div>
                    </div><div className="btn-wrap">
                        <div className="btn reject-btn" onClick={() => { rejectReq(req) }}>ปฏิเสธ</div>
                        <div className="btn accept-btn" onClick={() => { acceptReq(req) }}>อนุมัติ</div>
                    </div>
                </div>
            ))}
            {isAlert && (
                <Alert
                    headerText={alertProps?.headerText || ''}
                    contentText={alertProps?.contentText || ''}
                    input={alertProps.input}
                    btn1={alertProps?.btn1}
                    btn2={alertProps?.btn2}
                />
            )}
        </div>
    )
}

export default CreditReq
