import './Navbar.css'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
// faTruck
function NavBar() {
    return (
        <div className='navbar-container'>
            <div className="logo-wrap">
                <label className='logo-text'>แบ่งปั๋น</label>
            </div>
            {/* <div className="search-container-wrap">
                <div className="search-container text-light-gray">
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="search"
                        />
                    </div>
                </div>
            </div> */}
            <div className="nav-menu">
                <Link to="/settings" >
                    <div className="menu-wrap">
                        <div className="menu-icon">
                            <FontAwesomeIcon icon={faGear} />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default NavBar
