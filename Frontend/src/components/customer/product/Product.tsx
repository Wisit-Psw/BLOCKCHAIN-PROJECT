import './Product.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QuantityButton from '../../commons/quantity-button/QuantityButton';
import axios from 'axios';
import { environments } from '../../../environment/environment';
function Product() {
    const { productId } = useParams();
    const [productData, setProductData] = useState({} as ProductData);
    const [quantity, setQuantity] = useState(1);

    const getProductData = async () => {
        try {
            const response = await axios.get<ProductData>(`${environments.paths.getProductData}/${productId}`, { withCredentials: true });
            if (response.data) {
                setProductData(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(Number(event.target.value));
    }

    const add = () => {
        if (quantity + 1 <= productData.productQuantity) {
            setQuantity(quantity + 1);
        }
    }

    const minus = () => {
        if (productData.productQuantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const addProductTocart = async () => {
        await axios.post<ProductData>(`${environments.paths.addProductToCart}`, {
            productId: productData.productId,
            quantity: quantity,
            supEmail: productData.supEmail
        }, { withCredentials: true });
    }

    useEffect(() => {
        // setProductData({
        //     productId: Number(productId),
        //     productImage: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
        //     productName: 'Product' + productId,
        //     productDescription: 'apgapagapgapgpapagpagapagapapgapgapgpagpagapgapgapgapgapgagpagpagpagapgapgapgagpapgapagapgapgpapagpagapagapapgapgapgpagpagapgapgapgapgapgagpagpagpagapgapgapgagp',
        //     productQuantity: 9,
        //     productPrice: 9999,
        // })
        getProductData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='product-prod-page-container'>
            <div className="product-prod-data">
                <div className="product-prod-img-wrap">
                    <img src={productData.productImage} alt="" className="product-prod-img" />
                </div>
                <div className="product-prod-info">
                    <div className="product-prod-info-wrap">
                        {/* <div className="product-prod-info">{productData.name}</div> */}
                        <div className="product-prod-name">{productData.productName}</div>
                    </div>
                    <div className="product-prod-info-wrap">
                        <div className="product-prod-info-label">ราคา : </div>
                        <div className="product-prod-price">{productData.productPrice}</div>
                    </div>
                    <div className="product-prod-info-wrap">
                        <div className="product-prod-info-label">รายละเอียด : </div>
                        <div className="product-prod-detail">{productData.productDescription}</div>
                    </div>

                </div>
            </div>
            <div className="product-prod-btn-wrap">
                <div className="product-prod-info-wrap product-btm-menu">
                    <div className="product-prod-info-label">จำนวน : </div>
                    <div className="quantity-btn">
                        <QuantityButton quantity={quantity} add={add} minus={minus} change={change} />
                    </div>
                </div>
                <div className="btn text-white atc-btn" onClick={addProductTocart}>Add</div>
            </div>
        </div>
    )
}

export default Product;
