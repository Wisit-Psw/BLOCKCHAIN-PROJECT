import './navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
function NavBar() {
    return (
        <div className='navbar-container'>
            <div className="logo-wrap">
                <label className='logo-text text-team'>BANGPAN</label>
            </div>
            <div className="search-container-wrap">
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
            </div>

            <div className="logo-wrap">
                {/* <label className='logo-text text-team'>Bangpan</label> */}
            </div>
        </div>
    )
}

export default NavBar
