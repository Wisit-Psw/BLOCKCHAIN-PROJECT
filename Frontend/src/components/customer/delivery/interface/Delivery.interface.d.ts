declare interface orderProductData{
    id:number;
    image:string;
    name:string;
    price:number;
    quantity:number;
}
declare interface orderData{
    orderId:number;
    price:number;
    productList:orderProductData[];
}

declare interface deliveryData{
    orderData:orderData;
    address:string;
    status:string;
}