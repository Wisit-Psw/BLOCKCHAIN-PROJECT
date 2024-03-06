declare interface orderProductData{
    id:number;
    name:string;
    price:number;
    quantity:number;
}
declare interface orderData{
    orderId:number;
    price:number;
    productList:orderProductData[];
}

declare interface historyData{
    orderData:orderData;
    // address:string;
    status:string;
}