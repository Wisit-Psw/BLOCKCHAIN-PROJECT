import './SupAddProduct.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import { faCircleXmark, faAdd } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { environments } from '../../../environment/environment';
import Alert from '../../commons/alert/Alert';

function AddProduct() {
    const [prodImage, setprodImage] = useState('');
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
                        setprodImage(String(base64String));
                    } else {
                        setprodImage('');
                    }
                };
                reader.readAsDataURL(file);
            }
        }

    };

    const addProduct = async () => {
        if (prodImage.trim() === '' || productName.trim() === '' || productPrice === 0 || productQuantity <= 0 || productDescription.trim() === '') {

            handleAlert(
                {
                    headerText: 'อัพเดทสินค้า',
                    contentText: 'กรุณากรอกข้อมูลให้ถูกต้อง',
                    btn1: {
                        btnText: 'ยืนยัน',
                        btnFunc: () => { setisAlert(false) }
                    }
                }
            )
            return
        }

        const response = await axios.post(environments.paths.addProduct, {
            productImage: prodImage,
            productName: productName,
            productDescription: productDescription,
            productPrice: productPrice,
            productQuantity: productQuantity
        }, { withCredentials: true })

        if (response.status !== 201) {
            handleAlert({
                headerText: "เพิ่มสินค้า",
                contentText: "มีข้อผิดพลาดเกิดขึ้น",
                btn1: {
                    btnText: "ยืนยัน",
                    btnFunc: () => { setisAlert(false) }
                }
            })
            return
        }
        handleAlert({
            headerText: "เพิ่มสินค้า",
            contentText: "เพิ่มสินค้าเสร็จสิ้น",
            btn1: {
                btnText: "ยืนยัน",
                btnFunc: () => {
                    setprodImage('');
                    setProductName('');
                    setProductPrice(0);
                    setProductQuantity(1);
                    setProductDescription('');
                    setisAlert(false);
                }
            }
        })
    }

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
            </div>
            <div className="add-product-btn-wrap">
                <div className="btn team-btn text-white ap-btn" onClick={addProduct}>Add Product</div>
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

export default AddProduct;
