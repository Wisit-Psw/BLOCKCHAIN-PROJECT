declare interface UserDataInterface {
    id:number;
    name:string;
    phone:string;
    email:string;
    address:string;
}

declare interface UserCliendDataInterface {
    isSupplier:boolean;
    isCustomer:boolean;
    userData:UserDataInterface;
}