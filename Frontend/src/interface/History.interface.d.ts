declare interface orderProductData{
    id:number;
    name:string;
    price:number;
    quantity:number;
}
declare interface OrderData{
    orderId: number;
    cusEmail: string;
    cusName: string;
    shopName: string;
    totalPrice: number;
    createDate: string;
    createTxId: string;
    sendDate: string;
    sendTxId: string;
    approvDate: string;
    approvTxId: string;
    status: "Success" | "Sending" | "Waiting" | "Reject";
    productList:orderProductData[];
}

declare interface HistoryData{
    orderData:OrderData;
}