declare interface orderProductData {
    orderProdId: number;
    orderId: number;
    productId: number;
    quantity: number;
    productName: string;
    productImage: string;
    productDescription: string;
    productPrice: number;
    productQuantity: number;
    supEmail: string;
}

declare interface OrderData {
    orderId: number;
    cusEmail: string;
    cusName: string;
    supEmail: string;
    shopName: string;
    totalPrice: number;
    createDate: string;
    createTxId: string;
    sendDate: string;
    sendTxId: string;
    approvDate: string;
    approvTxId: string;
    status: "Success" | "Sending" | "Waiting" | "Reject";
    productList: orderProductData[];
}

declare interface HistoryData {
    orderData: OrderData;
}