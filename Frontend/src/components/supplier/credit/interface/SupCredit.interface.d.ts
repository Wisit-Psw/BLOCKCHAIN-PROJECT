declare interface SupCreditHistoryData{
    id: number,
    typr: string,
    amount: number,
    total: number,
}

declare interface SupCreditData {
    id: number,
    from: string,
    total: number,
    amount: number,
    used:number,
    history: SupCreditHistoryData[]
}