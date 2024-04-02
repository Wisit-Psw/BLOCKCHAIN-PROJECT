import './ProductBox.css'

interface ProductProps {
    product: ProductData;
}

function ProductBox({ product } : ProductProps) {
    return (
        <div className='sup-product-container'>
            <div className="sup-product-image-wrap">
                <img className='sup-product-image' src={product.productImage} alt="" />
            </div>
            <div className="sup-product-name">
                <label>{product.productName}</label>
            </div>
            <div className="sup-product-price">
                <label>{product.productPrice}</label>
            </div>
            <div className="sup-product-quantity">
                <label>{product.productQuantity}</label>
            </div>
        </div>
    )
}

export default ProductBox
