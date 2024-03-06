import "./Menu.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTruck, faHistory, faWallet, faGear, faCartShopping, } from "@fortawesome/free-solid-svg-icons";

function Menu() {
    return (
        <div className="menu-container">
            <Link to="/supplier" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faHouse} />
                    </div>
                    <div className="menu-label">Home</div>
                </div>
            </Link>
            <Link to="/supplier/delivery" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faTruck} />
                    </div>
                    <div className="menu-label">Delivery</div>
                </div>
            </Link>
            <Link to="/supplier/history" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faHistory} />
                    </div>
                    <div className="menu-label">History</div>
                </div>
            </Link>
            <Link to="/supplier/wallet" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faWallet} />
                    </div>
                    <div className="menu-label">Wallet</div>
                </div>
            </Link>
            <Link to="/supplier/settings" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faGear} />
                    </div>
                    <div className="menu-label">Setting</div>
                </div>
            </Link>
            <Link to="/supplier/cart" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>
                    <div className="menu-label">Cart</div>
                </div>
            </Link>
        </div>
    );
}

export default Menu;
