declare interface SupCreditHistoryData{
    id: number;
    typr: string;
    amount: number;
    total: number;
}

declare interface SupCreditData {
    id: number;
    cusEmail?: string;
    cusName:string;
    creditTotal: number;
    creditAmount: number;
    history: SupCreditHistoryData[]
}