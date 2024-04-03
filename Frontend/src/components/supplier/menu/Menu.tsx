import "./Menu.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faClipboardList, faAdd , faCreditCard, faCirclePlus} from "@fortawesome/free-solid-svg-icons";

function Menu() {
    return (
        <div className="menu-container">
            <Link to="/" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faHouse} />
                    </div>
                    <div className="menu-label">หน้าหลัก</div>
                </div>
            </Link>
            <Link to="/order" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <div className="menu-label">ออเดอร์</div>
                </div>
            </Link>
            <Link to="/add" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faAdd} />
                    </div>
                    <div className="menu-label">เพิ่มสินค้า</div>
                </div>
            </Link>
            <Link to="/credit-req" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faCreditCard} />
                        <FontAwesomeIcon className="add-icon" icon={faCirclePlus} />
                    </div>
                    <div className="menu-label">คำขอเครดิต</div>
                </div>
            </Link>
            <Link to="/credit" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faCreditCard} />
                    </div>
                    <div className="menu-label">เครดิต</div>
                </div>
            </Link>
            
        </div>
    );
}

export default Menu;
