import './SupAddProduct.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import { faCircleXmark, faAdd } from '@fortawesome/free-solid-svg-icons';
function AddProduct() {
    const [prodImage, setprodImage] = useState('');
    

    const handleInsertImage = () => {
        document.getElementById('product-img-input')?.click()
    }

    const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result;
                    if (base64String) {
                        setprodImage(String(base64String));
                    } else {
                        setprodImage('');
                    }
                };
                reader.readAsDataURL(file);
            }
        }

    };
    useEffect(() => {
        setprodImage('')
    }, [])

    return (
        <div className='add-product-page-container'>
            <div className="add-product-data">
                <div className="add-product-img-wrap">
                    {prodImage !== '' && (
                        <>
                            <img src={prodImage} alt="" className="product-img" />
                            <div className="close-icon" onClick={() => { setprodImage('') }}>
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </div>
                        </>
                    )}
                    {prodImage === '' && (
                        <>
                            <input type="file" className="product-img-input" name="" id="product-img-input" onChange={handleImageInputChange} />
                            <div className="insert-img-btn" onClick={handleInsertImage}>
                                <FontAwesomeIcon icon={faAdd} />
                            </div>
                        </>
                    )}

                </div>
                <div className="add-product-info">
                    <div className="add-product-info-wrap">
                        <div className="add-product-info-label">Name : </div>
                        <div className="add-product-input-wrap">
                            <input type="text" name="" id="" />
                        </div>
                    </div>
                    <div className="add-product-info-wrap">
                        <div className="add-product-info-label">Price : </div>
                        <div className="add-product-input-wrap">
                            <input type="number" name="" id="" />
                        </div>
                    </div>
                    <div className="add-product-info-wrap">
                        <div className="add-product-info-label">Detail : </div>
                        <div className="add-product-input-wrap">
                            <textarea name="" id="" />
                        </div>
                    </div>
                    <div className="add-product-info-wrap">
                        <div className="add-product-info-label">Quantity : </div>
                        <div className="add-product-input-wrap">
                            <input type="number" name="" id="" step={1} value={1} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="add-product-btn-wrap">
                <div className="btn bg-team-blue text-white">Add Product</div>
            </div>
        </div>
    )
}

export default AddProduct;
