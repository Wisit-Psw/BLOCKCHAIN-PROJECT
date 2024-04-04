declare interface walletHistoryData {
    creditHisId: number;
    creditId: number;
    creditTotal: number;
    creditUpdate: number;
    creditAmount: number;
    requestsDate: string;
    approvDate: string;
    updateType: "Add"|"Decrease"|"Used"|"Payment";
    status: "Accept"|"Reject"|"Waiting";
    txId: string;
}

declare interface WalletData {
    creditId: number;
    supEmail: string;
    shopName: string;
    cusEmail?: string;
    cusName?:string;
    creditTotal: number;
    creditAmount?: number;
    dateUpdate: string;
    history?: walletHistoryData[];
}