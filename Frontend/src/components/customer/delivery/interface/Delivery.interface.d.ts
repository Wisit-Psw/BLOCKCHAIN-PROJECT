declare interface OrderProductData{
    productId?:number;
    productImage:string;
    productName:string;
    productPrice:number;
    productDescription:string;
    productQuantity:number;
    supEmail?:string;
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