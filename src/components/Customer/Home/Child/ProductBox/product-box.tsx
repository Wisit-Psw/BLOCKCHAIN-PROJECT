import './product-box.css'

interface ProductProps {
    product: productData;
}

function ProductBox({ product } : ProductProps) {
    return (
        <div className='product-container'>
            <div className="product-image-wrap">
                <img className='product-image' src={product.image} alt="" />
            </div>
            <div className="product-name">
                <label>{product.name}</label>
            </div>
            <div className="product-price">
                <label>{product.price}</label>
            </div>
        </div>
    )
}

export default ProductBox
