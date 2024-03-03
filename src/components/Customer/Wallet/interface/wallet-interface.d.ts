declare interface walletHistoryData{
    id: number,
    typr: string,
    amount: number,
    total: number,
}

declare interface walletData {
    id: number,
    from: string,
    total: number,
    amount: number,
    history: walletHistoryData[]
}