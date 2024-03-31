import axios, { AxiosResponse } from 'axios';
import { environments } from '../environment/environment';

class UserCliend {
    userData: UserCliendDataInterface | null = null;
    constructor() {
        this.isSessionActive()
    }

    async isSessionActive() {
        try {
            const user:AxiosResponse<UserCliendDataInterface, UserCliendDataInterface>  = await axios.get(environments.paths.checkSession, { withCredentials: true });
            if (!user) return false
            this.userData = user.data;
            return true
        } catch (err) {
            console.error(err)
        }
        return false
    }

    isSupplier() {
        if (!this.userData) {
            new Promise(() => { this.isSessionActive() });
        }
        return this.userData?.isSupplier || false;
    }

    isCustomer() {
        if (!this.userData) {
            new Promise(() => { this.isSessionActive() });
        }
        return this.userData?.isCustomer || false;
    }

    setUserData(userData: UserCliendDataInterface) {
        this.userData = userData
    }

}

export const userCliend = new UserCliend();
