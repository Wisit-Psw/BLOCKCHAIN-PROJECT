declare interface SupCreditHistoryData{
    id: number;
    typr: string;
    amount: number;
    total: number;
}


declare interface SupCreditReq {
    creditHisId: number;
    creditId: number;
    creditTotal: number;
    creditUpdate: number;
    creditAmount: number;
    requestsDate: string;
    approvDate: string;
    updateType: string;
    status: string;
    txId: string;
    cusEmail: string;
    cusName:string;
}

declare interface SupCreditData {
    id: number;
    cusEmail?: string;
    cusName:string;
    creditTotal: number;
    creditAmount: number;
    history: SupCreditHistoryData[]
}