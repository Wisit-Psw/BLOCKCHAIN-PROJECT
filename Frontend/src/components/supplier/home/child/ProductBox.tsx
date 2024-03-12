import './ProductBox.css'

interface ProductProps {
    product: productData;
}

function ProductBox({ product } : ProductProps) {
    return (
        <div className='sup-product-container'>
            <div className="sup-product-image-wrap">
                <img className='sup-product-image' src={product.image} alt="" />
            </div>
            <div className="sup-product-name">
                <label>{product.name}</label>
            </div>
            <div className="sup-product-price">
                <label>{product.price}</label>
            </div>
            <div className="sup-product-quantity">
                <label>{product.quantity}</label>
            </div>
        </div>
    )
}

export default ProductBox
