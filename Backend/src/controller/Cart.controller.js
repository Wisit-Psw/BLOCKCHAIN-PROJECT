const express = require('express');
const router = express.Router();
const dbConnection = require('../module/dbConection')
const rolesGuard = require('../guard/roles.guards')


class CartController {

    constructor() {
        this.router = router;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', rolesGuard.isCustomer, this.getCart);
        this.router.put('/delete', rolesGuard.isCustomer, this.deleteCart);
    }

    getCart = (req, res) => {
        try {
            const user = req.session.user
            const query = `
                            SELECT cartId,supEmail,shop_name FROM cart 
                            inner join supplier on cart.supEmail = supplier.email 
                            WHERE cusEmail LIKE '${user.userData.email}'
                        `;

            dbConnection.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).send(result);
            });
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    deleteCart = (req, res) => {
        const cartId = req.query.cartId

        let sql = `DELETE FROM cart_product  WHERE cartId = ${cartId}`;

        dbConnection.query(sql, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
        });

        sql = `DELETE FROM cart  WHERE cartId = ${cartId}`;

        dbConnection.query(sql, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(200).json({ message: 'Data inserted successfully' });
            }
        });
    }

}

module.exports = (new CartController()).router;
