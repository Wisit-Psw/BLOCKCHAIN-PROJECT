declare interface cartProductData{
    id:number;
    image:string;
    name:string;
    price:number;
    quantity:number;
    sumPrice:number;
}

declare interface cartData{
    shopId:number;
    shopName:string;
    totalQuantity:number;
    totalPrice:number;
    productList:cartProductData[]
}