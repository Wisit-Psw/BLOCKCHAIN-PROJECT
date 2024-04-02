declare interface ShopData{
    // image:string;
    email:string;
    shopName:string;
    creditAmount:number;
}

declare interface ProductData{
    productId?:number;
    productImage:string;
    productName:string;
    productPrice:number;
    productDescription:string;
    productQuantity:number;
    supEmail?:string;
}

declare interface CreditData{
    shopName:string;
    creditAmount:number;
}