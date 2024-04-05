import axios from 'axios';
import { environments } from '../../../environment/environment';
import './CreditReq.css'
import { useEffect, useState } from 'react'
import Alert from '../../commons/alert/Alert';

const historyType = {
    Add: "ขอเครดิต",
    Used: "ซื้อสินค้า",
    Decrease: "ถูกลดเครดิต",
    Payment: "ชำระหนี้",
}

function CreditReq() {
    const [reqList, setReqList] = useState<SupCreditReq[]>([]);

    const [updateState, setUpdateState] = useState<string>()

    const [creditVal, setCreditVal] = useState<number>();
    const [btn1, setBtn1] = useState<{
        btnText: string,
        btnFunc: (param1?: unknown, param2?: unknown, param3?: unknown) => void;
    }>({
        btnText: 'ยืนยัน',
        btnFunc: () => { }
    });


    const [req, setReq] = useState<SupCreditReq>({} as SupCreditReq);

    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);
    const [isAlert, setisAlert] = useState(false);


    const acceptReq = (req: SupCreditReq) => {

        setCreditVal(req.creditUpdate);
        setReq(req)

        const alertStructure: AlertStructure = {
            headerText: 'อนุมัติเครดิต',
            contentText: 'ยืนยันการให้เครดิตหรือไม่',
            input: [
                {
                    label: "จำนวน",
                    type: "number",
                    value: req.creditUpdate,
                    onChangeFunc: (event: React.ChangeEvent<HTMLInputElement>) => {
                        setCreditVal(Number(event.target.value));
                    }
                }
            ],
            btn1: {
                btnText: 'ยืนยัน',
                btnFunc: () => {

                }
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
                cusEmail:req.cusEmail,
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
                getReqCreditList();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const payReq = (req: SupCreditReq) => {

        setCreditVal(req.creditUpdate);
        setReq(req)

        const alertStructure: AlertStructure = {
            headerText: 'ชำระเงิน',
            contentText: 'ยืนยันการชำระเงิน',
            btn1: {
                btnText: 'ยืนยัน',
                btnFunc: () => {
                    submitPayReq(req);
                }
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

    const submitPayReq = async (req: SupCreditReq) => {
        try {
            const response = await axios.post(environments.paths.submitCreditPayment, {
                cusEmail:req.cusEmail,
                creditHisId: req.creditHisId,
                creditId: req.creditId,
                creditAmount: req.creditUpdate,
                status: "Accept",
            }, { withCredentials: true });
            if (response.status === 200) {
                const alertStructure: AlertStructure = {
                    headerText: 'ชำระเงิน',
                    contentText: 'อนุมัติชำระเงินสำเร็จ',
                    btn1: {
                        btnText: 'ยืนยัน',
                        btnFunc: () => {
                            setisAlert(false);
                        }
                    }
                }
                handleAlert(alertStructure)
                getReqCreditList();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const rejectReq = (req: SupCreditReq) => {

        setCreditVal(req.creditUpdate);
        setReq(req)

        const alertStructure: AlertStructure = {
            headerText: 'ปฏิเสธการชำระเงิน',
            contentText: 'ยืนยันการปฏิเสธการชำระเงินหรือไม่',
            btn1: {
                btnText: 'ยืนยัน',
                btnFunc: () => {
                    submiRejectReq(req);
                }
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
            const response = await axios.post(environments.paths.submitCreditPayment, {
                cusEmail:req.cusEmail,
                creditHisId: req.creditHisId,
                creditId: req.creditId,
                creditAmount: req.creditUpdate,
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
                getReqCreditList();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const payRej = (req: SupCreditReq) => {

        setCreditVal(req.creditUpdate);
        setReq(req)

        const alertStructure: AlertStructure = {
            headerText: 'ปฏิเสธการชำระเงิน',
            contentText: 'ปฏิเสธการชำระเงิน',
            btn1: {
                btnText: 'ยืนยัน',
                btnFunc: () => {
                    submitPayRej(req);
                }
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

    const submitPayRej = async (req: SupCreditReq) => {
        try {
            const response = await axios.post(environments.paths.submitCreditPayment, {
                creditHisId: req.creditHisId,
                creditId: req.creditId,
                creditAmount: req.creditUpdate,
                status: "Reject",
            }, { withCredentials: true });
            if (response.status === 200) {
                const alertStructure: AlertStructure = {
                    headerText: 'ปฏิเสธการชำระเงิน',
                    contentText: 'ปฏิเสธการชำระเงินสำเร็จ',
                    btn1: {
                        btnText: 'ยืนยัน',
                        btnFunc: () => {
                            setisAlert(false);
                        }
                    }
                }
                handleAlert(alertStructure)
                getReqCreditList();
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
    }, [])

    useEffect(() => {
        setBtn1({
            btnText: 'ยืนยัน',
            btnFunc: () => {
                req.updateType === "Payment" ?
                    (updateState === "acc" ? submitPayReq(req) : submitPayRej(req))
                    : (updateState === "acc" ? submitAcceptReq(req) : submiRejectReq(req))
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [req, creditVal])

    return (
        <div className='credit-req-page-container'>
            {reqList.map((req: SupCreditReq, index: number) => (
                <div className='credit-req-list' key={index}>
                    <div className="credit-req-list-shop-name">
                        <div>{req.cusName}</div>
                        <div>{historyType[req.updateType]}</div>
                    </div>
                    <div className='credit-req-list-info'>
                        <div className="credit-req-info">
                            <div className="credit-req-create-date row">
                                <div className='credit-req-topic'>เครดิตปัจจุบัน : </div>
                                <div> {req.creditTotal}</div>
                            </div>
                            <div className="credit-req-send-date row">
                                <div className='credit-req-topic'>จำนวน : </div>
                                <div> {req.creditUpdate}</div>
                            </div>
                        </div>

                    </div>
                    <div className="credit-req-list-shop-detail">
                        {req.slipImage && (
                            <img className='product-image' src={req.slipImage} alt="" />
                        )}
                    </div>
                    <div className="btn-wrap">
                        <div className="btn reject-btn" onClick={() => {
                            req.updateType === "Payment" ? payRej(req) : rejectReq(req);

                            setUpdateState("rej");
                        }}>ปฏิเสธ</div>
                        <div className="btn accept-btn" onClick={() => {
                            req.updateType === "Payment" ? payReq(req) : acceptReq(req);
                            setUpdateState("acc");
                        }}>อนุมัติ</div>
                    </div>
                </div>
            ))}
            {isAlert && (
                <Alert
                    headerText={alertProps?.headerText || ''}
                    contentText={alertProps?.contentText || ''}
                    input={alertProps.input}
                    btn1={btn1}
                    btn2={alertProps?.btn2}
                />
            )}
        </div>
    )
}

export default CreditReq
