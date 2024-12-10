import { Link } from "react-router-dom";
import styles from "../../Styles/NavFooterStyles/NavBar.module.css";

function Navbar() {
  return (
    <div className={styles.NavbarMainWrapper}>
      <h2>TestMasterHub-QA</h2>
      <div className={styles.LinkMainWrapper}>
        <Link
          to={"/community"}
          className={styles.LinkStyles}
          target="_blank"
          rel="noopener noreferrer"
        >
          Community
        </Link>
        <Link
          to={"/resources"}
          className={styles.LinkStyles}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resources
        </Link>
        <Link
          to={"/changelog"}
          className={styles.LinkStyles}
          target="_blank"
          rel="noopener noreferrer"
        >
          ChangeLog
        </Link>
        <Link
          to={"/"}
          className={styles.LinkStyles}
          target="_blank"
          rel="noopener noreferrer"
        >
          Update
        </Link>
      </div>
      <div className={styles.ProfileMainWrapper}>
        <div className={styles.ProfileIcon}>Admin</div>
        <button className={styles.Logoutbtn}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
