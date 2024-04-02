declare interface ShopData{
    image:string;
    email:string;
    shop_name:string;
    creditAmount:number;
}

declare interface ProductData{
    productId?:number;
    productImage:string;
    productName:string;
    productPrice:number;
    productDescription:string;
    productQuantity:number;
}

declare interface CreditData{
    shopName:string;
    creditAmount:number;
}