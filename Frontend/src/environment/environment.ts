class environment {
    baseUrl = process.env.REACT_APP_BASE_URL

    paths = {
        cusRegister:this.baseUrl+'/customer/register',
        supRegister:this.baseUrl+'/supplier/register',

        login:this.baseUrl+'/auth/login',
        logout:this.baseUrl+'/auth/logout',
        checkSession:this.baseUrl+'/auth/get-session',

        getProduct:this.baseUrl + '/product',
        getProductData:this.baseUrl + '/product/info',
        addProduct:this.baseUrl + '/product/add',
        updateProduct:this.baseUrl + '/product/update',
        deleteProduct:this.baseUrl + '/product/delete',

        getShopList:this.baseUrl + '/customer/get-shop'


    }
}

export const environments = new environment();