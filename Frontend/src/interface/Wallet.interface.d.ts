declare interface walletHistoryData {
    id: number;
    typr: string;
    amount: number;
    total: number;
}

declare interface WalletData {
    creditId: number;
    supEmail: string;
    shopName:string;
    shopImage:string;
    cusEmail?: string;
    creditTotal: number;
    creditAmount?: number;
    dateUpdate: string;
    // history: walletHistoryData[];
}