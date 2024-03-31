import "./Menu.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faHistory, faWallet, faCartShopping, } from "@fortawesome/free-solid-svg-icons";
// faTruck
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
            <Link to="/history" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faHistory} />
                    </div>
                    <div className="menu-label">ประวัติ</div>
                </div>
            </Link>
            <Link to="/wallet" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faWallet} />
                    </div>
                    <div className="menu-label">กระเป๋า</div>
                </div>
            </Link>

            <Link to="/cart" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>
                    <div className="menu-label">ตะกล้า</div>
                </div>
            </Link>
        </div>
    );
}

export default Menu;
