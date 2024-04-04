class environment {
    baseUrl = process.env.REACT_APP_BASE_URL

    paths = {
        cusRegister: this.baseUrl + '/customer/register',
        supRegister: this.baseUrl + '/supplier/register',

        login: this.baseUrl + '/auth/login',
        logout: this.baseUrl + '/auth/logout',
        checkSession: this.baseUrl + '/auth/get-session',

        getProduct: this.baseUrl + '/product',
        getProductData: this.baseUrl + '/product/info',

        addProduct: this.baseUrl + '/product/add',
        updateProduct: this.baseUrl + '/product/update',
        deleteProduct: this.baseUrl + '/product/delete',

        addProductToCart: this.baseUrl + "/cart-product/add",
        updateProductInCart: this.baseUrl + "/cart-product/update",
        deleteProductInCart: this.baseUrl + "/cart-product/delete",

        getCartData: this.baseUrl + "/cart",

        getShopList: this.baseUrl + '/customer/get-shop',
        requestsCredit: this.baseUrl + '/customer/requests-credit',
        createOrder: this.baseUrl + '/customer/create-order',
        receiveOrder: this.baseUrl + '/customer/receive-order',
        getCusOrder: this.baseUrl + '/customer/order',
        getCusWallet: this.baseUrl + '/customer/wallet',
        getCusWalletInfo: this.baseUrl + '/customer/wallet-info',
        getCusOrderInfo: this.baseUrl + '/customer/order-info',
        creditPayment: this.baseUrl + '/customer/credit-payment',

        getCreditReq: this.baseUrl + '/supplier/credit-req',
        creditApproval: this.baseUrl + '/supplier/credit-approval',
        getOrder: this.baseUrl + '/supplier/order',
        submitOrder: this.baseUrl + '/supplier/submit-order',
        rejectOrder: this.baseUrl + '/supplier/reject-order',

        getSupCredit: this.baseUrl + '/supplier/credit',
        getSupCreditInfo: this.baseUrl + '/supplier/credit-info',
        updateCreditTotal: this.baseUrl + '/supplier/update-credit',
        submitCreditPayment: this.baseUrl + '/supplier/submit-credit-payment'

    }
}

export const environments = new environment();