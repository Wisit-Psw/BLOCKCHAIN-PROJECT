import './SupHome.css'
import { useEffect, useState } from 'react'
import ProductBox from './child/ProductBox'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { environments } from '../../../environment/environment';
// import { userCliend } from '../../../user-data/UserData';

function SupHome() {

    const [productList, setProductList] = useState([] as ProductData[]);

    const getProductList = async () => {
        try {
            const response = await axios.get<ProductData[]>(`${environments.paths.getProduct}`, { withCredentials: true });
            if (response.data) {
                setProductList(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProductList();
    }, []);


    return (
        <>
            <div className='sup-home-page-container'>
                <div className="search-container cus-home-search">
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
                        <Link to={'/product/' + product.productId} key={index}><ProductBox product={product} /></Link>
                    ))}
                </div>
            </div>
        </>

    )
}

export default SupHome
