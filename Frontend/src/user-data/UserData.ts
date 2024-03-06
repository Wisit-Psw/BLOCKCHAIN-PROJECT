// import axios from 'axios';
import { environment } from '../environment/environment';

export class UserCliend {
    userData: UserCliendDataInterface | null = null;
    environments = new environment();

    constructor() {
        this.isSessionActive()
    }

    async isSessionActive() {
        try {
            // const user: UserCliendDataInterface = await axios.get(this.environments.paths.checkSession, { withCredentials: true });
            const user: UserCliendDataInterface = {} as UserCliendDataInterface;
            if (user) {

                //dev
                user.isSupplier = true;

                this.userData = user;
                return true
            }
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

}