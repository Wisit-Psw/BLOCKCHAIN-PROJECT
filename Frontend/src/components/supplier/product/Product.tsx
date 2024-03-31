import './Product.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import QuantityButton from '../../commons/quantity-button/QuantityButton';
function Product() {
    const { productId } = useParams();
    const [productData, setProductData] = useState({} as ProductData);
    // const [quantity, setQuantity] = useState(1);

    // const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setQuantity(Number(event.target.value));
    // }

    // const add = () => {
    //     if (quantity + 1 <= productData.quantity) {
    //         setQuantity(quantity + 1);
    //     }
    // }

    // const minus = () => {
    //     if (productData.quantity > 1) {
    //         setQuantity(quantity - 1);
    //     }
    // }

    useEffect(() => {
        setProductData({
            id: Number(productId),
            image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
            name: 'Product' + productId,
            detail: 'apgapagapgapgpapagpagapagapapgapgapgpagpagapgapgapgapgapgagpagpagpagapgapgapgagpapgapagapgapgpapagpagapagapapgapgapgpagpagapgapgapgapgapgagpagpagpagapgapgapgagp',
            quantity: 9,
            price: 9999,
        })
    }, [productId])

    return (
        <div className='product-prod-page-container'>
            <div className="product-prod-data">
                <div className="product-prod-img-wrap">
                    <img src={productData.image} alt="" className="product-prod-img" />
                </div>
                <div className="product-prod-info">
                    <div className="product-prod-info-wrap">
                        {/* <div className="product-prod-info">{productData.name}</div> */}
                        <div className="product-prod-name">{productData.name}</div>
                    </div>
                    <div className="product-prod-info-wrap">
                        <div className="product-prod-info-label">ราคา : </div>
                        <div className="product-prod-price">{productData.price}</div>
                    </div>
                    <div className="product-prod-info-wrap">
                        <div className="product-prod-info-label">รายละเอียด : </div>
                        <div className="product-prod-detail">{productData.detail}</div>
                    </div>

                </div>
                <div className="product-prod-btn-wrap">
                    <div className="btn text-white atc-btn">Update</div>
                </div>
            </div>

        </div>
    )
}

export default Product;
