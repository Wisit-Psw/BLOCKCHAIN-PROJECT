import './SupHome.css'
import { useEffect, useState } from 'react'
import ProductBox from './child/ProductBox'
import { Link } from 'react-router-dom';

function SupHome() {

    const [productList, setProductList] = useState([] as productData[]);

    useEffect(() => {
        const tempProdList: productData[] = [];
        for (let index = 0; index < 100; index++) {
            const element: productData = {
                id: index,
                image: 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png',
                name: 'Product' + index,
                detail: '',
                quantity: 0,
                price: 9999,
            };
            tempProdList.push(element);
        }
        setProductList(tempProdList);


    }, []);


    return (
        <>
            <div className='sup-home-page-container'>
                <div className='sup-product-container'>
                    <div className="sup-product-image-wrap sup-product-header">
                        <label>Image</label>
                    </div>
                    <div className="sup-product-name sup-product-header">
                        <label>Name</label>
                    </div>
                    <div className="sup-product-price sup-product-header">
                        <label>price</label>
                    </div>
                    <div className="sup-product-quantity sup-product-header">
                        <label>quantity</label>
                    </div>
                </div>
                <div className="sup-product-list">
                    {productList.map((product, index) => (
                        <Link to={'/product/' + product.id} key={index}><ProductBox product={product} /></Link>
                    ))}
                </div>
            </div>
        </>

    )
}

export default SupHome
