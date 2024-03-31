import './SupHome.css'
import { useEffect, useState } from 'react'
import ProductBox from './child/ProductBox'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SupHome() {

    const [productList, setProductList] = useState([] as ProductData[]);

    useEffect(() => {
        const tempProdList: ProductData[] = [];
        for (let index = 0; index < 100; index++) {
            const element: ProductData = {
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
                <div className="search-container cus-home-search text-light-gray">
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="ค้นหา"
                        />
                    </div>
                </div>
                <div className='sup-product-container'>
                    <div className="sup-product-image-wrap sup-product-header">
                        <label>รูป</label>
                    </div>
                    <div className="sup-product-name sup-product-header">
                        <label>ชื่อ</label>
                    </div>
                    <div className="sup-product-price sup-product-header">
                        <label>ราคา</label>
                    </div>
                    <div className="sup-product-quantity sup-product-header">
                        <label>เหลือ(ชิ้น)</label>
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
