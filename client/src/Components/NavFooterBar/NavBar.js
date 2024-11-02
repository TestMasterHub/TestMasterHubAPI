import { Link } from "react-router-dom";
import styles from "../../Styles/NavFooterStyles/NavBar.module.css";

function Navbar() {
  const NavBar_Feature_Flag = false;
  return (
    <div className={styles.NavbarMainWrapper}>
      <h2>TestMasterHub-Test</h2>
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
      {NavBar_Feature_Flag && (
        <div className={styles.ProfileMainWrapper}>
          <div className={styles.ProfileIcon}>Admin</div>
          <button className={styles.Logoutbtn}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
