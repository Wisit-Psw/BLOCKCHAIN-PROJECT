// import axios from 'axios';
// import { environments } from '../environment/environment';

class UserCliend {
    userData: UserCliendDataInterface | null = null;
    constructor() {
        this.isSessionActive()
    }

    async isSessionActive() {
        try {
            // const user: UserCliendDataInterface = await axios.get(this.environments.paths.checkSession, { withCredentials: true });
            const user: UserCliendDataInterface = {} as UserCliendDataInterface;
            if (!user) return false

            //dev
            // user.isSupplier = true;
            // user.isCustomer = true;

            this.userData = user;
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
