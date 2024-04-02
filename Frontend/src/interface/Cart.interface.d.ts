declare interface cartProductData{
    cartProdId: number;
    cartId: number;
    productId: number;
    quantity: number;
    productName: string;
    productImage: string;
    productDescription: string;
    productPrice: number;
    productQuantity: number;
    supEmail: string
}

declare interface CartData{
    cartId:number;
    supEmail?:string;
    shopName:string;
    totalQuantity:number;
    totalPrice:number;
    productList:cartProductData[]
}