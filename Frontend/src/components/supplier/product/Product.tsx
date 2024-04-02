import './Product.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { environments } from '../../../environment/environment';
import { faCircleXmark, faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from '../../commons/alert/Alert';


function Product() {
    const { productId } = useParams();


    const [isEditing, setIsEditing] = useState(false);
    const [productData, setProductData] = useState({} as ProductData);
    const [productImage, setproductImage] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productQuantity, setProductQuantity] = useState(1);
    const [productDescription, setProductDescription] = useState('');
    const [alertProps, setAlertProps] = useState<AlertStructure>({} as AlertStructure);
    const [isAlert, setisAlert] = useState(false);

    const handleAlert = (structure: AlertStructure) => {
        if (!isAlert) {
            setAlertProps(structure)
        }
        setisAlert(!isAlert)
    }

    const getProductList = async () => {
        try {
            const response = await axios.get<ProductData>(`${environments.paths.getProductData}/${productId}`, { withCredentials: true });
            if (response.data) {
                setProductData(response.data);
                setproductImage(productData.productImage);
                setProductName(productData.productName);
                setProductPrice(productData.productPrice);
                setProductQuantity(productData.productQuantity);
                setProductDescription(productData.productDescription);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleIsEditing = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setproductImage(productData.productImage);
            setProductName(productData.productName);
            setProductPrice(productData.productPrice);
            setProductQuantity(productData.productQuantity);
            setProductDescription(productData.productDescription);
        }
    }

    const updateProduct = async () => {
        if (productImage.trim() === '' || productName.trim() === '' || productPrice <= 0 || productQuantity <= 0 || productDescription.trim() === '') {
            // alert("กรุณากรอกข้อมูลให้ถูกต้อง")
            handleAlert(
                {
                    headerText: 'อัพเดทสินค้า',
                    contentText: 'กรุณากรอกข้อมูลให้ถูกต้อง',
                    btn1: {
                        btnText: 'ยืนยัน',
                        btnFunc: () => { setisAlert(false)}
                    }
                }
            )
            return
        }
        const body: ProductData = {
            productId: productData.productId,
            productImage: productImage,
            productName: productName,
            productDescription: productDescription,
            productPrice: productPrice,
            productQuantity: productQuantity
        }
        const response = await axios.post(environments.paths.updateProduct, body, { withCredentials: true })

        if (response.status !== 200) {
            handleAlert(
                {
                    headerText: 'อัพเดทสินค้า',
                    contentText: 'มีข้อผิดพลาดเกิดขึ้น',
                    btn1: {
                        btnText: 'ยืนยัน',
                        btnFunc: () => { 
                            setisAlert(false);  
                        }
                    }
                }
            )
            handleIsEditing();
            return
        }
        setProductData(body)
        handleAlert(
            {
                headerText: 'อัพเดทสินค้า',
                contentText: 'อัพเดทสินค้าเสร็จสิ้น',
                btn1: {
                    btnText: 'ยืนยัน',
                    btnFunc: () => { setisAlert(false) }
                }
            }
        )
        handleIsEditing();
    }

    const handleInsertImage = () => {
        document.getElementById('product-img-input')?.click()
    }

    const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(event.target.value);
    }

    const handleProductPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductPrice(Number(event.target.value));
    }

    const handleProductQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductQuantity(Number(event.target.value));
    }

    const handleProductDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProductDescription(event.target.value);
    }

    const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result;
                    if (base64String) {
                        setproductImage(String(base64String));
                    } else {
                        setproductImage('');
                    }
                };
                reader.readAsDataURL(file);
            }
        }

    };



    useEffect(() => {
        getProductList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='product-prod-page-container'>
            <div className="product-prod-data">
                {!isEditing && (
                    <>
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
                                <div className="product-prod-info-label">เหลือ : </div>
                                <div className="product-prod-quan">{productData.productQuantity}</div>
                            </div>
                            <div className="product-prod-info-wrap">
                                <div className="product-prod-info-label">รายละเอียด : </div>
                                <div className="product-prod-detail">{productData.productDescription}</div>
                            </div>
                        </div>
                    </>
                )}
                {isEditing && (
                    <>
                        <div className="add-product-img-wrap">
                            {productImage !== '' && (
                                <>
                                    <div className="product-prod-img-wrap">
                                        <img src={productImage} alt="" className="product-prod-img" />
                                    </div>
                                    <div className="close-icon" onClick={() => {
                                        setproductImage('');
                                    }}>
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </div>
                                </>
                            )}
                            {productImage === '' && (
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
                                <div className="add-product-info-label">ชื่อ : </div>
                                <div className="add-product-input-wrap">
                                    <input type="text" name="" id="" value={productName} onChange={handleProductNameChange} />
                                </div>
                            </div>
                            <div className="add-product-info-wrap">
                                <div className="add-product-info-label">ราคา : </div>
                                <div className="add-product-input-wrap">
                                    <input type="number" name="" id="" value={productPrice} onChange={handleProductPriceChange} />
                                </div>
                            </div>
                            <div className="add-product-info-wrap">
                                <div className="add-product-info-label">จำนวน : </div>
                                <div className="add-product-input-wrap">
                                    <input type="number" name="" id="" step={1} value={productQuantity} onChange={handleProductQuantityChange} />
                                </div>
                            </div>
                            <div className="add-product-info-wrap">
                                <div className="add-product-info-label">รายละเอียด : </div>
                                <div className="add-product-input-wrap">
                                    <textarea name="" id="" value={productDescription} onChange={handleProductDescriptionChange} />
                                </div>
                            </div>

                        </div>
                    </>
                )}

                <div className="sup-product-prod-btn-wrap">
                    {isEditing && (
                        <>
                            <div className="btn text-white bg-light-gray atc-btn" onClick={handleIsEditing}>ยกเลิก</div>
                            <div className="btn text-white atc-btn" onClick={updateProduct}>อัพเดท</div>
                        </>
                    )}
                    {!isEditing && (
                        <>
                            <div className="btn text-white bg-red atc-btn" onClick={handleIsEditing}>ลบสินค้า</div>
                            <div className="btn text-white atc-btn" onClick={handleIsEditing}>อัพเดท</div>
                        </>
                    )}
                </div>
            </div>
            {isAlert && (
                <Alert
                    headerText={alertProps?.headerText || ''}
                    contentText={alertProps?.contentText || ''}
                    btn1={alertProps?.btn1}
                    btn2={alertProps?.btn2}
                />
            )}
        </div>
    )
}

export default Product;
