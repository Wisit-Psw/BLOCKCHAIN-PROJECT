export class environment {
    baseUrl = process.env.REACT_APP_BASE_URL

    paths = {
        login:this.baseUrl+'/auth/login',
        checkSession:this.baseUrl+'/auth/check-session',
        
        getProduct:this.baseUrl+'/product',
    }
}