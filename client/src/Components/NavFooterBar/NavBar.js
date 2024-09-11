import { Link } from "react-router-dom";

import styles from '../../Styles/NavFooterStyles/NavBar.module.css';

function Navbar() {
    return (
        <div className={styles.NavbarMainWrapper}>
            <h2>TestMasterHub</h2>
            <div className={styles.LinkMainWrapper}>
                <Link to={'/'} className={styles.LinkStyles}>Community</Link>
                <Link to={'/'} className={styles.LinkStyles}>Resources</Link>
                <Link to={'/'} className={styles.LinkStyles}>ChangeLog</Link>
                <Link to={'/'} className={styles.LinkStyles}>Update</Link>
            </div>
            <div className={styles.ProfileMainWrapper}>
                <div className={styles.ProfileIcon}>
                  Admin  
                </div>
                <button className={styles.Logoutbtn}>Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
