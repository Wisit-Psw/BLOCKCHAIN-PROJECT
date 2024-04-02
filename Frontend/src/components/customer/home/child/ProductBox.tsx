import './ProductBox.css'

interface ProductProps {
    product: ProductData;
}

function ProductBox({ product } : ProductProps) {
    return (
        <div className='product-container'>
            <div className="product-image-wrap">
                <img className='product-image' src={product.productImage} alt="" />
            </div>
            <div className="product-name">
                <label>{product.productName}</label>
            </div>
            <div className="product-price">
                <label>{product.productPrice}</label>
            </div>
        </div>
    )
}

export default ProductBox
