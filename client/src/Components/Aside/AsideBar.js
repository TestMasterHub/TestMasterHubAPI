import React from "react";
import { Link } from "react-router-dom";
import styles from "../../Styles/NavFooterStyles/Aside.module.css";
export default function AsideBar() {
  return (
    <div className={styles.AsideMainWrapper}>
      <div className={styles.OptionWrapper}>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper}>Collection</Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper}>Environments</Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper}>Build</Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper}>Reports</Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper}>Monitors</Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper}>Settings</Link>
        </div>
      </div>
    </div>
  );
}
