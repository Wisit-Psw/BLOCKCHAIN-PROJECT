const express = require('express');
const router = express.Router();
const dbConnection = require('../module/dbConection')
const rolesGuard = require('../guard/roles.guards')

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

class CartController {

    constructor() {
        this.router = router;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', rolesGuard.isCustomer, this.getCart);
        this.router.put('/delete', rolesGuard.isCustomer, this.deleteCart);
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
                return result;
            });
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    getCart = (req, res) => {
        try {
            const user = req.session.user;
            const query = `
                SELECT cartId, supEmail, shopName FROM cart 
                INNER JOIN supplier ON cart.supEmail = supplier.email 
                WHERE cusEmail LIKE '${user.userData.email}'
            `;
            dbConnection.query(query, async (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }

                const ret = [];

                for (const data of result) {
                    try {
                        const query2 = `SELECT * FROM cart_product LEFT JOIN product ON product.productId = cart_product.productId  WHERE cartId = ${data.cartId}`;
                        const result2 = await executeQuery(query2);

                        let totalPrice = 0;
                        let totalQuantity = 0;

                        result2.forEach((cartProd) => {
                            totalPrice += cartProd.productPrice * cartProd.quantity;
                            totalQuantity += cartProd.quantity;
                        });

                        const cartData = {
                            cartId: data.cartId,
                            supEmail: data.supEmail,
                            shopName: data.shopName,
                            totalQuantity: totalQuantity,
                            totalPrice: totalPrice,
                            productList: result2
                        };
                        ret.push(cartData);
                    } catch (error) {
                        console.error(error);
                        return res.status(500).send(error);
                    }
                }

                return res.status(200).send(ret);
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    }


    deleteCart = (req, res) => {
        try {
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
        } catch (e) {
            return res.status(500).json(e);
        }
    }

}

module.exports = (new CartController()).router;
