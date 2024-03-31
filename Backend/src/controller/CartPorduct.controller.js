const express = require('express');
const router = express.Router();
const dbConnection = require('../module/dbConection')
const rolesGuard = require('../guard/roles.guards')

class CartProductController {

    constructor() {
        this.router = router;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', rolesGuard.isAsuthenticated, this.getProductInCart);
        this.router.post('/add', this.addProductToCart);
        this.router.put('/delete', rolesGuard.isSupplier, this.deleteProduct);
    }

    getProductInCart = (req, res) => {
        try {
            const cartId = req.query.CartId
            const user = req.session.user

            let query = `SELECT cartProdId, cart_product.cartId, productId, quantity FROM cart_product inner join cart on cart_product.cartId = cart.cartId WHERE cart_product.cartId = ${cartId} and cart.cusEmail LIKE '${user.userData.email}'`;
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

    addProductToCart = async (req, res) => {
        let { cartId, productId, quantity, supEmail } = req.body
        const user = req.session.user

        let count = 0;
        let sql = '';

        if (!cartId) {
            sql = `SELECT COUNT(*) as counter  FROM cart WHERE cusEmail = ${user.userData.email} and supEmail = ${supEmail}`;
            dbConnection.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                count = result[0]?.counter
            });
        }

        if (!count && !cartId) {
            sql = `INSERT INTO cart( cusEmail, supEmail) VALUES ('${user.userData.email}','${supEmail}')`;
            dbConnection.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });
        }

        count = 0;
        sql = `SELECT COUNT(*) as counter FROM cart_product WHERE cartId = ${cartId} and productId = ${productId}`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            count = result[0]?.counter
        });

        if (!count) {
            sql = `INSERT INTO cart_product(cartId, productId, quantity) VALUES ('${cartId}','[${productId}]','[${quantity}]')`;
            dbConnection.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(201).send("Insert success")
            });
        } else {
            sql = `UPDATE cart_product SET quantity='${quantity}' WHERE cartId = ${cartId} and productId = ${productId}`;
            dbConnection.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(201).send("Insert success")
            });
        }
        
    }


    deleteProduct = (req, res) => {
        const productId = req.query.productId
        const sql = `DELETE FROM cart_product WHERE productId = ${productId}`;

        dbConnection.query(sql, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(200).json({ message: 'Data deleted'});
            }
        });
    }

}

module.exports = (new CartProductController()).router;
