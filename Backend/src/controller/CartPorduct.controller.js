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

class CartProductController {

    constructor() {
        this.router = router;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', rolesGuard.isAsuthenticated, this.getProductInCart);
        this.router.post('/add', rolesGuard.isCustomer, this.addProductToCart);
        this.router.post('/update', rolesGuard.isCustomer, this.updateProductInCart);
        this.router.delete('/delete', rolesGuard.isCustomer, this.deleteProductInCart);
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

    addProductToCart = async (req, res) => {
        try {
            let { cartId, productId, quantity, supEmail } = req.body;
            const user = req.session.user;

            let cart;
            let sql = '';

            let query = `SELECT * FROM product WHERE productId = ${productId}`;
            const product = (await executeQuery(query))[0];

            if (!cartId) {
                sql = `SELECT * FROM cart WHERE cusEmail LIKE '${user.userData.email}' and supEmail LIKE '${supEmail}'`;
                const cartQueryResult = await executeQuery(sql);
                cart = (cartQueryResult && cartQueryResult[0]) ? cartQueryResult[0] : undefined;
                if (cart) {
                    cartId = cart.cartId;
                }
            }

            if (!cart && !cartId) {
                if (product.productQuantity < quantity) {
                    return res.status(409).send("สินค้าไม่เพียงพอ");
                }
                sql = `INSERT INTO cart(cusEmail, supEmail) VALUES ('${user.userData.email}','${supEmail}')`;
                const cartInsertResult = await executeQuery(sql);
                cartId = cartInsertResult.insertId;
            }

            let cartProd;
            sql = `SELECT * FROM cart_product WHERE cartId = ${cartId} AND productId = ${productId}`;
            const cartProdQueryResult = await executeQuery(sql);
            cartProd = (cartProdQueryResult && cartProdQueryResult[0]) ? cartProdQueryResult[0] : undefined;

            if (!cartProd) {
                if (product.productQuantity < quantity) {
                    return res.status(409).send("สินค้าไม่เพียงพอ");
                }
                sql = `INSERT INTO cart_product(cartId, productId, quantity) VALUES (${cartId},${productId},${quantity})`;
            } else {
                const updatedQuantity = cartProd.quantity + quantity;
                console.log(product.productQuantity, updatedQuantity)
                if (product.productQuantity < updatedQuantity) {
                    return res.status(409).send("สินค้าไม่เพียงพอ");
                }
                sql = `UPDATE cart_product SET quantity=${updatedQuantity} WHERE cartId = ${cartId} and productId = ${productId}`;
            }
            await executeQuery(sql);
            return res.status(200).send("Insert success");

        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
    }

    updateProductInCart = async (req, res) => {
        try {
            let { cartId, productId, quantity } = req.body;
            let sql = '';

            let query = `SELECT * FROM product WHERE productId = ${productId}`;
            const product = (await executeQuery(query))[0];

            if (!cartId) {
                return res.status(404).send("หมายเลขตะกร้าไม่ถูกต้อง");
            }

            if (product.productQuantity < quantity) {
                return res.status(409).send("สินค้าไม่เพียงพอ");
            }
            sql = `UPDATE cart_product SET quantity=${quantity} WHERE cartId = ${cartId} and productId = ${productId}`;
            await executeQuery(sql);
            return res.status(200).send("Insert success");

        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
    }

    deleteProductInCart = (req, res) => {
        const cartProdId = req.query.cartProdId;
        const cartId = req.query.cartId;

        let sql = `DELETE FROM cart_product WHERE cartProdId = ${cartProdId}`;

        dbConnection.query(sql, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            } else {
                sql = `SELECT COUNT(*) as counter FROM cart_product WHERE cartId = ${cartId}`;
                dbConnection.query(sql, (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: error.message });
                    } else {
                        const counter = results[0].counter;
                        if (counter === 0) {
                            sql = `DELETE FROM cart WHERE cartId = ${cartId}`;
                            dbConnection.query(sql, (error, results) => {
                                if (error) {
                                    return res.status(500).json({ error: error.message });
                                } else {
                                    return res.status(200).json({ message: 'Cart deleted' });
                                }
                            });
                        } else {
                            return res.status(200).json({ message: 'Product deleted from cart' });
                        }
                    }
                });
            }
        });
    };


}

module.exports = (new CartProductController()).router;
