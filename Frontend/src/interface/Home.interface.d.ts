declare interface ShopData{
    image:string;
    email:string;
    shop_name:string;
    creditAmount:number;
}

declare interface ProductData{
    id:number;
    image:string;
    name:string;
    price:number;
    detail:string;
    quantity:number;
}

declare interface CreditData{
    shopName:string;
    creditAmount:number;
}