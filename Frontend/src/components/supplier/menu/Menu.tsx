import "./Menu.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTruck, faGear, faClipboardList, faAdd , faCreditCard} from "@fortawesome/free-solid-svg-icons";

function Menu() {
    return (
        <div className="menu-container">
            <Link to="/" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faHouse} />
                    </div>
                    <div className="menu-label">Home</div>
                </div>
            </Link>
            <Link to="/delivery" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faTruck} />
                    </div>
                    <div className="menu-label">Delivery</div>
                </div>
            </Link>
            <Link to="/add" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faAdd} />
                    </div>
                    <div className="menu-label">Add</div>
                </div>
            </Link>
            <Link to="/credit" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faCreditCard} />
                    </div>
                    <div className="menu-label">Credit</div>
                </div>
            </Link>
            <Link to="/settings" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faGear} />
                    </div>
                    <div className="menu-label">Setting</div>
                </div>
            </Link>
            <Link to="/cart" >
                <div className="menu-wrap">
                    <div className="menu-icon">
                        <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <div className="menu-label">Order</div>
                </div>
            </Link>
        </div>
    );
}

export default Menu;
